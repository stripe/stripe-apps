import { render, getMockContextProps } from '@stripe/ui-extension-sdk/testing';
import { Button, TextField, List, ListItem } from '@stripe/ui-extension-sdk/ui';
import TodoApp from './TodoApp';

import { ChangeEvent } from 'react';

jest.mock('./stripeClient');

describe('TodoApp', () => {
  // default mock props
  const context = getMockContextProps();

  it('renders the app correctly', async () => {
    const { wrapper, update } = render(<TodoApp {...context} />);

    expect(wrapper).toContainText('Loading...');

    // First wait for the customer to finish loading
    await update();

    expect(wrapper).toMatchSnapshot();
  });
});