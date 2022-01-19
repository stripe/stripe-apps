import Stripe from 'stripe';
import {createHttpClient} from '@stripe/ui-extension-sdk/http_client';

export const stripeClient = new Stripe(
    process.env.STRIPE_API_KEY as string,
    {
        httpClient: createHttpClient() as Stripe.HttpClient,
        apiVersion: '2020-08-27'
    }
);