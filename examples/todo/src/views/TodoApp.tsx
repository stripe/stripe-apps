import {
  ContextView,
  Section,
  View,
  TextField,
  Button,
  Select,
  MenuItem,
  Menu,
  MenuTrigger,
} from '@stripe/tailor-browser-sdk/ui';
import type { TailorExtensionContextValue } from '@stripe/tailor-browser-sdk/context';

import { useState, useEffect, ChangeEventHandler, ChangeEvent } from 'react';

import { createHttpClient } from '@stripe/tailor-browser-sdk/http_client';
import Stripe from 'stripe';

const stripe = new Stripe('', {
  httpClient: createHttpClient() as Stripe.HttpClient,
  apiVersion: '2020-08-27',
});

type Todo = {
  text: string,
  created: Number,
  completed: boolean,
};

type Metadata = {
  todos: string,
};

enum Mode {
  Completed = 'Completed',
  Uncompleted = 'Uncompleted',
}

const parseCustomerMetadata = (metadata: any) => {
  if (!metadata.hasOwnProperty('todos')) {
    return [];
  }

  const parsed = JSON.parse(metadata.todos);
  return parsed === '' ? [] : parsed;
}

const TodoApp = ({userContext, environment}: TailorExtensionContextValue) => {
  const [newTodoTextFieldValue, setNewTodoTextFieldValue] = useState('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [customer, setCustomer] = useState<Stripe.Customer>();
  const [mode, setMode] = useState<string>(Mode.Uncompleted);

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
    const cust = await updateCustomerTodoList(newMetadata);

    // Set the new state of the customer
    setCustomer(cust);
  };

  const completeTodo = async (todo: Todo) => {
    const newTodoList = todoList.concat();
    for (let i = 0; i < newTodoList.length; i++) {
      if (todo.created === newTodoList[i].created) {
        newTodoList[i].completed = true;
        break;
      }
    }

    setTodoList(newTodoList);

    const cust = await updateCustomerTodoList({
      todos: JSON.stringify(newTodoList),
    });
    setCustomer(cust);
  };

  const deleteTodo = async (todo: Todo) => {
    let newTodoList = todoList.concat();

    for (let i = 0; i < newTodoList.length; i++) {
      if (todo.created === newTodoList[i].created) {
        newTodoList.splice(i, 1);
        break;
      }
    }

    setTodoList(newTodoList);

    const cust = await updateCustomerTodoList({
      todos: JSON.stringify(newTodoList),
    });
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
      <View>
        <MenuTrigger>
          Showing
          <Button css={{padding: '10px'}}>{mode}</Button>
          tasks
          <Menu slot="menu" >
            <MenuItem onAction={() => setMode(Mode.Completed)}>{Mode.Completed}</MenuItem>
            <MenuItem onAction={() => setMode(Mode.Uncompleted)}>{Mode.Uncompleted}</MenuItem>
          </Menu>
        </MenuTrigger>
      </View>
      <View css={{ padding: 'medium' }}>
        <TextField type="text" value={newTodoTextFieldValue} onChange={(e: ChangeEvent) => setNewTodoTextFieldValue((e.target as HTMLInputElement).value)}/>
        <Button size="medium" type="primary" onPress={() => addTodo()}>
          + Add task
        </Button>
      </View>
      <View
        css={{
          padding: 'medium',
        }}
      >
        {todoList.map((todo: Todo) => {
          // Only show the todos for the selected mode
          if (todo.completed && mode === Mode.Completed || !todo.completed && mode === Mode.Uncompleted) {
            return (
              <Section title={todo.text}>
                <Button slot="action" type="primary" onPress={() => completeTodo(todo)} >Complete</Button>
                <Button slot="action" type="destructive" onPress={() => deleteTodo(todo)}>Delete</Button>
              </Section>
            );
          }
        })}
      </View>
    </ContextView>
  );
};

export default TodoApp;
