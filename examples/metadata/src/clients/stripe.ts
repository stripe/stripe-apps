import Stripe from 'stripe';
import {createHttpClient, STRIPE_API_KEY} from '@stripe/ui-extension-sdk/http_client';

const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

export default stripeClient;