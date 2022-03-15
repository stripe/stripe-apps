import { useContext, useEffect, useState } from 'react';

import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { Box, Button, Divider, Inline } from '@stripe/ui-extension-sdk/ui';

import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useCustomer } from '../hooks/useCustomer';
import { GitHubContext } from './GitHubProvider';

const SEARCH_URI = 'https://localhost:8080/github/search';

function queryUri(
  q: string,
  firstOrLast?: string | null,
  beforeOrAfter?: string | null,
  cursor?: string,
) {
  const moveFromCursor =
    cursor && beforeOrAfter
      ? beforeOrAfter === 'before'
        ? `&before=${cursor}`
        : `&after=${cursor}`
      : '';
  return `${SEARCH_URI}?q=${q}${moveFromCursor}&${
    firstOrLast ? firstOrLast : 'first'
  }=10`;
}

interface GithubUser {
  login: string;
  name?: string;
}

interface GithubData {
  search: {
    userCount: number;
    pageInfo: {
      startCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      endCursor: string;
    };
    edges: {
      node: GithubUser;
    }[];
  };
}

export const CustomerSearch = ({
  userContext,
  environment,
}: TailorExtensionContextValue) => {
  const { customer, error: stripeError } = useCustomer(
    environment?.objectContext.id as string,
  );
  const {
    isLoading,
    data,
    error: githubError,
    execute,
  } = useAuthenticatedFetch<GithubData>(userContext);
  const { state, dispatch } = useContext(GitHubContext);
  const [wentBack, setWentBack] = useState<boolean>(false);

  useEffect(() => {
    if (customer && typeof customer.name === 'string')
      execute(
        queryUri(customer?.name as string, 'first', 'after', state.cursor),
      );
  }, [customer]);

  useEffect(() => {
    if (data && wentBack) {
      dispatch({
        type: 'UPDATE_CURSOR',
        cursor: data.search.pageInfo.endCursor,
      });
      setWentBack(false);
    }
  }, [data]);

  return (
    <Box
      css={{
        paddingY: 'large',
      }}
    >
      {stripeError && (
        <Box css={{ background: 'container' }}>
          <Inline css={{ color: 'critical', font: 'subheading' }}>
            Error: Could not use Stripe data.
          </Inline>
          <Box>{JSON.stringify(stripeError)}</Box>
        </Box>
      )}
      {githubError && (
        <Box css={{ background: 'container' }}>
          <Inline css={{ color: 'critical', font: 'subheading' }}>
            Error: Could not use GitHub data.
          </Inline>
          <Box>{JSON.stringify(githubError)}</Box>
        </Box>
      )}
      {!isLoading && (
        <Box css={{ layout: 'column', gap: 'medium' }}>
          {data?.search?.edges
            .map(edge => edge.node)
            .filter(node => node.login)
            .map(({ login, name }) => (
              <Box key={login} css={{ layout: 'column', gap: 'large' }}>
                <Box css={{ layout: 'column', gap: 'small' }}>
                  <Box>
                    <Box>
                      <Inline
                        css={{
                          fontWeight: 'semibold',
                        }}
                      >
                        {login}
                      </Inline>
                    </Box>
                    <Box>{name}</Box>
                  </Box>
                  <Box>
                    <Button
                      onPress={() => {
                        dispatch({ type: 'UPDATE_USERNAME', username: login });
                        dispatch({ type: 'TOGGLE_SEARCH_OR_PROFILE' });
                      }}
                      size="small"
                      type="secondary"
                    >
                      Go to GitHub profile.
                    </Button>
                  </Box>
                </Box>
                <Divider />
              </Box>
            ))}
          {(data?.search.pageInfo.hasPreviousPage ||
            data?.search.pageInfo.hasNextPage) && (
            <Box css={{ layout: 'row', gap: 'small' }}>
              <Button
                disabled={!data?.search.pageInfo.hasPreviousPage}
                type="secondary"
                onPress={() => {
                  setWentBack(true);
                  execute(
                    queryUri(
                      customer?.name as string,
                      'last',
                      'before',
                      data.search.pageInfo.startCursor as string,
                    ),
                  );
                }}
              >
                Previous
              </Button>
              <Button
                disabled={!data?.search.pageInfo.hasNextPage}
                type="secondary"
                onPress={async () => {
                  await dispatch({
                    type: 'UPDATE_CURSOR',
                    cursor: data.search.pageInfo.endCursor,
                  });
                  execute(
                    queryUri(
                      customer?.name as string,
                      'first',
                      'after',
                      data.search.pageInfo.endCursor as string,
                    ),
                  );
                }}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
