import AddShipping from './AddShipping';
import type {TailorExtensionContextValue} from '@stripe/ui-extension-sdk/context';
import {render} from '@stripe/ui-extension-sdk/testing';
import {List} from '@stripe/ui-extension-sdk/ui';

jest.mock('./stripe_client');
jest.mock('./shippo_client');

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
    const {wrapper, update} = render(<AddShipping {...context} />);
    expect(wrapper).toContainText('Loading');
    // First wait for loading the invoice
    await update();
    // Second wait for getting rates from shippo
    await update();
    expect(wrapper).toContainComponent(List);
  });
});