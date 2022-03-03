import { render, getMockContextProps } from '@stripe/ui-extension-sdk/testing';
import { Button } from '@stripe/ui-extension-sdk/ui';
import TodoApp from './TodoApp';

jest.mock('./stripeClient');

describe('TodoApp', () => {
  // default mock props
  const context = getMockContextProps();

  it('renders the app correctly', async () => {
    const { wrapper, update } = render(<TodoApp {...context} />);

    // First wait for the customer to finish loadingu
    await update();

    expect(wrapper).toMatchSnapshot();
  });

  it('renders the "add task" button correctly', async () => {
    const { wrapper, update } = render(<TodoApp {...context} />);

    // First wait for the customer to finish loading
    await update();

    const addTaskButton = wrapper.find(Button, {id: 'add-task'});

    expect(addTaskButton).toContainText('+ Add task');
  });
});