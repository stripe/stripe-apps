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

// Since Secret Store isn't in the SDK yet, we create a new Stripe resource with the information
// needed to send requests to the Secret Store API.
const SecretResource = Stripe.StripeResource.extend({
  find: Stripe.StripeResource.method({
    method: 'GET',
    path: 'apps/secrets/find',
  }) as (...args: any[]) => Promise<Secret>,
  set: Stripe.StripeResource.method({
    method: 'POST',
    path: 'apps/secrets'
  }) as (...args: any[]) => Promise<Secret>,
  delete: Stripe.StripeResource.method({
    method: 'POST',
    path: 'apps/secrets/delete'
  }) as (...args: any[]) => Promise<Secret>,
});
const secretResource = new SecretResource(stripe);

const addSecret = async (userId: string, name: string, value: string) => {
  // Add secret to the Secret Store API; returns either error or secret object.
  return await secretResource.set({'scope[user]': userId, 'scope[type]': 'user', name: name, payload: value});
};

const getSecret = async (userId: string, name: string) => {
  // Get secret from the Secret Store API; returns either error or secret object.
  return await secretResource.find({'scope[user]': userId, 'scope[type]': 'user', name: name, 'expand[]': 'payload'});
};

const deleteSecret = async (userId: string, name: string) => {
  // Delete secret from the Secret Store API; returns either error or secret object.
  return await secretResource.delete({'scope[user]': userId, 'scope[type]': 'user', name: name});
};

export { addSecret, getSecret, deleteSecret };
