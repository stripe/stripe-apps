import Stripe from 'stripe';
import {createHttpClient, STRIPE_API_KEY} from '@stripe/ui-extension-sdk/http_client';

export const stripeClient = new Stripe(
    STRIPE_API_KEY,
    {
        httpClient: createHttpClient() as Stripe.HttpClient,
        apiVersion: '2020-08-27'
    }
);