import {
  Box,
  Img,
  List,
  ListItem,
  Spinner
} from '@stripe/ui-extension-sdk/ui';
import { useCallback, useEffect, useState } from 'react';
import Stripe from 'stripe';
import invariant from 'ts-invariant';
import type { ShippingDetailsMetadata } from './ShippingDetails';
import type { Rate, Shipment } from './shippo_types';
import stripeClient from './stripe_client';
import { request as shippoRequest } from './shippo_client';

const addShippingLineItem = async (rate: Rate, invoiceId: string, customerId: string) => {
  return stripeClient.invoiceItems.create({
    amount: Math.round(parseFloat(rate.amount) * 100),
    currency: rate.currency,
    description: `${rate.provider} ${rate.servicelevel.name}`,
    invoice: invoiceId,
    customer: customerId,
  });
};

const createShippingLabel = async (rate: Rate) => {
  const resp = await shippoRequest(
    'transactions',
    'POST',
    JSON.stringify({
      rate: rate.object_id,
      label_file_type: 'PDF',
      async: false,
    }),
  );
  return resp.json();
};

const updateInvoiceMetadata = async (
  invoiceId: string,
  shippingDetails: ShippingDetailsMetadata,
) => {
  return stripeClient.invoices.update(invoiceId, {
    metadata: { ...shippingDetails },
  });
};

const FROM_ADDRESS = {
  name: 'US Mousetraps West',
  street1: '354 Oyster Point Blvd',
  city: 'South San Francisco',
  state: 'CA',
  zip: '94080',
  country: 'US',
  phone: '4151234567',
  email: 'mousetrapper@example.com',
};

type RatePickerProps = {
  invoice: Stripe.Invoice,
  onRatePicked: (p: ShippingDetailsMetadata) => void,
};
const RatePicker = ({ invoice, onRatePicked }: RatePickerProps) => {
  const [shipment, setShipment] = useState<Shipment>();
  const [creatingLabel, setCreatingLabel] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const addr = invoice.customer_address;
        invariant(addr, 'Missing customer address');
        const resp = await shippoRequest(
          'shipments',
          'POST',
          JSON.stringify({
            address_from: FROM_ADDRESS,
            address_to: {
              name: invoice.customer_name,
              street1: addr.line1,
              street2: addr.line2,
              city: addr.city,
              state: addr.state,
              zip: addr.postal_code,
              country: addr.country,
            },
            parcels: [
              {
                length: 3.9,
                width: 2.8,
                height: 0.6,
                distance_unit: 'in',
                weight: 0.05,
                mass_unit: 'lb',
              },
            ],
            async: false,
          }),
        );
        if (resp.ok) {
          setShipment(await resp.json());
        }
      } catch (exc) {
        if (exc instanceof Error) {
          setErrorMessage(`Could not load rates: ${exc?.message}`);
        }
      }
    })();
  }, []);

  const handleRatePicked = useCallback(async (invoice, rate, shipment) => {
    setCreatingLabel(true);
    try {
      const label = await createShippingLabel(rate);
      const invoiceItem = await addShippingLineItem(rate, invoice.id, invoice.customer);
      const shippingDetails = {
        rateId: rate.object_id,
        shipmentId: shipment.object_id,
        labelId: label.object_id,
        service: `${rate.provider} ${rate.servicelevel.name}`,
        trackingUrl: label.tracking_url_provider,
        labelUrl: label.label_url,
        invoiceItemId: invoiceItem.id,
      };
      await updateInvoiceMetadata(invoice.id, shippingDetails);
      // Update state to reflect that a rate has been chosen
      onRatePicked(shippingDetails);
    } finally {
      setCreatingLabel(false);
    }
  }, []);

  if (errorMessage) {
    return <Box>{errorMessage}</Box>;
  }
  if (!shipment) {
    return (
      <Box css={{ layout: 'column', alignX: 'center', gap: 'medium' }}>
        <Spinner />Loading shipping rates from Shippo
      </Box>
    );
  }
  if (creatingLabel) {
    return (
      <Box css={{ layout: 'column', alignX: 'center', gap: 'medium' }}>
        <Spinner />Creating shipping label
      </Box>
    );
  }
  const rateMap: { [object_id: string]: Rate } = {};
  const rateItems = shipment.rates.map((rate) => {
    rateMap[rate.object_id] = rate;
    return (
      <ListItem
        key={rate.object_id}
        id={rate.object_id}
        value={rate.amount}
        title={
          <Box css={{
            layout: 'row',
            gap: 'small',
            alignY: 'top',
          }}>
            <Box css={{ padding: 'xxsmall' }}>
              <Img src={rate.provider_image_75} height="12" />
            </Box>
            <Box>
              {`${rate.provider} ${rate.servicelevel.name}`}
            </Box>
          </Box>
        }
        secondaryTitle={<Box>{rate.duration_terms}</Box>}
      >
      </ListItem>
    );
  });
  return <List onAction={(object_id) => {
    const rate = rateMap[object_id];
    handleRatePicked(invoice, rate, shipment)
  }
  }>{rateItems}</List>;

};

export default RatePicker;
