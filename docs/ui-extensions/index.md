# Introduction to UI extensions for Dashboard 

UI extensions for Dashboard enable developers to create custom UI for the Stripe Dashboard. These can be used to augment existing Stripe workflows as well as create entirely new features hosted within the Dashboard that take advantage of the UI toolkit, teams, permissions, security, and hosting already built into the Dashboard.

## How it works
- Using the Stripe CLI, developers can set up a new extension, configure their extension, and generate boilerplate for fulfilling Stripe’s interfaces
- Developers write TypeScript React components (called "Views") the Stripe Dashboard will render
    - There are a number of "viewports" exposed in the Dashboard where extension developers can insert their functionality.
    - Developers have access to a React UI component kit provided by Stripe that they can compose new components out of
    - Since the extension code is running in a iframe created by the Dashboard, all interfaces are promise based and make heavy use of [`async`/`await`](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)
- Developers test their changes in the live Stripe Dashboard by running a development server locally with the Stripe CLI
- Once the extension is ready for others to use, developers use the Stripe CLI to build the extension and push it to Stripe for publication.

## Getting started
If you haven't already created an app, see [Creating a new app](../create/index.md).

```sh
$ stripe-preview app generate view # Walk through wizard for configuring the view, including which stripe object is being extended
$ stripe-preview app serve # This starts a local server with the extension
```

- `stripe-preview app serve` will open the Stripe Dashboard and prompt to enable developer mode.
  - This will cause the Dashboard to load your extension from your local machine.
