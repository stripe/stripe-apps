import Stripe from 'stripe';

export type TokenSet = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires: Date;
};

export type StripeData =
  | Stripe.ApiListPromise<Stripe.Customer>
  | Stripe.ApiListPromise<Stripe.Charge>
  | Stripe.ApiListPromise<Stripe.Product>
  | { data: [] };
