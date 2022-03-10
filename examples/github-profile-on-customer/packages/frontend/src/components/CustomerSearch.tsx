import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { Box, Button, Divider, Inline } from '@stripe/ui-extension-sdk/ui';

import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useCustomer } from '../hooks/useCustomer';

const SEARCH_URI = 'https://localhost:8080/github/search';

function queryUri(
  q: string,
  firstOrLast: 'first' | 'last',
  beforeOrAfter?: 'before' | 'after',
  cursor?: string,
) {
  const moveFromCursor = beforeOrAfter
    ? beforeOrAfter === 'before'
      ? `&before=${cursor}`
      : `&after=${cursor}`
    : '';
  return `${SEARCH_URI}?q=${q}${moveFromCursor}&${firstOrLast}=10`;
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
  const [previousCursor, setPreviousCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (customer && typeof customer.name === 'string')
      execute(queryUri(customer.name, 'first'));
  }, [customer]);

  useEffect(() => {
    if (data) {
      if (data.search.pageInfo.hasNextPage) {
        setNextCursor(data.search.pageInfo.endCursor);
      }
      if (data.search.pageInfo.hasPreviousPage) {
        setPreviousCursor(data.search.pageInfo.startCursor);
      }
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
                        navigate(`/profile/${login}`);
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
                onPress={() =>
                  execute(
                    queryUri(
                      customer?.name as string,
                      'last',
                      'before',
                      previousCursor as string,
                    ),
                  )
                }
              >
                Previous
              </Button>
              <Button
                disabled={!data?.search.pageInfo.hasNextPage}
                type="secondary"
                onPress={() =>
                  execute(
                    queryUri(
                      customer?.name as string,
                      'first',
                      'after',
                      nextCursor as string,
                    ),
                  )
                }
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
