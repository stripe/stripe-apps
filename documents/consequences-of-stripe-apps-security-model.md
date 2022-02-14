# Consequences of Stripe Apps security model

While coding for a Stripe App might initially feel like coding any other React
app, you might soon find yourself hitting some unexpected limitations caused by
the App's execution model. In this document we'll go over what that execution
model is, what the consequences of it are and some tips about how to solve
common problems in a way which is compatible with it.

## The execution model

In a normal React app, your app's code is included in a script tag and executes
with full control of the browser window, rendering elements directly onto the
DOM under whatever root element you select.

This level of control wouldn't be acceptable for a Stripe App, as code running
in the app could cause all sorts of confusion by being able to modify any part
of the Stripe Dashboard. For this reason Stripe App code runs sandboxed in an
iframe with only "allow-scripts" permissions. You can read more about what that
means in
[the MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
but in short:

1. The code does not have access to anything outside the frame
2. The code cannot navigate the browser or open popups
3. All requests made from the frame have a blank origin that is always treated
   as being cross-origin

However, this is not the only layer of sandboxing. Instead of having the frame
simply occupy the sidebar and allowing React to render HTML elements within it,
the frame in which the code executes does not actually display on the page.
Instead, app wrapper code takes the React tree and serializes it using a limited
format that only allows the rendering of UI Toolkit elements rather than HTML.
This is then sent outside the frame and renders your app in the sidebar, outside
the frame and therefore outside the reach of the code running within the
sandbox. This means that you cannot access or control the DOM in any way except
through the UI toolkit.

## Common problems

The following is a non-exhaustive list of things you might want to do which are
disallowed by the sandboxing, together with ideas on how to approach the problem
instead.

### I want to open a popup

You can't use `window.open()` in your app code but you can give a Link or Button
component a "href" and "target" properties to turn them into anchors that open
onto a new tab. If the reason you're reaching for `window.open()` is because
your app needs to be aware of the popup being open, you can always give the
anchor component an "onPress" prop to inform your app logic of when it has been
clicked.

### I want to make an HTTP request

Because requests originating from your code will not have an origin set, the
only way to communicate with an API even once
[you've added the origin to the connect-src array](https://stripe.com/docs/stripe-apps/extend-dashboard-user-interface#use-third-party-apis)
is for that API to return an `Access-Control-Allow-Origin: *` header on all
requests (as well as all other required CORS headers).

If you control the API you can add this CORS configuration. In ExpressJS with
the "cors" package for example it's as easy as writing `app.use(cors())`. If you
do not control the API you could set up a proxy that you do control which adds
the required headers and have your app call that instead.

### I need to use cookies to store session information

Even with the correct CORS headers, requests originating from the sandbox will
never contain cookies since `credentials: "always"` cannot be set on requests
from the blank origin. This means you have to find a different way to associate
a session with a user.

The one set of credentials that can be securely verified by your backend is the
app user's user and account ids, which can go through
[the signature verification process](https://stripe.com/docs/stripe-apps/authenticate).
Depending on your needs you can either use the user id, account id or a
composite of both to key a server-side session store instead of encoding that
state in a cookie.

### I want to use a client-side routing framework like React Router

Since the sandbox does not have access to the main window location, router
setups that interact with the URL bar such as React Router's BrowserRouter or
HashRouter will not work. However, you can use a MemoryRouter with a "fake" URL
scheme scoped to your application, or some other way to implement top-level view
changing, such as a state machine available through a shared context.

### I want to store user information or maintain state between views

Because your app gets completely unloaded whenever a user navigates between
dashboard views or loads a different app, you might want to save user state
somewhere so your app can start from where it had left off the next time it is
open. However, the sandbox forbids access to any data storage APIs such as local
or session storage.

Until the DataStore API is released, the only way to save data against a user is
to do it yourself on the server. The mechanism described above to store session
information would be appropriate for this.

### I want to use custom styles on my components

Because you do not have access to the DOM and UI toolkit components do not pass
on the "style" prop to the renderer, you are limited to using the "css" prop on
Box components
[as demonstrated in the documentation](https://stripe.com/docs/stripe-apps/ui-toolkit/components).

### I want a reference to the underlying DOM element of a component

This is not possible. UI toolkit components do not take refs and app code cannot
access the rendered DOM so other tricks like `document.getElementById` don't
work either. Try to express your app's functionality using the pieces provided
by the UI toolkit. If something essential is missing from the toolkit, you might
be able to make a
[feature request](https://github.com/stripe/stripe-apps/issues/new?assignees=&labels=feature-request%2C+needs-triage&template=feature-request-enhancement.md&title=).

The exact same restriction applies to trying to listen on any of the standard
DOM events. The UI toolkit has a limited number of "onX" callbacks available for
interactive elements and they are invoked with different or partial information
compared to a native event.
