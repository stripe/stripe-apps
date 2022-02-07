/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Reducer, useCallback, useEffect, useReducer } from 'react';

import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { Box, Button, ContextView } from '@stripe/ui-extension-sdk/ui';

const LOGIN_URI = 'https://localhost:8080/auth/login';
const LOGOUT_URI = 'https://localhost:8080/auth/logout';
const INFO_URI = 'https://localhost:8080/auth/repositories';

declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

type UserInfo = {
  login: string;
  name: string;
  email: string;
};

type State =
  | { name: 'initializing' }
  | {
      name: 'logged-out';
    }
  | { name: 'logging-out' }
  | { name: 'waiting-for-auth' }
  | { name: 'logged-in'; context: { user: UserInfo } };

type Action =
  | { type: 'initialized'; payload: { user: UserInfo | null } }
  | { type: 'log-in' }
  | { type: 'authorized'; payload: { user: UserInfo } }
  | { type: 'log-out' }
  | { type: 'session-deleted' };

const initialState = (): State => ({
  name: 'initializing',
});

// The following is a simple state machine implemented in plain React. However, in your app you might
// prefer using a library such as XState, Redux or Little State Machine for the same purpose.
const reducer: Reducer<State, Action> = (prevState, action) => {
  const fallthrough = () => {
    console.error('Invalid action', action.type, 'for state', prevState.name);
    return prevState;
  };
  switch (prevState.name) {
    case 'initializing': {
      switch (action.type) {
        case 'initialized':
          return action.payload.user
            ? { name: 'logged-in', context: { user: action.payload.user } }
            : {
                name: 'logged-out',
                context: { stateKey: window.crypto.randomUUID() },
              };
        default:
          return fallthrough();
      }
    }
    case 'logged-out': {
      switch (action.type) {
        case 'log-in':
          return {
            name: 'waiting-for-auth',
          };
        default:
          return fallthrough();
      }
    }
    case 'waiting-for-auth': {
      switch (action.type) {
        case 'authorized':
          return {
            name: 'logged-in',
            context: { user: action.payload.user },
          };
        case 'log-out':
          return { name: 'logging-out' };
        default:
          return fallthrough();
      }
    }
    case 'logging-out': {
      switch (action.type) {
        case 'session-deleted':
          return initialState();
        default:
          return fallthrough();
      }
    }
    case 'logged-in': {
      switch (action.type) {
        case 'log-out':
          return { name: 'logging-out' };
        default:
          return fallthrough();
      }
    }
    default:
      return fallthrough();
  }
};

const App = ({ userContext }: TailorExtensionContextValue) => {
  const [state, dispatch] = useReducer(reducer, null, initialState);
  const fetchWithCredentials = useCallback(
    (uri: string, { headers, ...options }: RequestInit = {}) => {
      const headersObject = new Headers(headers);
      headersObject.append('stripe-user-id', userContext?.id ?? '');
      headersObject.append('stripe-account-id', userContext?.account.id ?? '');
      return fetch(uri, {
        ...options,
        headers: headersObject,
      });
    },
    [],
  );
  useEffect(() => {
    switch (state.name) {
      case 'initializing': {
        // The user may or may not be logged in, so we try fetching their information
        // If the request fails because they are not logged in, only then will we show
        // them the log in button
        const controller = new AbortController();
        fetchWithCredentials(INFO_URI, {
          signal: controller.signal,
        })
          .then(res =>
            res.json().then(user =>
              dispatch({
                type: 'initialized',
                payload: { user },
              }),
            ),
          )
          .catch(() =>
            dispatch({
              type: 'initialized',
              payload: { user: null },
            }),
          );
        return () => {
          controller.abort();
        };
      }
      case 'waiting-for-auth': {
        // While the user logs in and consents to our app's scopes in another tab or window
        // we are continually polling the API. Once the user is logged in, the API will return
        // successfully and we know the user is logged in.
        const interval = setInterval(() => {
          fetchWithCredentials(INFO_URI).then(res =>
            res.json().then(
              user =>
                user &&
                dispatch({
                  type: 'authorized',
                  payload: { user },
                }),
            ),
          );
        }, 5000);
        return () => clearInterval(interval);
      }
      case 'logging-out': {
        // Since logging out also occurs in a separate window, we could use the same polling technique
        // as with logging in, but because logging out is quick and is very unlikely to fail, it's simpler
        // to assume it will have worked after 1 second and return the frontend to the "initializing" state
        // to check
        const timeout = setTimeout(
          () => dispatch({ type: 'session-deleted' }),
          1000,
        );
        return () => clearTimeout(timeout);
      }
    }
  }, [state, dispatch]);

  const actions = (state: State) => {
    switch (state.name) {
      case 'initializing':
        return 'Loading...';
      case 'logged-out':
        return (
          <Button
            type="primary"
            // We must both open the login screen in a separate tab or window and kick off the polling process
            // A link with target _blank and an onPress handler allows us to accomplish this double purpose
            href={`${LOGIN_URI}?${new URLSearchParams({
              account: userContext!.account.id,
              user: userContext!.id,
            })}`}
            target="_blank"
            onPress={() => dispatch({ type: 'log-in' })}
          >
            Log In
          </Button>
        );
      case 'waiting-for-auth':
        return (
          <>
            <Box>Please complete authorization in popup.</Box>
            <Button
              type="destructive"
              onPress={() => dispatch({ type: 'log-out' })}
            >
              Cancel
            </Button>
          </>
        );
      case 'logged-in':
        return (
          <>
            <Box css={{ paddingBottom: 'medium' }}>
              You are logged in as GitHub user {state.context.user.login}.
            </Box>
            <Box css={{ paddingBottom: 'medium' }}>
              <Button
                href={`https://github.com/${state.context.user.login}`}
                target="_blank"
              >
                Visit your profile.
              </Button>
            </Box>
            <Button
              type="destructive"
              href={`${LOGOUT_URI}?${new URLSearchParams({
                account: userContext!.account.id,
                user: userContext!.id,
              })}`}
              target="_blank"
              onPress={() => dispatch({ type: 'log-out' })}
            >
              Log Out
            </Button>
          </>
        );
      case 'logging-out':
        return (
          <Button type="destructive" disabled>
            Log Out
          </Button>
        );
    }
  };
  return (
    <ContextView title="Get started with Stripe Apps">
      <Box slot="actions">{actions(state)}</Box>
    </ContextView>
  );
};

export default App;
