import {
  Badge, Box, Inline,
  List,
  ListItem
} from '@stripe/ui-extension-sdk/ui';
import { useCallback, useEffect, useState } from 'react';
import Stripe from 'stripe';
import type { ShippingDetailsMetadata } from './ShippingDetails';
import type { Rate, Shipment } from './shippo_types';
import stripeClient from './stripe_client';



const SHIPPO_TOKEN =
  'ShippoToken shippo_test_ccc7f1c4ed9ef8beaa43c07b2941e2260f40fd72';

const addShippingLineItem = async (rate: Rate, invoiceId: string, customerId: string) => {
  return stripeClient.invoiceItems.create({
    amount: Math.round(parseFloat(rate.amount) * 100),
    currency: rate.currency,
    description: `${rate.provider} ${rate.servicelevel.name}`,
    invoice: invoiceId,
    customer: customerId,
  });
};

const shippoRequest = (endpoint: string, method: 'GET' | 'POST', requestData: string) => {
  return fetch(`https://api.goshippo.com/${endpoint}`, {
    method,
    headers: {
      Authorization: SHIPPO_TOKEN,
      'Content-Type': 'application/json',
    },
    body: requestData,
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
    metadata: {...shippingDetails},
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
  invoice: Stripe.Response<Stripe.Invoice>,
  onRatePicked: (p: ShippingDetailsMetadata) => void,
};
const RatePicker = ({invoice, onRatePicked}: RatePickerProps) => {
  const [shipment, setShipment] = useState<Shipment>();
  const [customer, setCustomer] = useState<Stripe.Response<Stripe.Customer>>();
  const [creatingLabel, setCreatingLabel] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    (async () => {
      try {
        if (typeof invoice.customer !== 'string')
          throw new Error('Expected customer not to be expanded');
        const customer = await stripeClient.customers.retrieve(
          invoice.customer,
        );
        if (customer.deleted === true) throw new Error('Customer is deleted');
        if (!customer.address) throw new Error('Missing customer address');
        setCustomer(customer);
        const resp = await shippoRequest(
          'shipments',
          'POST',
          JSON.stringify({
            address_from: FROM_ADDRESS,
            address_to: {
              name: customer.name,
              street1: customer.address.line1,
              street2: customer.address.line2,
              city: customer.address.city,
              state: customer.address.state,
              zip: customer.address.postal_code,
              country: customer.address.country,
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
  if (!customer) {
    return <Box>Getting customer address&hellip;</Box>;
  }
  if (!shipment) {
    return <Box>Loading shipping rates from Shippo&hellip;</Box>;
  }
  if (creatingLabel) {
    return <Box>Creating shipping label&hellip;</Box>
  }
  const rateMap: {[object_id: string]: Rate} = {};
  const rateItems = shipment.rates.map((rate) => {
    const attributePills = (rate.attributes as Array<string>).map((attr, i) => (
      <Badge key={i} type="info">{attr}</Badge>
    ));
    rateMap[rate.object_id] = rate;
    // This uses some undocumented CSS properties that may stop working in the future.
    // USE AT YOUR OWN RISK!
    const backgroundCSS: any = {
      backgroundImage: `url(${rate.provider_image_75})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center center',
      height: '16px',
      width: '16px',
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: '4px',
    };
    return (
      <ListItem
        key={rate.object_id}
        id={rate.object_id}
        value={rate.amount}
      >
        <Box><Inline css={backgroundCSS}/>{`${rate.provider} ${rate.servicelevel.name}`}</Box>
        <Box slot="description">{rate.duration_terms}</Box>
      </ListItem>
    );
  });
  return <List onAction={(object_id) => {
    const rate = rateMap[object_id];
    handleRatePicked(invoice, rate, shipment)}
  }>{rateItems}</List>;
        
};

export default RatePicker;
