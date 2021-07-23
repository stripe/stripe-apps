# **Introduction to Dashboard UI extensions**
This document is an early preview of the tools and APIs Stripe will provide developers to enable them to build Dashboard UI extensions. Feedback is welcome on all aspects of the document and the things it documents.

# Overview

Dashboard UI extensions enable developers to create custom UI for the Stripe Dashboard. These can be used to augment existing Stripe workflows as well as create entirely new features hosted within the Dashboard that take advantage of the UI toolkit, teams, permissions, security, and hosting already built into the Dashboard.

## How it works
- Using the Stripe CLI, developers can set up a new extension, configure their extension, and generate boilerplate for fulfilling Stripe’s interfaces
- Developers write JavaScript or TypeScript functions that provide either data or full React components to the Stripe Dashboard to be rendered
    - Developers have access to a React UI component kit provided by Stripe that they can compose new components out of
    - Since the extension code is running in a web worker created the by the Dashboard, all interfaces are promise based and make heavy use of `async`/`await`
- Developers test their changes in the live Stripe Dashboard by running a development server locally with the Stripe CLI
- Once the extension is ready for others to use, developers use the Stripe CLI to build the extension and push it to Stripe for publication.
## Core extension primitives
| Primitive   | Description                                                                                                                                                                                                                                                                                                                                                           | Examples                                                                                                                                                                                                                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sandbox     | The iframe where developer code is permitted to run. This loads code from a non-stripe.com domain and runs in an execution context that has strict, but configurable, CSP controls. While developing the code it can be hosted locally.                                                                                                                            |                                                                                                                                                                                                                                                                                                                    |
| app.json    | The linkage between the extension and Stripe. Describes permissions, which views to use in which places, what actions are provided by the extension, etc. This is mostly managed by the Stripe CLI.                                                                                                                                                            |                                                                                                                                                                                                                                                                                                                    |
| Viewport    | A named extension point on the Dashboard. Extensions specify which viewports they need to be displayed in and then the Dashboard decides where those views will be displayed. For instance, on the home page, an Extension could say that it provides a graph that fits into the “graph_grid” Viewport, and the Dashboard will put the graph in the appropriate spot. | - `detail_page.main_content` — The main content area on a detail page for a particular stripe object, for example the customer page.<br>- `overview.graph_grid` — A section on an overview page that contains a grid of graphs. To plug into this viewport, the extension would need to provide a `GraphView` |
| Views       | Fully interactive UI components controlled by the extension author.<br>These are React components that can either render a specific Stripe experience (like a list or a graph) with data provided by the extension or can be entirely custom UI created with a provided toolkit of Stripe UI components (like forms, buttons, etc)                                                                                                                                                                             | - Form for replying to a case in the Dashboard<br>- Form for assigning a case to a specific person<br>- List of Zendesk cases on customer page<br>- Graph of Zendesk overall ticket volume on home page                                                                                                                                                                                                                 |
| Actions     | Functions that can be called from an action on a Stripe object (either an overflow menu or a button). Actions can do 3 things:<br><br>- Navigate somewhere (either Dashboard or externally)<br>- Trigger a background process that reflects state in the menu or button itself<br>- Instantiate a view                                                                | - Trigger a zapier workflow from a payment intent<br>- Open a modal that contains a form for updating an order in Shippo                                                                                                                                                                                           |



# Getting started

Prerequisite: Get a build of the Stripe CLI that supports Dashboard extensions from [jt@stripe.com](mailto:jt@stripe.com)

