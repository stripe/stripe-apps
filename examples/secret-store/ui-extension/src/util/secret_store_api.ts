import Stripe from 'stripe';
import {createHttpClient, STRIPE_API_KEY} from '@stripe/ui-extension-sdk/http_client';

interface Secret {
  id: string;
  name: string;
  payload: string;
}

const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient() as Stripe.HttpClient,
  apiVersion: '2020-08-27',
});

const addSecret = async (userId: string, name: string, value: string) => {
  const apiPath = `apps/secrets?scope[type]=user&scope[user]=${userId}&name=${name}`;

  // Create a `StripeResource` to load the custom Secret Store API endpoint.
  const CreateSecretResource = Stripe.StripeResource.extend({
    request: Stripe.StripeResource.method({
    method: 'POST',
    path: apiPath,
    }) as (...args: any[]) => Promise<Secret>,
  });
  const secretResource = new CreateSecretResource(stripe);

  // Add secret to the Secret Store API; returns either error or secret object.
  return await secretResource.request({payload: value});
};

const getSecret = async (userId: string, name: string) => {
  const apiPath = `apps/secrets/find?scope[type]=user&scope[user]=${userId}&name=${name}&expand[]=payload`;

  // Create a `StripeResource` to load the custom Secret Store API endpoint.
  const GetSecretResource = Stripe.StripeResource.extend({
    request: Stripe.StripeResource.method({
      method: 'GET',
      path: apiPath,
    }) as () => Promise<Secret>,
  });
  const secretResource = new GetSecretResource(stripe);

  // Get secret from the Secret Store API; returns either error or secret object.
  return await secretResource.request();
};

const deleteSecret = async (userId: string, name: string) => {
  const apiPath = `apps/secrets/delete?scope[type]=user&scope[user]=${userId}&name=${name}`;

  // Create a `StripeResource` to load the custom Secret Store API endpoint.
  const DeleteSecretResource = Stripe.StripeResource.extend({
    request: Stripe.StripeResource.method({
      method: 'POST',
      path: apiPath,
    }) as () => Promise<Secret>,
  });
  const secretResource = new DeleteSecretResource(stripe);

  // Delete secret from the Secret Store API; returns either error or secret object.
  return await secretResource.request();
};

export { addSecret, getSecret, deleteSecret };
