import {
  ContextView,
  Box,
  TextField,
  Button,
  FocusView,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Inline,
  Icon,
  Spinner,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

import TodoList from './components/TodoList';

import { useState, useEffect, ChangeEvent } from 'react';
import Stripe from 'stripe';
import stripe from './stripeClient';

import appIcon from '../../todo-logo.svg';

export type Todo = {
  text: string,
  created: Number,
  completed: boolean,
  notes: string,
};

export enum Mode {
  Completed = 'Completed',
  Uncompleted = 'Uncompleted',
}

type Metadata = {
  todos: string,
};

// Stripe metadata is portrayed as key -> value, where value is a string.
// We stringify/parse our todos to be able to store them as a string in the metadata.
const parseCustomerMetadata = (metadata: any) => {
  if (!metadata.hasOwnProperty('todos')) {
    return [];
  }

  return JSON.parse(metadata.todos);
}

const TodoApp = ({environment}: ExtensionContextValue) => {
  const [newTodoTextFieldValue, setNewTodoTextFieldValue] = useState<string>('');
  const [notesTextFieldValue, setNotesTextFieldValue] = useState<string>('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [customer, setCustomer] = useState<Stripe.Customer>();
  const [openNotes, setOpenNotes] = useState<Todo|false>(false);

  useEffect(() => {
    async function getTodos() {
      try {
        const cust: Stripe.Customer = await stripe.customers.retrieve(environment?.objectContext?.id as string) as Stripe.Customer;
        const todoList: Todo[] = parseCustomerMetadata(cust.metadata);
        setTodoList(todoList);
        setCustomer(cust);
      } catch(err) {
        console.log(err);
      }
    }

    getTodos();
  }, []);

  // Returning a loading state if we're not ready yet
  if (customer === undefined) {
    return (
      <ContextView title="Todo" brandColor="#f662ad" brandIcon={appIcon}><Spinner /></ContextView>
    );
  }

  const addTodo = async () => {
    if (newTodoTextFieldValue === '') {
      return;
    }

    // Create new todo
    const newTodo: Todo = {
      text: newTodoTextFieldValue,
      created: Date.now(),
      completed: false,
      notes: '',
    }

    // Merge this todo with existing todo list on the customer's metadata
    todoList.push(newTodo);
    const newMetadata: Metadata = {
      todos: JSON.stringify(todoList),
    };

    // Set the new state of the UI first so it looks snappy
    setTodoList(todoList);

    // Update the customer to reflect the new todo list
    const cust: Stripe.Customer = await updateCustomerTodoList(newMetadata) as Stripe.Customer;

    // Set the new state of the customer
    setCustomer(cust);

    // Reset the new todo text field
    setNewTodoTextFieldValue('');
  };

  const completeTodo = async (todo: Todo) => {
    const newTodoList: Todo[] = todoList.concat();
    for (let i = 0; i < newTodoList.length; i++) {
      if (todo.created === newTodoList[i].created) {
        newTodoList[i].completed = true;
        break;
      }
    }

    setTodoList(newTodoList);

    const cust: Stripe.Customer = await updateCustomerTodoList({
      todos: JSON.stringify(newTodoList),
    }) as Stripe.Customer;
    setCustomer(cust);
  };

  const deleteTodo = async (todo: Todo) => {
    let newTodoList: Todo[] = todoList.concat();

    for (let i = 0; i < newTodoList.length; i++) {
      if (todo.created === newTodoList[i].created) {
        newTodoList.splice(i, 1);
        break;
      }
    }

    setTodoList(newTodoList);

    const cust: Stripe.Customer = await updateCustomerTodoList({
      todos: JSON.stringify(newTodoList),
    }) as Stripe.Customer;
    setCustomer(cust);
  };

  const updateTodoNotes = async (todo: Todo) => {
    const newTodoList: Todo[] = todoList.concat();
    for (let i = 0; i < newTodoList.length; i++) {
      if (todo.created === newTodoList[i].created) {
        newTodoList[i].notes = notesTextFieldValue;
        break;
      }
    }

    setTodoList(newTodoList);

    const cust: Stripe.Customer = await updateCustomerTodoList({
      todos: JSON.stringify(newTodoList),
    }) as Stripe.Customer;
    setCustomer(cust);
  };

  const updateCustomerTodoList = async (payload: Metadata) => {
    try {
      const cust: Stripe.Customer = await stripe.customers.update(customer?.id as string, {
        metadata: payload,
      });

      return cust;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  return (
    <ContextView title="Todo" brandColor="#f662ad" brandIcon={appIcon}>
      <Box
        key="controls-container"
        css={{
          layout: 'row',
          gap: 'medium',
          alignY: 'center',
        }}
      >
        <TextField type="text" size="small" key="new-task" value={newTodoTextFieldValue} onChange={(e: ChangeEvent) => setNewTodoTextFieldValue((e.target as HTMLInputElement).value)}/>
        <Button size="medium" type="secondary" key="add-task" onPress={addTodo}>
          <Icon name="add" />
          <Inline>Add task</Inline>
        </Button>
      </Box>
      <Box
        key="todo-list-container"
        css={{
          paddingY: 'medium',
          layout: 'column',
        }}
      >
        <Tabs fitted >
          <TabList>
            <Tab key={Mode.Uncompleted}>{Mode.Uncompleted}</Tab>
            <Tab key={Mode.Completed}>{Mode.Completed}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel key={Mode.Uncompleted}>
              <TodoList todoList={todoList} mode={Mode.Uncompleted} onDelete={deleteTodo} onComplete={completeTodo} setOpenNotes={setOpenNotes} setNotesTextFieldValue={setNotesTextFieldValue}/>
            </TabPanel>
            <TabPanel key={Mode.Completed}>
              <TodoList todoList={todoList} mode={Mode.Completed} onDelete={deleteTodo} setOpenNotes={setOpenNotes} setNotesTextFieldValue={setNotesTextFieldValue}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <FocusView
        key="notes"
        shown={!!openNotes}
        title={openNotes ? `Notes for: "${openNotes.text}"` : 'Loading...'}
        onClose={() => setOpenNotes(false)}
        footerContent="Saved changes cannot be reverted"
        primaryAction={<Button type="primary" onPress={async () => {
          if (openNotes) {
            await updateTodoNotes(openNotes);
          }
          setOpenNotes(false);
        }}>Save note</Button>}
        secondaryAction={<Button onPress={() => setOpenNotes(false)}>Cancel</Button>}
      >
        <TextField aria-label="Notes field for this todo" size="large" label="Additional notes for this todo item:" value={notesTextFieldValue} onChange={(e: ChangeEvent) => {
          setNotesTextFieldValue((e.target as HTMLInputElement).value);
        }}/>
        <Box>
          <Box css={{alignX: 'end', layout: 'row', marginY: 'small' }}>{500-notesTextFieldValue.length}</Box>
        </Box>
      </FocusView>
    </ContextView>
  );
};

export default TodoApp;