```sh
    $ stripe extension create <path/to/extension>
    $ cd <path/to/extension>
    $ stripe extension generate view # Walk through wizard for configuring the view, including which stripe object is being extended
    $ stripe extension serve # This starts a local server with the extension
```
- Go to the Stripe Dashboard and enable extension developer mode (this will cause the Dashboard to load your extension from you local machine)
- Go to the Stripe Dashboard and navigate to where the view is configured to appear (for example, [a product page](https://dashboard.stripe.com/products))
- The "Hello world" extension will appear right above the Metadata section
- Modify the view that was generated above and observe that changes are reflected in the Dashboard

# Extension framework API reference

The “extension framework” is the set of interfaces that Stripe supports for injecting new functionality into the Stripe Dashboard. The two ways of doing this are using Actions and Views.

## Context object

The first argument of every function that Stripe calls from your extension will be the context object. It’s an object with 3 fields.

| Field                                                                                                                                      | Explanation                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account`                                                                                                                                  | The [account object](https://stripe.com/docs/api/accounts) that the current user belongs to.                                                                                                                                                                                                        |
| `[user](#user)` | The currently logged in user                                                                                                                                                                                                                                                                        |
| `object`                                                                                                                                   | **Optional**. The Stripe API object that the extension is being called on behalf of. `object.object` will be a string with the type of the object and is the field you should use to know what other fields are available as documented in the [Stripe API reference](https://stripe.com/docs/api). |

### `user`

| Field    | Type                                                                      | Explanation                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`     | string                                                                    | The ID of the user. This can be used to reference the user consistently in your extension.                                                                                                         |
| `object` | `"user"`                                                                  | All stripe objects have an `object` field that identifies their type. The user is no different.                                                                                                    |
| `name`   | string                                                                    | The name of the user.                                                                                                                                                                              |
| `role`   | `"urole_admin"\|`<br>`"urole_developer"\|`<br>`"urole_support"` … | The [role](https://stripe.com/docs/dashboard/teams#user-roles) of the user. This can be used to infer what the user can and cannot do, which in turn will be what the extension can and cannot do. |

There are many more things we could expose here! What is needed?

## Views
```sh
    $ stripe extension generate view # Follow the prompts that appear
```

### ListView
List views are a high-level view that renders data in a list with some optional controls like sorting and filtering. For example, [/payments on the Dashboard](https://dashboard.stripe.com/payments) is a `ListView`.

`ListView`s cannot have children. They are single, high-level componenents that allow developers to configure the list and provide data to be rendered within it.

#### Interface
```typescript
// Some types elided for brevity

type ListLoadProps = {
  page: CursorPageProps | OffsetPageProps,
  filters: {[key: string]: string|number},
};

type ListDataLoaderEnvelope = {
  data: Array<[key:string]: number|string|Date>,
  nextPage: null | CursorPageProps | OffsetPageProps, // If it's null there's no more data
};

type ListViewProps = {
    columns: Array<ColumnConfiguration>,
    actions: Array<Action>,
    title: string,
    data: Array<[key:string]: number|string|Date> | (ListLoadProps) => Promise<ListLoadEnvelope>
}

type ListView (props: ListViewProps) => React.Node;
```
#### Examples
```typescript
const CatFactsListView: ListView = (props: ListViewProps) => {
    return <ListView
        title="Cat Facts"
        columns= {[{
          id: "fact",
          name: "Fact",
          sortable: false,
          width: 'auto'
        }, {
          id: "date",
          name: "Date added",
          sortable: true,
        }]}
        actions={[{
          id: "delete", // This will call the "delete" action specified by the extension
          label: "Delete fact",
        }]}
        data={({page, filters}) => async {
            const response = await fetch(
                'https://cat-fact.herokuapp.com/facts/random?amount=10',
            );
            const facts = await response.json();
            return facts.map(({text, updatedAt}) => ({
                fact: text,
                date: updatedAt,
             }));
        }}
    />
}
```

### GraphView
Graph views are a high-level view that renders data in a graph with some optional controls for toggling different data sets on and off and selecting different dates. For example, the [Dashboard home page](https://dashboard.stripe.com/dashboard) contains a grid of graph views.

More details on the API to come.

### Generic views

Views are React components (with some limits). These views are permitted to have `children` and are how entirely custom UI experiences can be built. 

These are so far the least defined interfaces. However we are fairly certain of a few things:

- There will be a UI component library that developers will be required to use.
    - Initially these will be the components required to build basic forms (text inputs, buttons, selects, etc). These will be approximately the same components Stripe uses in the Dashboard.
    - It's similar in concept to open source design systems like [IBM's carbon](https://www.carbondesignsystem.com/components/overview/) but looks like the Stripe Dashboard.
- Views can be instantiated in Modals
    - Eventually developers will be able to make entire custom Dashboard pages that appear in the Dashboard navigation. Please let us know if this is critical to your use case.
- Actions (described above) can open views
    - Actions can also be added to data returned by DataLoaders which can open views
- Views can open new views

### Non-component view APIs
Very incomplete list of helpers for building views. We’ll add to this as we see common needs in building extensions!

|                     |                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `useUser()` hook    | Get the `user` that was passed in by the Dashboard when the view was instantiated. (See Context above)             |
| `useAccount()` hook | Get the `account` (See Context above)                                                                              |
| `useObject()` hook  | Get the object (or `null`) that was passed in by the Dashboard when the view was instantiated. (See Context above) |

## Actions

Actions appear as buttons/links or in context menus for Stripe objects that they’re attached to. For example, you could attach an action to an order object that would add “Cancel shipment in Shippo” everywhere the order is shown in the Dashboard. When that button or menu item is clicked, the extension’s JS function is called.

![Actions can be surfaced on detail pages…](https://paper-attachments.dropbox.com/s_C27D2161FFD342A8267057C070E47FA793FEB48DACF36751117C1EAA76520361_1623348949736_image.png)
![… or in list views](https://paper-attachments.dropbox.com/s_C27D2161FFD342A8267057C070E47FA793FEB48DACF36751117C1EAA76520361_1623348994767_image.png)


### Create stub file
In order to have an action, the developer needs to register their action in app.json, specify which object types it supports, and write a JS or TS function that fulfills the interface. The Stripe CLI helps with all of this.
```sh
    $ stripe extension generate action # Follow the prompts that appear
```

### Interface
```typescript

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


### Examples
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
