# Context providers and state management in Stripe Apps

If you're using Redux, Apollo, or any other library that provides a global state
layer in React you would usually start by wrapping your app in a context
provider like this one (from the Apollo setup docs):

```jsx
render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

However, Stripe Apps do not have a root `render` call that you can wrap a
provider around. Every view is, in a way, a separate React app and its
entrypoint is the view component itself. Therefore, to ensure that every
component executes inside the context and can use the library we need to wrap
every view individually in a provider. This could quickly get tedious but we can
use a higher-order component to make it far more painless than declaring an
extra wrapper component on every view. The way it works is that you declare a
wrapper in a separate file, like this:

```tsx
export const withApollo =
  (
    View: React.ComponentType<TailorExtensionContextValue>
  ): React.FC<TailorExtensionContextValue> =>
  (props) =>
    (
      <ApolloProvider client={client}>
        <View {...props} />
      </ApolloProvider>
    );
```

Then, for every view you have you can wrap the exported view component in your
new decorator, like:

```tsx
export default withApollo(App);
```

However, it's important to also keep in mind that the fact that every view is a
separate React tree that does not share state or context with others is a reason
why you may not want to use a Provider-based library in the first place. You
will get very few of the advantages of using a global state manager or request
cache when it necessarily resets whenever a user navigates to a different
dashboard page. In view of this, it is worth exploring more lightweight
alternatives which remove the need for this boilerplate:

- If you're looking at state managers like Redux,
  [Zustand](https://github.com/pmndrs/zustand) has a lot of the core
  functionality needed for small apps without needing a provider
- If you're looking for a query manager and cache like Apollo, Urql or React
  Query, [SWR](https://swr.vercel.app/) is a lightweight, provider-less
  alternative
- If you're looking to use a Router like React or Reach Router to manage view
  state, consider using your state manager instead, since you won't be able to
  reflect paths in the URL anyway.
