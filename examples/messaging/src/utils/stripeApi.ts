import React from 'react';
import type {Stripe} from "stripe";
import stripeClient from '../clients/stripe';

export const useCustomer = (customerId?: string) => {
  if (!customerId) {
    return null;
  }

  const [customer, setCustomer] =
    React.useState<Stripe.Customer | Stripe.DeletedCustomer | null>(null);

  const loadCustomer = async () => {
    const customer = await stripeClient.customers.retrieve(customerId);

    setCustomer(customer);
  };

  React.useEffect(() => {
    loadCustomer();
  }, [customerId]);

  return customer;
};
