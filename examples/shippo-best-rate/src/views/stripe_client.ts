import Stripe from 'stripe';
import {createHttpClient} from '@stripe/tailor-browser-sdk';

const stripeClient = new Stripe(process.env.STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

export default stripeClient;
