import { Reducer } from 'react';

import { Action, State } from '../types';

export const initialState = (): State => ({
  name: 'initializing',
  context: {
    stateKey: window.crypto.randomUUID(),
  },
});

export const exportReducer: Reducer<State, Action> = (prevState, action) => {
  const fallthrough = () => {
    console.error('Invalid action', action.type, 'for state', prevState.name);
    return prevState;
  };

  switch (prevState.name) {
    case 'initializing': {
      switch (action.type) {
        case 'initialized':
          return action.payload.user
            ? {
                name: 'logged-in',
                context: {
                  user: action.payload.user,
                  stateKey: prevState.context.stateKey,
                },
              }
            : {
                name: 'logged-out',
                context: prevState.context,
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
            context: prevState.context,
          };
        case 'remove-error':
          return {
            name: 'logged-out',
            context: {
              ...prevState.context,
              error: undefined,
            },
          };
        default:
          return fallthrough();
      }
    }
    case 'waiting-for-auth': {
      switch (action.type) {
        case 'authorized':
          return initialState();
        case 'log-out':
          return { name: 'logging-out' };
        case 'log-out-with-error':
          return {
            name: 'initializing',
            context: {
              stateKey: prevState.context.stateKey,
              error: action.payload.error,
            },
          };
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
        case 'log-out-with-error':
          return {
            name: 'initializing',
            context: {
              stateKey: prevState.context.stateKey,
              error: action.payload.error,
            },
          };
        default:
          return fallthrough();
      }
    }
    default:
      return fallthrough();
  }
};
