import Stripe from 'stripe';
import {createHttpClient} from '@stripe/ui-extension-sdk/http_client';

const stripeClient = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    httpClient: createHttpClient(),
    apiVersion: '2020-08-27',
  }
);

export default stripeClient;
