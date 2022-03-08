import { render } from '@stripe/ui-extension-sdk/testing';

import { List, ListItem } from '@stripe/ui-extension-sdk/ui';

import TodoList, { TodoListProps } from './TodoList';
import { Mode } from '../TodoApp';

describe('TodoList', () => {
  const mocks: TodoListProps = {
    todoList: [{
      text: 'foo',
      created: Date.now(),
      completed: false,
      notes: '',
    }],
    mode: Mode.Uncompleted,
    onDelete: jest.fn(),
    onComplete: jest.fn(),
    setOpenNotes: jest.fn(),
    setNotesTextFieldValue: jest.fn(),
  };

  it('renders the component correctly with todos', () => {
    const { wrapper } = render(<TodoList {...mocks} />);

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find(List)).toContainComponentTimes(ListItem, 1);
  });

  it('renders the component with no todos', () => {
    mocks.todoList = [];

    const { wrapper } = render(<TodoList {...mocks} />);

      expect(wrapper.find(List)).toContainComponentTimes(ListItem, 0);
  });
});