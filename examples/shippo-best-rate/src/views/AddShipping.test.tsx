import AddShipping from './AddShipping';
import {render, getMockContextProps} from '@stripe/ui-extension-sdk/testing';
import {List} from '@stripe/ui-extension-sdk/ui';

jest.mock('./stripe_client');
jest.mock('./shippo_client');

describe('AddShipping component', () => {
  it('Renders a loader and then the RatePicker', async () => {
    const context = getMockContextProps();
    const {wrapper, update} = render(<AddShipping {...context} />);
    expect(wrapper).toContainText('Loading');
    // First wait for loading the invoice
    await update();
    // Second wait for getting rates from shippo
    await update();
    expect(wrapper).toContainComponent(List);
  });
});
