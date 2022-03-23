# Stripe Apps Unit Testing

Stripe's UI Extension SDK provides a set of tools and utilities for testing your app's front-end user interfaces.

A common approach to testing React applications is using [Jest](https://jestjs.io/), a JavaScript test runner that comes with [jsdom](https://github.com/jsdom/jsdom), giving us access to the Document Object Model (DOM) in an emulated browser environment.

Stripe apps are built with React and behave like React applications, but go through a serialization process before being translated into the DOM tree that's rendered inside the Stripe Dashboard.

The UI Extension toolkit is designed to work with Stripe's rendering engine directly and thus when we view our apps in a browser environment we do not have access to the underlying DOM tree.

## Getting Started

Using the tools provided by the Extension SDK we can test the different user interactions that take place in our app, allowing us to verify that our features are working as expected.

If you are familiar with tools like [testing-library](https://testing-library.com/) or [enzyme](https://github.com/enzymejs) then you will be aware of having to render or mount components in a browser-like environment using something like jsdom to test the resulting DOM output.

Given we don't have access to the DOM in our Stripe app, we are not able to take advantage of tools like testing-library or enzyme, and must rely on the functionality provided by the toolkit for simulating what the rendering engine produces.

We can render a component using the `render` function:

```js
import { render } from '@stripe/ui-extension-sdk/testing';
import App from './App';

test('it should render', () => {
  const { wrapper } = render(<App />);

  expect(wrapper).toBeDefined();
});
```

The resulting `wrapper` is a reference to the rendering engine's output. It provides a number of [properties and methods](https://stripe.com/docs/stripe-apps/reference/ui-testing#element-properties-and-methods) for querying the output and making assertions against it.

The `render` method also provides an `update` function that allows your tests to react to side effects within your app such as async requests and `useEffect` hooks.

Here is a basic ToDo list example that demonstrates this. The component is initialized with no items, and a new item is added after the initial render has occurred.

```js
import { useState, useEffect } from 'react';
import { List, ListItem } from '@stripe/ui-extension-sdk/ui';
import { randomUUID } from 'crypto';

interface Item {
  id: string;
  name: string;
}

export const SimpleToDoList = () => {
  // set the list items as empty on the initial render
  const [items, setItems] = useState<Item[]>([]);

  // asynchronously add an item to the list
  // after the initial render
  useEffect(() => {
    setItems([
      {
        id: randomUUID(),
        name: 'My List Item',
      },
    ]);
  }, []);

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.id} value={item.name} />
      ))}
    </List>
  );
};
```

To test this, we can assert that there is an empty list when the component renders. We then subsequently assert that there is one list item once an update has occurred as a result of the `useEffect`.

```js
import { render } from '@stripe/ui-extension-sdk/testing';

import { List, ListItem } from '@stripe/ui-extension-sdk/ui';
import { SimpleToDoList } from './SimpleToDoList';

jest.mock('crypto', () => ({ randomUUID: () => '1234' }));

it('renders an empty list', () => {
  const { wrapper } = render(<SimpleToDoList />);

  // there are no items in the list on the first render
  expect(wrapper.find(List)).toContainComponentTimes(ListItem, 0);
});

it('renders the list item after the useEffect side effect', async () => {
  const { wrapper, update } = render(<SimpleToDoList />);

  // wait for the useEffect call to finish
  await update();

  // now there is one item in the list
  expect(wrapper.find(List)).toContainComponentTimes(ListItem, 1);
});
```

**NOTE**: the `update` function should be called multiple times for every asynchronous operation in the component. Consider the following example which is extends the previous example with a `setTimeout` function that calls a function we pass in when the item has been added to the list:

```js
import { useState, useEffect } from 'react';
import { List, ListItem } from '@stripe/ui-extension-sdk/ui';
import { randomUUID } from 'crypto';

interface Item {
  id: string;
  name: string;
}

export const SimpleToDoList = ({
  onItemAdded,
}: {
  onItemAdded: () => void;
}) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems([
      {
        id: randomUUID(),
        name: 'My List Item',
      },
    ]);
  }, []);

  useEffect(() => {
    // we don't care about it being called when the list is empty
    if (items.length === 0) return;

    // simulate an asynchronous request
    // our onItemAdded function will be called on the next tick
    setTimeout(() => {
      onItemAdded();
    }, 0);
  }, [items.length]);

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.id} value={item.name} />
      ))}
    </List>
  );
};
```

We now have two asynchronous operations - the first `useEffect` that updates state and adds the item to the list, and the second `useEffect` that simulates an async request using a `setTimeout` function. Our `onItemAdded` function will be called on the next tick. To test for our function being called, we need to wait for both asynchronous operations to complete:

```js
// this will not work ❌
const mockOnItemAdded = jest.fn();
const { wrapper, update } = render(
  <SimpleToDoList onItemAdded={mockOnItemAdded} />
);

// wait for updates
await update();

// assert that there is one item in the list
expect(wrapper.find(List)).toContainComponentTimes(ListItem, 1);

// assert that our onItemAdded function has been called
expect(mockOnItemAdded).toHaveBeenCalledTimes(1);

// test output
expect(jest.fn()).toHaveBeenCalledTimes(expected)
  Expected number of calls: 1
  Received number of calls: 0
```

```js
// this will work ✅
const mockOnItemAdded = jest.fn();
const { wrapper, update } = render(
  <SimpleToDoList onItemAdded={mockOnItemAdded} />
);

// wait for the first useEffect that adds the list item
await update();

// assert that there is one item in the list
expect(wrapper.find(List)).toContainComponentTimes(ListItem, 1);

// wait for the setTimeout operation to complete
await update();

// assert that our onItemAdded function has been called
expect(mockOnItemAdded).toHaveBeenCalledTimes(1);
```

You can find more examples of the use of `update` in the [Testing an example application](#testing-an-example-application) section.

> The UI testing toolkit comes with a set of [Jest custom matchers](https://stripe.com/docs/stripe-apps/reference/ui-testing#matchers) to make writing assertions easier. These are imported automatically when the `@stripe/ui-extension-sdk/testing` module is imported.

## Testing an example application

To demonstrate the capabilities of the UI Extension SDK we will be testing a ToDo List application that allows users to add, remove, and keep track of tasks using Stripe metadata.

The completed application can be found in the [stripe-apps repository on Github](https://github.com/stripe/stripe-apps/tree/master/examples/todo).

![ToDo Example Image](/todo-screenshot.png)

We will base our assertions on the following acceptance criteria:

| Criteria                                                                                        | Link                                                           |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| As a customer I should see a loading state whilst my task list is being retrieved from metadata | [View Example](#i-should-see-a-loading-state)                  |
| As a customer I should see a list of incomplete tasks                                           | [View Example](#i-should-see-a-list-of-incomplete-tasks)       |
| As a customer I should be able to switch between uncompleted and completed tasks                | [View Example](#i-should-be-able-to-switch-between-task-types) |
| As a customer I should be able to add a new task to my list                                     | [View Example](#i-should-be-able-to-add-a-new-task)            |

Our ToDo App example requires a user context which is used to retrieve the current customer from the stripe API. Here's a stripped down example of what that looks like:

```js
import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';

const TodoApp = ({ environment }: TailorExtensionContextValue) => {
   useEffect(() => {
    async function getToDos() {
      try {
        // the objectContext.id is a customer ID passed to the Stripe API to retrieve the customer
        const customer: Stripe.Customer = await stripe.customers.retrieve(environment?.objectContext.id as string) as Stripe.Customer;
        const todoList: Todo[] = parseCustomerMetadata(customer.metadata);
        setTodoList(todoList);
        setCustomer(customer);
      } catch(err) {
        console.log(err);
      }
    }

    getToDos();
  }, []);
});
```

The UI Extension SDK provides a [getMockContextProps](https://stripe.com/docs/stripe-apps/reference/ui-testing#mock-context-props) function that we can use in our tests to provide mock context data to our components.

All of the following examples assume that a mock context object exists.

```js
import { render, getMockContextProps } from '@stripe/ui-extension-sdk/testing';

describe('ToDo App', () => {
  // default mock props
  let context: ExtensionContextValue;

  beforeEach(() => {
    context = getMockContextProps();
  });
});
```

Customer metadata is retrieved from the [customers endpoint](https://stripe.com/docs/api/customers/retrieve), and assumes that a Stripe API client has already been instantiated:

```js
const httpClient = createHttpClient();
const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient,
  apiVersion: '2020-08-27',
});
```

Instead of relying on the API to provide real data, we mock the `stripe` module and provide our own custom metadata. The mock data includes one incomplete and one completed item by default.

```js
const mockCustomerMetadata = [
  {
    text: 'mock todo item',
    created: Date.now,
    completed: false,
    notes: null,
  },
  {
    text: 'mock completed item',
    created: Date.now,
    completed: true,
    notes: null,
  },
];

const mockCustomer: Stripe.Customer = {
  id: 'cus_LDYxoj3NO44acv',
  object: 'customer',
  address: null,
  balance: 0,
  created: 1645811007,
  currency: null,
  default_source: null,
  delinquent: false,
  description: null,
  discount: null,
  email: null,
  invoice_prefix: '8CC4AC2F',
  invoice_settings: {
    custom_fields: null,
    default_payment_method: null,
    footer: null,
  },
  livemode: false,
  metadata: { todos: JSON.stringify(mockCustomerMetadata) },
  name: null,
  next_invoice_sequence: 1,
  phone: null,
  preferred_locales: [],
  shipping: null,
  tax_exempt: 'none',
  tax_ids: {
    object: 'list',
    data: [],
    has_more: false,
    url: '',
  },
};

jest.mock('stripe', () => {
  return {
    // we need to pass __esModule & default here to indicate that
    // it is a default module export.
    __esModule: true,
   default: jest.fn().mockImplementation(() => ({
      customers: {
        retrieve: jest.fn<Promise<Stripe.Customer>, []>(() =>
          Promise.resolve(mockCustomer)
        ),

        update: jest.fn<Promise<Stripe.Customer>, []>(() =>
          Promise.resolve(mockCustomer)
        ),
      },
    })),
  };
});
```

This approach to mocking is ideal when mocking small amounts of data, but as the need to mock more data arises, we can leverage Jest's [Mocking User Modules](https://jestjs.io/docs/manual-mocks#mocking-user-modules) capabilities.

Consider an app that has a standalone file for creating the Stripe API instance:

```js
import Stripe from 'stripe';
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client';

const httpClient = createHttpClient();
const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient,
  apiVersion: '2020-08-27',
});

export default stripeClient;
```

We can create a `__mocks__` folder alongside our test files that contains the mocked version of our `stripeClient` file. Here is an example:

```js
// __mocks__/stripeClient.ts

import Stripe from 'stripe';

const mockCustomerMetadata = [
  {
    text: 'mock todo item',
    created: Date.now,
    completed: false,
    notes: null,
  },
  {
    text: 'mock completed item',
    created: Date.now,
    completed: true,
    notes: null,
  },
];

const mockCustomer: Stripe.Customer = {
  id: 'cus_LDYxoj3NO44acv',
  object: 'customer',
  address: null,
  balance: 0,
  created: 1645811007,
  currency: null,
  default_source: null,
  delinquent: false,
  description: null,
  discount: null,
  email: null,
  invoice_prefix: '8CC4AC2F',
  invoice_settings: {
    custom_fields: null,
    default_payment_method: null,
    footer: null,
  },
  livemode: false,
  metadata: { todos: JSON.stringify(mockCustomerMetadata) },
  name: null,
  next_invoice_sequence: 1,
  phone: null,
  preferred_locales: [],
  shipping: null,
  tax_exempt: 'none',
  tax_ids: {
    object: 'list',
    data: [],
    has_more: false,
    url: '',
  },
};

const client = {
  customers: {
    retrieve: jest.fn<Promise<Stripe.Customer>, []>(() => Promise.resolve(mockCustomer)),
    update: jest.fn<Promise<Stripe.Customer>, []>(() => Promise.resolve(mockCustomer)),
  },
};

export default client;
```

Then in our test file, we can mock this user module using:

```js
jest.mock('./stripeClient.ts');
```

### I should see a loading state

When the app first loads, we should see loading text whilst the customer is being fetched. We can use Jest's `toContainText` matcher to assert that the loading text will be rendered.

```js
it('should render in a loading state whilst customer information is being fetched', () => {
  const { wrapper } = render(<TodoApp {...context} />);

  expect(wrapper).toContainText('Loading...');
});
```

### I should see a list of incomplete tasks

When the app loads and the customer information is fetched, we should see a list of incomplete tasks.

```js
it('should display a list of incomplete tasks when the customer information has been retrieved', async () => {
  const { wrapper, update } = render(<TodoApp {...context} />);

  // wait for the customer metadata to be fetched
  await update();

  const toDoList = wrapper.find(List);
  const toDoListItem = wrapper.find(ListItem);

  // expect the List component to contain 1 list item
  expect(toDoList).toContainComponentTimes(ListItem, 1);

  expect(toDoListItem).toHaveProps({ title: 'my todo item' });
});
```

The key in this test is waiting for the customer metadata to be fetched using `await update()`. Once it has been fetched, we can assert that our mock task exists by finding the `ListItem` component in the rendered tree and asserting that it has a `title` property matching our mock item. We use the [Jest custom matchers](https://stripe.com/docs/stripe-apps/reference/ui-testing#matchers) provided by the extension toolkit to find components and validate their props.

### I should be able to switch between task types

The ToDo App uses the [Tabs](https://stripe.com/docs/stripe-apps/ui-toolkit/components/tabs) component for switching between completed and incomplete tasks. Incomplete tasks are displayed by default, but we want to verify that the completed tab shows tasks that have already been completed.

```js
it('should allow me to see completed tasks', async () => {
  const { wrapper, update } = render(<TodoApp {...context} />);

  // wait for the customer metadata to be fetched
  await update();

  const tabs = wrapper.find(Tabs);
  const tabPanels = tabs?.findAll(TabPanel);

  // the tab panels do not provide any information about which tab they relate to
  // so we need to make an assumption that the completed tab will always be the second most tab
  const completedTab = tabPanels![1];

  // there should be 2 tabs, incomplete and complete
  expect(tabPanels?.length).toBe(2);

  const completedList = completedTab.find(List);
  const completedListItem = completedTab.find(ListItem);

  // the completed tab should only have 1 item in it
  expect(completedList).toContainComponentTimes(ListItem, 1);
  expect(completedListItem).toHaveProps({ title: 'mock completed item' });
});
```

**NOTE:** that the `Tabs` component is uncontrolled by default which means that we cannot trigger the press event against a tab in order to simulate the content switching between incomplete and completed tasks. Instead we can verify that the renderer is listing the completed tasks in the relevant tab panel.

### I should be able to add a new task

```js
it('should allow me to add a new incomplete task', async () => {
  const { wrapper, update } = render(<TodoApp {...context} />);

  // wait for the customer metadata to be fetched
  await update();

  const textField = wrapper.find(TextField)!;

  textField.trigger('onChange', { target: { value: 'new to do item' } });

  const addButton = wrapper.findWhere<NonNullable<typeof Button.props>>(
      (node) => node.is(Button) && node.text.toLowerCase().includes('add task')
    )!;

  addButton.trigger('onPress');

  // wait for the item to be added to metadata
  await update();

  // find the incomplete task list (it's the first list)
  const toDoList = wrapper.find(List)!;
  const toDoListItem = toDoList.findAll(ListItem);

  // now we should have the original item and the newly added item
  expect(toDoList).toContainComponentTimes(ListItem, 2);
  expect(toDoListItem).toHaveLength(2);

  // check that the new item is present in the list
  expect(
    toDoListItem.some((item) => item.prop('title') === NEW_ITEM)
  ).toBeTruthy();
});
```

This test introduces us to `trigger`, a method used for simulating a prop being called on our component.

We use this method to trigger the `onChange` property of the `TextField` component, setting its value equal to the new task that we want to add. Then we trigger the `onPress` of the `Add Task` button that updates the customer metadata and triggers a rerender of the component tree with the newly added item.

**NOTE:** It is important to note that once we trigger an update to the `TextField`, any previously defined variables that reference elements will not update. This means that we cannot find the `Add Task` button until after we've triggered an update to the `TextField`, otherwise the button will be a reference to the previous instance of the rendered component and will not have the most up to date information available to it. It is therefore good practice to make finding elements a part of the assertion process, for example:

```js
// this will not work ❌
const textField = wrapper.find(TextField)!;
const addButton = wrapper.findWhere<NonNullable<typeof Button.props>>(
  (node) => node.is(Button) && node.text.toLowerCase().includes('add task')
)!;

textField.trigger('onChange', { target: { value: 'new to do item' } });

// addButton is a reference to the previous instance before the text field was updated
// therefore it will not have the text field's latest value.
addButton.trigger('onPress');

expect(wrapper.findAll(ListItem)).toHaveLength(2);
```

```js
// this will work ✅
const textField = wrapper.find(TextField)!;

textField.trigger('onChange', { target: { value: 'new to do item' } });

// find the add button AFTER the text field value has been updated
// this will ensure the text field's value is available
const addButton = wrapper.findWhere<NonNullable<typeof Button.props>>(
  (node) => node.is(Button) && node.text.toLowerCase().includes('add task')
)!;

addButton.trigger('onPress');

// find the list items after all updates have occurred.
expect(wrapper.findAll(ListItem)).toHaveLength(2);
```

In this example we were able to verify the new item was added by asserting against a prop directly on the `ListItem` component. This works great when the prop is a primitive value such as a string or a number, but there's currently no way of asserting against output that accepts components as props.

Using the following `ListItem` component as an example:

```js
<ListItem
  key={`todo-${todo.created}`}
  title="My List Item"
  value={
    <Button size="small" onPress={onPress}>
      Edit Item
    </Button>
  }
/>
```

The content of the list item is a component passed in via the `value` prop. When we debug the output of this component inside a test using the `wrapper.debug()` method, we can see it produces the following output:

```js
<ListItem title="My List Item" value={{"appendChild": [Function appendChild], "children": [Array], "createComponent": [Function createComponent], "createText": [Function createText], "insertChildBefore": [Function insertChildBefore], "kind": 3, "parent": [Object], "removeChild": [Function removeChild], "top": [Object]}} />
```

Ideally we would want to test the content directly such as asserting that the edit button works as expected, however there is a limitation in the testing toolkit that prevents us from accessing any content that is passed to a component via a prop.

This limitation is currently being tracked in the following [Github issue](https://github.com/stripe/stripe-apps/issues/243).

### Debugging test output

When we render a component under test we are provided access to a `debug` function that allows us to visualize the rendered output of an element in text format. Consider the following component which renders a `List` with a single `ListItem`:

```js
export const SimpleToDoList = ({
  'aria-label': ariaLabel,
}: SimpleToDoListProps) => {
  return (
    <List aria-label={ariaLabel}>
      <ListItem
        title="My List Item"
        value={
          <Button className="my-button" onPress={() => null}>
            This is a button
          </Button>
        }
      />
    </List>
  );
};
```

We can visualize the output of the whole component by calling `debug` on the wrapping element:

```js
const { wrapper } = render(<SimpleToDoList aria-label="A simple to do list" />);

console.log(wrapper.debug());
```

Which will give us the following output:

```zsh
<List aria-label="A simple to do list">
  <ListItem title="My List Item" value={{"appendChild": [Function appendChild], "children": [Array], "createComponent": [Function createComponent], "createText": [Function createText], "insertChildBefore": [Function insertChildBefore], "kind": 3, "parent": [Object], "removeChild": [Function removeChild], "top": [Object]}} />
</List>
```

We can also drill into specific elements to debug their output:

```js
const { wrapper } = render(
  <SimpleToDoList aria-label="A simple to do list" />
);

console.log(wrapper.find(ListItem)!.debug());
```

Which will give us the following output:

```zsh
<ListItem title="My List Item" value={{"appendChild": [Function appendChild], "children": [Array], "createComponent": [Function createComponent], "createText": [Function createText], "insertChildBefore": [Function insertChildBefore], "kind": 3, "parent": [Object], "removeChild": [Function removeChild], "top": [Object]}} />
```

This is useful for when we want to narrow our scope during tests and see what is being rendered more easily.

> Read more about debugging in the [Elements and Properties](https://stripe.com/docs/stripe-apps/reference/ui-testing#element-properties-and-methods) documentation.

## Further Reading

- [Extension SDK API Reference](https://stripe.com/docs/stripe-apps/reference/extensions-sdk-api)
- [UI Testing Reference](https://stripe.com/docs/stripe-apps/reference/ui-testing)
