import Stripe from 'stripe';
import {invoice, invoiceItem} from './mock_objects';

const client = {
  invoices: {
    retrieve: jest.fn<Promise<Stripe.Invoice>, []>(() => Promise.resolve(invoice)),
    update: jest.fn(),
  },
  invoiceItems: {
    create: jest.fn<Promise<Stripe.InvoiceItem>, [Stripe.InvoiceItemCreateParams]>(() => Promise.resolve(invoiceItem)),
    del: jest.fn(),
  },
};

export default client;