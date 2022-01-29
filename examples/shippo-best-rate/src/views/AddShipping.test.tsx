import AddShipping from './AddShipping';
import type {TailorExtensionContextValue} from '@stripe/ui-extension-sdk/context';
import {render} from '@stripe/ui-extension-sdk/testing';
import { invoice } from '../test/mock_objects';
import Stripe from 'stripe';

jest.mock('./stripe_client', () => ({
  __esModule: true,
  default: {
    invoices: {
      retrieve: (): Promise<Stripe.Invoice> => Promise.resolve(invoice),
      update: jest.fn(),
    },
    invoiceItems: {
      create: jest.fn(),
      del: jest.fn(),
    },
  }
}));

describe('AddShipping component', () => {
  it('Renders a loader and then the RatePicker', async () => {
    const context: TailorExtensionContextValue = {
      userContext: {
        id: 'usr_1234',
        email: 'user@example.com',
        name: 'Test user',
        account: {
            id: 'acct_1234',
            name: 'Test business',
        },
        permissions: [
          'invoice.read',
          'invoice.write',
        ],
      },
      environment: {
        mode: 'test',
        viewportID: 'stripe.dashboard.invoice.detail',
        objectContext: {
          id: 'inv_1234',
          object: 'invoice',
        },
      },
    };
    const {wrapper} = render(<AddShipping {...context} />);
    expect(wrapper).toContainText('Loading');
  });
});