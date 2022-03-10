import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { Box, Button, Inline } from '@stripe/ui-extension-sdk/ui';

import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useCustomer } from '../hooks/useCustomer';
import { GithubData } from '../types/GitHub';
import { GitHubProfile } from './GitHubProfile';

const SEARCH_URI = 'https://localhost:8080/github/profile';

function queryUri(login: string) {
  return `${SEARCH_URI}?login=${login}`;
}

export const CustomerGitHubDetails = ({
  userContext,
  environment,
}: TailorExtensionContextValue) => {
  const {
    customer,
    error: stripeError,
    updateCustomer,
  } = useCustomer(environment?.objectContext.id as string);
  const {
    isLoading,
    data,
    error: githubError,
    execute,
  } = useAuthenticatedFetch<GithubData>(userContext);
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    execute(queryUri(username as string));
  }, []);

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
      {!isLoading && data && (
        <Box css={{ layout: 'column', gap: 'medium' }}>
          <GitHubProfile user={data.user} />
          <Button
            type={
              customer?.metadata.github_username === data.user.login
                ? 'destructive'
                : 'primary'
            }
            onPress={() =>
              updateCustomer({
                metadata: {
                  github_username:
                    customer?.metadata.github_username === data.user.login
                      ? null
                      : data.user.login,
                },
              })
            }
          >
            {customer?.metadata.github_username
              ? 'Unlink GitHub Profile'
              : 'Link GitHub Profile'}
          </Button>
          <Button onPress={() => navigate(-1)}>Back</Button>
        </Box>
      )}
    </Box>
  );
};
