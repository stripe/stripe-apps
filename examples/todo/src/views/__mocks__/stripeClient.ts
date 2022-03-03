import Stripe from 'stripe';
import {customer} from './mockObjects';

const client = {
  customers: {
    retrieve: jest.fn<Promise<Stripe.Customer>, []>(() => Promise.resolve(customer)),
    update: jest.fn(),
  },
};

export default client;