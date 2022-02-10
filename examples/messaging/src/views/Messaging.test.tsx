import {render} from '@stripe/ui-extension-sdk/testing';
import {List, Badge} from '@stripe/ui-extension-sdk/ui';
import Messaging from './Messaging';
import stripeClient from '../clients/stripe';

jest.mock('../clients/stripe');
const mockCustomersRetrieve = stripeClient.customers.retrieve as jest.Mock;

describe('Messaging', () => {
  it('opens a message and renders the date badge', async () => {
    const {wrapper, update} = render(
      <Messaging
        environment={{
          objectContext: { id: 'test', object: 'customer' },
          mode: 'test',
          viewportID: 'test',
        }}
      />
    );

    await update();

    // Expect the first subject line appears in the list
    expect(wrapper).toContainText('Refund processing');

    // Open the first message
    wrapper.find(List)!.trigger('onAction', '1');

    // Expect the date badge to appear
    expect(wrapper.find(Badge)).toContainText('Test date');
  });

  it('renders the customer email in the footer', async () => {
    const customerEmail = 'customer@example.com';

    mockCustomersRetrieve.mockResolvedValue({
      email: customerEmail,
    });

    const {wrapper, update} = render(
      <Messaging
        environment={{
          objectContext: { id: 'test', object: 'customer' },
          mode: 'test',
          viewportID: 'test',
        }}
      />
    );

    await update();

    expect(wrapper).toContainText(customerEmail);
  });
});
