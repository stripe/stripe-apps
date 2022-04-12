import { useCallback, useEffect, useState, useRef } from 'react';
import { Box, Button, ContextView, Link } from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { createOAuthState } from '@stripe/ui-extension-sdk/oauth';

import { TokenData, AccountData } from '../util/types';
import { useSecretStore } from '../hooks/useSecretStore';
import { getDropboxToken, getDropboxAuthURL } from '../util/getDropboxToken';
import { getDropboxAccount } from '../util/getDropboxAccount';

const App = ({ userContext, oauthContext }: ExtensionContextValue) => {
  const [oauthState, setOAuthState] = useState('');
  const [challenge, setChallenge] = useState('');
  const credentialsUsed = useRef(false);
  const [tokenData, setTokenData] = useState<null | TokenData>(null);
  const [accountData, setAccountData] = useState<null | AccountData>(null);
  const { secret, postSecret } = useSecretStore<TokenData>(
    userContext!.id,
    'dropbox_token',
  );

  const code = oauthContext?.code;
  const verifier = oauthContext?.verifier;
  const error = oauthContext?.error;

  const showAuthLink = (!code || credentialsUsed.current) && !tokenData;

  useEffect(() => {
    // First we check if the token is already in the secret store.
    // If it is, we set the tokenData state equal to it.
    if (secret) {
      setTokenData(secret as TokenData);
    }
    // Otherwise, let's see if we've got a code and verifier, but
    // not tokenData. If so, we are ready to fetch a token from
    // Dropbox. Then we post the secret to the store.
    // We use the ref credentialsUsed to keep track of whether we
    // already used the code and verifier derived from props to
    // get a token. We should only fetch a token if we have not
    // used this code and verifier yet, or else we'll get an error.
    else if (code && verifier && !tokenData && !credentialsUsed.current) {
      getDropboxToken({ code, verifier }).then(token => {
        if (token) {
          credentialsUsed.current = true;
          postSecret(token);
        }
      });
    }
    // Finally, we probably don't have any OAuth stuff ready or in process.
    // Create the OAuthState in preparation for logging in and getting a token.
    else if (!oauthState && !tokenData) {
      createOAuthState().then(({ state, challenge }) => {
        setOAuthState(state);
        setChallenge(challenge);
      });
    }
  }, [secret, oauthState, code, verifier]);

  const handleGetAccount = useCallback(() => {
    if (tokenData) {
      getDropboxAccount(tokenData).then(data => {
        if (data) {
          setAccountData(data);
        }
      });
    }
  }, [tokenData]);

  const logOut = () => {
    if (tokenData) {
      postSecret(null);
      setTokenData(null);
    }
  };

  return (
    <ContextView title="Dropbox OAuth PKCE Example">
      <Box
        css={{
          padding: 'large',
          backgroundColor: 'container',
          fontFamily: 'monospace',
          borderRadius: 'small',
        }}
      >
        <Box css={{ paddingBottom: 'xlarge' }}>
          {showAuthLink && (
            <Link href={getDropboxAuthURL(oauthState, challenge)}>
              Begin authorization flow
            </Link>
          )}
          {error && (
            <Box css={{ paddingY: 'large', marginY: 'large' }}>
              OAuth error: {error}
            </Box>
          )}
          {tokenData && (
            <>
              <Box css={{ paddingY: 'large', marginY: 'large' }}>
                Dropbox account is connected.
              </Box>
              {!accountData && (
                <Box css={{ paddingY: 'small', marginY: 'small' }}>
                  <Button onPress={handleGetAccount}>Load Account Data</Button>
                </Box>
              )}
              <Box css={{ paddingY: 'small', marginY: 'small' }}>
                <Button onPress={logOut}>Log Out</Button>
              </Box>
            </>
          )}
          {accountData && (
            <Box css={{ paddingY: 'small', marginY: 'small' }}>
              Your Dropbox identity: {accountData.name.display_name}
            </Box>
          )}
        </Box>
        <Box css={{ paddingY: 'xxlarge', marginY: 'xxlarge' }} />
      </Box>
    </ContextView>
  );
};

export default App;
