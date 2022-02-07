import { Reducer, useEffect, useReducer } from 'react';

import { Box, Button } from '@stripe/ui-extension-sdk/ui';

const AUTH_URI = 'https://localhost:8080/auth/login';
const TOKEN_URI = 'https://localhost:8080/auth/token';

declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

type State =
  | {
      name: 'logged-out';
      context: { stateKey: string };
    }
  | { name: 'waiting-for-auth'; context: { stateKey: string } }
  | { name: 'logged-in'; context: { token: string } };

type Action =
  | { type: 'log-in' }
  | { type: 'authorized'; payload: { token: string } }
  | { type: 'log-out' };

const initialState = (): State => ({
  name: 'logged-out',
  context: { stateKey: window.crypto.randomUUID() },
});

const reducer: Reducer<State, Action> = (prevState, action) => {
  switch (prevState.name) {
    case 'logged-out': {
      switch (action.type) {
        case 'log-in':
          return {
            name: 'waiting-for-auth',
            context: { ...prevState.context },
          };
      }
    }
    case 'waiting-for-auth': {
      switch (action.type) {
        case 'authorized':
          return {
            name: 'logged-in',
            context: { token: action.payload.token },
          };
        case 'log-out':
          return initialState();
      }
    }
    case 'logged-in': {
      switch (action.type) {
        case 'log-out':
          return initialState();
      }
    }
    default: {
      console.error('Invalid action', action.type, 'for state', prevState.name);
      return prevState;
    }
  }
};

export const Auth = () => {
  const [state, dispatch] = useReducer(reducer, null, initialState);
  console.log(state);
  useEffect(() => {
    switch (state.name) {
      case 'waiting-for-auth': {
        const interval = setInterval(() => {
          fetch(
            `${TOKEN_URI}?${new URLSearchParams({
              state: state.context.stateKey,
            })}`,
            {
              headers: {
                Accept: 'application/json',
              },
            },
          ).then(response => {
            response.json().then(responseData => {
              console.log(responseData);
              dispatch({
                type: 'authorized',
                payload: { token: responseData['access_token'] },
              });
            });
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [state, dispatch]);
  const actions = (state: State) => {
    switch (state.name) {
      case 'logged-out':
        return (
          <Button
            type="primary"
            href={`${AUTH_URI}?${new URLSearchParams({
              state: state.context.stateKey,
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
            <Box>You are logged in and your token is {state.context.token}</Box>
            <Button
              type="destructive"
              onPress={() => dispatch({ type: 'log-out' })}
            >
              Log Out
            </Button>
          </>
        );
    }
  };
  return <Box>{actions(state)}</Box>;
};
