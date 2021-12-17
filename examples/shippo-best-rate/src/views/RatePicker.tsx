import {
  Badge,
  SectionList,
  SectionListItem,
  View,
} from '@stripe/tailor-browser-sdk/ui';

import {useCallback, useEffect, useState} from 'react';
import Stripe from 'stripe';

import type {ShippingDetailsMetadata} from './ShippingDetails';
import type {Shipment, Rate} from './shippo_types';
import stripeClient from './stripe_client';

const SHIPPO_TOKEN =
  'ShippoToken shippo_test_ccc7f1c4ed9ef8beaa43c07b2941e2260f40fd72';

const addShippingLineItem = async (rate, invoiceId, customerId) => {
  return stripeClient.invoiceItems.create({
    amount: Math.round(parseFloat(rate.amount) * 100),
    currency: rate.currency,
    description: `${rate.provider} ${rate.servicelevel.name}`,
    invoice: invoiceId,
    customer: customerId,
  });
};

const shippoRequest = (endpoint, method, requestData) => {
  return fetch(`https://api.goshippo.com/${endpoint}/`, {
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
  street1: '20013 Sweetwater Springs Rd',
  city: 'Healdsburg',
  state: 'CA',
  zip: '95448',
  country: 'US',
  phone: '4151234567',
  email: 'jt+mousetraps@stripe.com',
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
        setErrorMessage(`Could not load rates: ${exc.message}`);
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
    return <View>{errorMessage}</View>;
  }
  if (!customer) {
    return <View>Getting customer address</View>;
  }
  if (!shipment) {
    return <View>Loading shipping rates from Shippo</View>;
  }
  if (creatingLabel) {
    return <View>Creating shipping label</View>
  }
  const rateItems = shipment.rates.map((rate) => {
    const attributePills = rate.attributes.map((attr, i) => (
      <Badge key={i} color="blue" label={attr} />
    ));
    return (
      <SectionListItem
        key={rate.object_id}
        value={rate.amount}
        size="large"
      >
        <View slot="icon"><img width="20" src={rate.provider_image_75} /></View>
        <View>{`${rate.provider} ${rate.servicelevel.name}`}</View>
        <View slot="description">{rate.duration_terms}</View>
      </SectionListItem>
    );
  });
  return <SectionList onAction={(key) => {
    // There's a bug with onAction so just picking a random rate for now
    const rate = shipment.rates[Math.round(Math.random() * shipment.rates.length)]
    handleRatePicked(invoice, rate, shipment)}
  }>{rateItems}</SectionList>;
        
};

export default RatePicker;
