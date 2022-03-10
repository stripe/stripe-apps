import Stripe from 'stripe';

import { stripeAPIKey } from '../config';
import {
  customerFields,
  paymentFields,
  productFields,
} from '../spreadsheetFields';
import { StripeData } from '../types';

const stripe = new Stripe(stripeAPIKey, {
  apiVersion: '2020-08-27',
});

async function fetchData(category: string): Promise<StripeData> {
  switch (category.toLowerCase()) {
    case 'customers':
      return await stripe.customers.list();
    case 'payments':
      return await stripe.charges.list();
    case 'products':
      return await stripe.products.list();
    default:
      return null;
  }
}

function fetchStripeFields(category: string) {
  switch (category.toLowerCase()) {
    case 'customers':
      return customerFields;
    case 'payments':
      return paymentFields;
    case 'products':
      return productFields;
    default:
      return {};
  }
}

export async function fetchStripeData(category: string) {
  const stripeData = await fetchData(category);
  const stripeFields = fetchStripeFields(category);

  const filteredData = stripeData.data.map(row => {
    return Object.keys(stripeFields).map(field => row[field]);
  });

  return {
    data: filteredData,
    fields: Object.values(stripeFields),
  };
}
