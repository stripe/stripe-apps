import Stripe from 'stripe';
import {createHttpClient, STRIPE_API_KEY} from '@stripe/ui-extension-sdk/http_client';

const httpClient = createHttpClient();
const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient,
  apiVersion: '2020-08-27',
});

export default stripeClient;