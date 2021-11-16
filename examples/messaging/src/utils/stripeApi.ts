import React from 'react';
import stripeClient from '../clients/stripe';

export const useCustomer = (customerId: string) => {
  const [customer, setCustomer] = React.useState(null);

  const loadCustomer = async () => {
    const customer = await stripeClient.customers.retrieve(customerId);

    setCustomer(customer);
  };

  React.useEffect(() => {
    loadCustomer();
  }, [customerId]);

  return customer;
};
