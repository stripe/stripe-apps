import {
  ContextView,
  List,
  ListItem,
  Inline,
  Box,
  TextField,
  Button,
  Switch,
  FocusView,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

import { useState, useEffect, ChangeEvent } from 'react';

import { createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';
import Stripe from 'stripe';

// A key isn't necessary, since behind the scenes the app uses the dashboard credentials to make requests
const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient() as Stripe.HttpClient,
  apiVersion: '2020-08-27',
});

type Todo = {
  text: string,
  created: Number,
  completed: boolean,
  notes: string,
};

type Metadata = {
  todos: string,
};

enum Mode {
  Completed = 'Completed',
  Uncompleted = 'Uncompleted',
}

// Stripe metadata is portrayed as key -> value, where value is a string.
// We stringify/parse our todos to be able to store them as a string in the metadata.
const parseCustomerMetadata = (metadata: any) => {
  if (!metadata.hasOwnProperty('todos')) {
    return [];
  }

  return JSON.parse(metadata.todos);
}

const TodoApp = ({userContext, environment}: ExtensionContextValue) => {
  const [newTodoTextFieldValue, setNewTodoTextFieldValue] = useState<string>('');
  const [notesTextFieldValue, setNotesTextFieldValue] = useState<string>('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [customer, setCustomer] = useState<Stripe.Customer>();
  const [mode, setMode] = useState<string>(Mode.Uncompleted);
  const [openNotes, setOpenNotes] = useState<Todo|false>(false);

  useEffect(() => {
    async function getTodos() {
      try {
        const cust: Stripe.Customer = await stripe.customers.retrieve(environment?.objectContext.id as string) as Stripe.Customer;
        const todoList: Todo[] = parseCustomerMetadata(cust.metadata);

        setTodoList(todoList);
        setCustomer(cust);
      } catch(err) {
        console.log(err);
      }
    }

    getTodos();
  }, []);

  if (!todoList) {
    return 'Loading...';
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

    // Also set the mode to "Uncompleted" so we see our todo being added
    setMode(Mode.Uncompleted);

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
    <ContextView title="Todos">
      <Box
        css={{
          layout: 'row',
          gap: 'medium',
          alignY: 'center',
        }}
      >
        <TextField type="text" size="small" value={newTodoTextFieldValue} onChange={(e: ChangeEvent) => setNewTodoTextFieldValue((e.target as HTMLInputElement).value)}/>
        <Button size="medium" type="primary" onPress={() => addTodo()}>
          + Add task
        </Button>
      </Box>
      <Box
        css={{
          paddingY: 'medium',
          layout: 'column',
        }}
      >
        {todoList.map((todo: Todo) => {
          // Only show the todos for the selected mode
          // Also hide the "Complete" button if the task is already completed
          if (todo.completed && mode === Mode.Completed || !todo.completed && mode === Mode.Uncompleted) {
            return (
              <List>
                <ListItem key={`todo-${todo.created}`}>
                  <Inline css={{
                    font: 'body',
                    color: 'primary',
                    fontWeight: 'semibold',
                    layout: 'row',
                    gap: 'small',
                    alignX: 'end',
                    alignY: 'center'
                  }}>
                    <Inline>{todo.text}</Inline>
                    {
                      mode === Mode.Uncompleted ?
                        <Button size="small" type="primary" onPress={() => completeTodo(todo)}>✓ Complete</Button> :
                        null
                    }
                    <Button size="small" onPress={() => {
                      setNotesTextFieldValue(todo.notes);
                      setOpenNotes(todo);
                    }}>✍️</Button>
                    <Button size="small" type="destructive" onPress={() => deleteTodo(todo)}>✕</Button>
                  </Inline>
                </ListItem>
              </List>
            );
          }
        })}
      </Box>
      <Box css={{margin: 'medium'}}>
        <Switch
          id="mode-switch"
          checked={mode === Mode.Completed}
          onChange={() => setMode(mode === Mode.Completed ? Mode.Uncompleted : Mode.Completed)}
          label="Show completed tasks"
        />
      </Box>
      <FocusView
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
        <TextField aria-label="Notes field for this todo" label="Additional notes for this todo item:" value={notesTextFieldValue} onChange={(e: ChangeEvent) => {
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
