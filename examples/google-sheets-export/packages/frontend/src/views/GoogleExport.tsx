import { useEffect, useReducer } from 'react';

import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { Box, Button, ContextView, Notice } from '@stripe/ui-extension-sdk/ui';

import Export from '../components/Export';
import { baseURL } from '../config';
import useFetchWithCredentials from '../hooks/useFetchWithCredentials';
import { exportReducer, initialState } from '../reducers/exportReducer';
import { State } from '../types';

const LOGIN_URI = `${baseURL}/api/auth/login`;
const VERIFY_URI = `${baseURL}/api/auth/verify`;
const INFO_URI = `${baseURL}/api/auth/userinfo`;
const SESSION_URI = `${baseURL}/api/auth/session`;

const GoogleExport = ({ userContext }: TailorExtensionContextValue) => {
  const [state, dispatch] = useReducer(exportReducer, null, initialState);
  const fetchWithCredentials = useFetchWithCredentials(userContext);

  useEffect(() => {
    switch (state.name) {
      case 'initializing': {
        const controller = new AbortController();
        fetchWithCredentials(INFO_URI, {
          signal: controller.signal,
        })
          .then(res => res.json())
          .then(user =>
            dispatch({
              type: 'initialized',
              payload: { user },
            }),
          )
          .catch(() => {
            if (!controller.signal.aborted) {
              dispatch({
                type: 'initialized',
                payload: { user: null },
              });
            }
          });
        return () => {
          controller.abort();
        };
      }
      case 'waiting-for-auth': {
        const interval = setInterval(() => {
          fetchWithCredentials(`${VERIFY_URI}?state=${state.context.stateKey}`)
            .then(response => {
              if (!response.ok) {
                throw response;
              }
              return response.json();
            })
            .then(res => {
              if (res.status >= 200 && res.status < 300) {
                dispatch({
                  type: 'authorized',
                });
              }
            })
            .catch(() => {
              dispatch({
                type: 'log-out-with-error',
                payload: {
                  error: 'A server error occurred. Please try again.',
                },
              });
            });
        }, 5000);
        return () => clearInterval(interval);
      }
      case 'logging-out': {
        const controller = new AbortController();

        fetchWithCredentials(SESSION_URI, {
          signal: controller.signal,
          method: 'DELETE',
        }).finally(() => {
          dispatch({
            type: 'session-deleted',
          });
        });
        return () => {
          controller.abort();
        };
      }
    }
  }, [state, dispatch]);

  const actions = (state: State) => {
    switch (state.name) {
      case 'logged-out':
        return (
          <>
            {state.context.error && (
              <Box slot="actions" css={{ marginBottom: 'large' }}>
                <Notice
                  type="negative"
                  title="Error"
                  description={state.context.error}
                  onDismiss={() => {
                    dispatch({
                      type: 'remove-error',
                    });
                  }}
                />
              </Box>
            )}
            <Box slot="actions">
              <Button
                type="primary"
                href={`${LOGIN_URI}?${new URLSearchParams({
                  state: state.context.stateKey,
                })}`}
                target="_blank"
                onPress={() => dispatch({ type: 'log-in' })}
              >
                Sign in with Google
              </Button>
            </Box>
          </>
        );
      case 'logged-in':
        return <Export userContext={userContext} dispatch={dispatch} />;
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
    }
  };

  return <ContextView title="Export data">{actions(state)}</ContextView>;
};

export default GoogleExport;
