import Stripe from 'stripe';
import {createHttpClient} from '@stripe/tailor-browser-sdk/http_client';

const httpClient = createHttpClient();
debugger;
const stripeClient = new Stripe(process.env.STRIPE_API_KEY, {
  httpClient,
  apiVersion: '2020-08-27',
});

export default stripeClient;