- Go to the Stripe Dashboard and navigate to where the view is configured to appear (for example, [a product page](https://dashboard.stripe.com/products))
- The "Hello world" extension will appear right above the Metadata section
- Modify the view that was generated above and observe that changes are reflected in the Dashboard

## Extension SDK API reference
The “extension SDK” is the set of interfaces that Stripe supports for injecting new functionality into the Stripe Dashboard. The two ways of doing this are using Actions (coming soon!) and Views.

### Views
```sh
$ stripe extension generate view # Follow the prompts that appear
```
Views are React components (with some limits). These views are permitted to have `children` and are how entirely custom UI experiences can be built. 

- The UI Components available are based on Stripe's internal design system, Sail (*TODO:* link)
- Views can be instantiated in Modals
  - Eventually developers will be able to make entire custom Dashboard pages that appear in the Dashboard navigation. Please let us know if this is critical to your use case.
- Actions (described above) can open views
- Views can open new views

### `ObjectView`
Object views appear on Stripe object detail pages like `[/customers/cus_1234](https://dashboard.stripe.com/test/customers/cus_1234)` or `[/invoices/in_1234](https://dashboard.stripe.com/test/invoices/in_1234)`.

*TODO:* Add screenshot from github UI.
*TODO:* Link to Component documentation

### `FocusView` (Currently `ModalView`, update this when the name changes)
These are opened from other Views and allow the developer to open a dedicated space for the end user to do a specific task. Examples include:
- Enter in details to create a new entry in a database
- Go through a wizard to decide on next steps
- Confirm that the user wants to take the action they indicated

*TODO:* Link to Component documentation

### `ConfigurationView`
Configuration views appear in Settings and allow end-users to configure specific details about how the app should work with their specific account. For instance, a Zendesk app would need a `ConfigurationView` to collect what Zendesk instance the app should communicate with from the administrator.

*TODO:* Link to Component documentation

### `StripeContext`
Views have access to context about the merchant, user, and other contextual information about where the view is appearing.

### Context object
`useStripeContext` returns an object with all the context that's available.
| Field  | Description | Properties |
|--------|-------------|------------|
| `user` | The current signed in user | `id` |
| `account` | The current signed in account | `id` |
| `object` | Optional. In `ObjectView`s this is the current object that is being viewed in the Dashboard. `object` is the type associated with the `id` | `id`, `object` |

#### Example
```tsx
import {Group, Subheading} from '@stripe/tailor-browser-sdk/sail';
import {useStripeContext} from '@stripe/tailor-browser-sdk/context';

const ContextPrinter = () => {
  const stripeCtx = useStripeContext();
  return (
    <Group>
      <Subheading>{stripeCtx.user.id}</Subheading>
      <Subheading>{stripeCtx.merchant.id}</Subheading>
      <Subheading>{stripeCtx.object.id}</Subheading>
      <Subheading>{stripeCtx.object.object}</Subheading>
    </Group>
  );
}
```

### [Coming soon!] Actions

Actions appear as buttons/links or in context menus for Stripe objects that they’re attached to. For example, you could attach an action to an order object that would add “Cancel shipment in Shippo” everywhere the order is shown in the Dashboard. When that button or menu item is clicked, the extension’s JS function is called.

![Actions can be surfaced on detail pages…](https://paper-attachments.dropbox.com/s_C27D2161FFD342A8267057C070E47FA793FEB48DACF36751117C1EAA76520361_1623348949736_image.png)
![… or in list views](https://paper-attachments.dropbox.com/s_C27D2161FFD342A8267057C070E47FA793FEB48DACF36751117C1EAA76520361_1623348994767_image.png)


#### Create stub file
In order to have an action, the developer needs to register their action in app.json, specify which object types it supports, and write a JS or TS function that fulfills the interface. The Stripe CLI helps with all of this.
```sh
    $ stripe-preview app generate action # Follow the prompts that appear
```

#### Interface
```ts

    type Action = {
      label: string | (context: Context) => string,
      disabled: (context: Context) => Boolean,
      onClick: (context: Context, trigger: Trigger) => Promise<void>
    }
```
| Field      | Explanation                                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`    | What gets displayed in the button or menu when this action is displayed.                                                                                   |
| `disabled` | Whether or not this action should be disabled in the current context                                                                                       |
| `onClick`  | The meat of the action. This gets called when a user actually clicks on the button or menu option. See “Triggers” below for more details on that argument. |

#### Triggers
Trigger objects allow the developer to manipulate the button or menu item as the action is doing work.

| Field     | Type                                               | Explanation                                                                                                                                                                                                            |
| --------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading` | `(label: string) => void`                          | Transitions the button or menu item to a “loading” state. This disables the element and displays the appropriate spinner.                                                                                              |
| `error`   | `(message: string) => void`                        | Transitions the button or menu item to an “error” state. This disables the element and puts the error message into the UI as appropriate (usually a toast)                                                             |
| `success` | `(message?: string) => void`                       | Resets the element back to an interactive state and displays the success message as appropriate (usually in a toast). If the action returns without calling any transition, `success` is called with a `null` message. |
| `state`   | `"idle"\|"loading"\|"error"` | Allows the developer to inspect the current state of the trigger.                                                                                                                                                      |


#### Examples
```typescript
    // This action reflects its state in the button or menu item that triggered it
    export create_case = {
      label: "Trigger 'Flag for CEO' in Zapier",
      disabled: (context: Context): Boolean => !context.object.metadata.has_been_flagged,
      callback: async (context: Context, trigger: Trigger): Promise<void> => {
        trigger.loading("Flagging...");
        const response = await fetch("http://zapier/flag_this_object_to_jefe");
        if (response.status <= 300) {
          trigger.error(`Failed to flag: ${await response.body().message}`);
        }
        trigger.success(`Flagged ${context.object.name} for CEO to review`);
      }  
    };
```
```typescript


    // This action is stateless - it just kicks off a view that moves the workflow forward
    import {instantiateModalView} = '@stripe/extension-sdk';
    
    export reply_to_case = {
      label: "Reply to Zendesk case",
      callback: async (context: Context, trigger: Trigger): Promise<void> => {
        instantiateModalView("ZendeskReplyForm", {
          zendesk_case_id: context.object.id,
        });
      },
    };
```

### Calling HTTP APIs

#### Calling Stripe
**Calls made to the Stripe API will be made as the _user_ and tagged with the app making the call.** If the user does not have permission to make the call requested, the call will throw a `StripePermissionError`.

Extensions can make calls to the Stripe API with the standard [Stripe JS API client](https://github.com/stripe/stripe-node).

##### Example
```typescript
import {createHttpClient} from '@stripe/tailor-browser-sdk/http_client';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_API_KEY, {
  httpClient: createHttpClient(),
})

// Now that the client is initialized, we can use it to call the API.
const makeNewCustomer = async () => {
  // If the user has permission to create customers, this should succeed.
  const newCustomer = await stripe.customers.create({
    email: 'customer@example.com',
  });
  console.log(newCustomer.id);
};
```

#### Calling a 3rd party API
To call out to a 3rd party API, developers can use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). Before a fetch call will succeed, the developer must explicitly allow the UI extension to call the desired URL.

1. Add the path you wish to call to the [tailor.json file](../tailor.json.md#CSPRequest)
1. Start or restart your development server. — `$ stripe-preview app serve`
1. Now you can use `fetch` in order to call the URL you configured in step 1.
  1. If the API in question has a JS client library that may work as well if it supports running in a browser context. Simply add the dependency to your extension using `npm add`

```typescript
const makeRequestToService = (endpoint, method, requestData) => {
  return fetch(`https://example.com/${endpoint}/`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestData,
  });
};
```

#### [Coming soon!] Calling your own servers
To call servers that you have control of, you additionally can ensure that the caller is your Stripe Dashboard UI Extension by adding a provided signed secret to the request.

1. Follow the [steps for calling out to any third party](#calling-a-3rd-party-api)
1. Add the `Stripe-Signature` header with a signature provided by the `useStripeSignature` SDK function
```typescript
import {useStripeSignature} from '@stripe/tailor-browser-sdk/request_signing';

const makeRequestToMyBackend = (endpoint, method, requestData) => {
  return fetch(`https://mywellknownbackend.com/${endpoint}/`, {
    method,
    headers: {
      // User needs to call `useStripeSignature` every time, they can't just
      // save the signature to a variable as it will be refreshed from time to time
      'Stripe-Signature': useStripeSignature(),
      'Content-Type': 'application/json',
    },
    body: requestData,
  });
};
```
1. Decode the signature on your server in order to ensure that it is a request from your UI Extension
```typescript
// TODO: Show how to use the stripe clients to decode this signature
```