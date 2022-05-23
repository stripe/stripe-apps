import {useState, useEffect} from 'react';
import type {Stripe} from "stripe";
import stripeClient from '../clients/stripe';
import {getDashboardUserEmail} from '@stripe/ui-extension-sdk/utils';

export const useCustomer = (customerId?: string) => {
  if (!customerId) {
    return null;
  }

  const [customer, setCustomer] = useState<Stripe.Customer | Stripe.DeletedCustomer | null>(null);

  const loadCustomer = async () => {
    const customer = await stripeClient.customers.retrieve(customerId);

    setCustomer(customer);
  };

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  return customer;
};

export const useDashboardUserEmail = () => {
  const [customer, setCustomer] = useState<string | null>(null);

  const loadEmail = async () => {
    try {
      const {email} = await getDashboardUserEmail();
      setCustomer(email);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadEmail();
  }, []);

  return customer;
};
