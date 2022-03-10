import { useEffect, useState } from 'react';
import Stripe from 'stripe';

import { useRefreshDashboardData } from '@stripe/ui-extension-sdk/context';
import {
  STRIPE_API_KEY,
  createHttpClient,
} from '@stripe/ui-extension-sdk/http_client';

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

interface UpdateData extends Stripe.CustomerUpdateParams {
  metadata: {
    github_username: string | null;
  };
}

export const useCustomer = (id: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customer, setCustomer] =
    useState<Stripe.Response<Stripe.Customer> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const refreshDashboardData = useRefreshDashboardData();

  useEffect(() => {
    getCustomer(id);
  }, [id]);

  async function getCustomer(id: string) {
    setIsLoading(true);
    try {
      const retrievedCustomer = await stripe.customers.retrieve(id);
      if (retrievedCustomer.deleted !== true) setCustomer(retrievedCustomer);
      setIsLoading(false);
    } catch (error) {
      setError(error as Error);
      setIsLoading(false);
    }
  }

  async function updateCustomer(updateData: UpdateData) {
    try {
      if (customer) {
        await stripe.customers.update(customer.id, { ...updateData });
        refreshDashboardData();
        getCustomer(id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return { isLoading, customer, error, updateCustomer };
};
