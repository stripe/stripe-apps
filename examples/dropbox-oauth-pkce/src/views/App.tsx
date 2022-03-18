import {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Button,
  ContextView,
  Link,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {createOAuthState} from '@stripe/ui-extension-sdk/oauth';

const clientID = 'REDACTED';
const redirectURI = 'https://dashboard.stripe.com/test/apps-oauth/com.example.dropbox-oauth-pkce';
const getAuthURL = (state: string, challenge: string) =>
  `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;

interface TokenData {
  access_token: string;
  account_id: string;
  expires_in: number;
  scope: string;
  token_type: string;
  uid: string;
}

interface AccountData {
  email: string;
  name: {
    display_name: string;
  }
}

const getToken = async ({code, verifier}: {code: string, verifier: string}): Promise<null | TokenData> => {
  try {
    const response = await fetch(`https://api.dropboxapi.com/oauth2/token?code=${code}&grant_type=authorization_code&code_verifier=${verifier}&client_id=${clientID}&redirect_uri=${redirectURI}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(await response.text());
  } catch (e) {
    console.error('Unable to retrieve access token:', (e as Error).message);
    return null;
  }
};

const getAccount = async (tokenData: TokenData): Promise<null | AccountData> => {
  try {
    const response = await fetch('https://api.dropboxapi.com/2/users/get_account', {
      method: 'POST',
      body: JSON.stringify({ account_id: tokenData.account_id }),
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(await response.text());
  } catch (e) {
    console.error('Unable to get account data:', (e as Error).message);
    return null;
  }
};

const App = ({oauthContext}: ExtensionContextValue) => {
  const [oauthState, setOAuthState] = useState('');
  const [challenge, setChallenge] = useState('');
  const [tokenData, setTokenData] = useState<null | TokenData>(null);
  const [accountData, setAccountData] = useState<null | AccountData>(null);

  const code = oauthContext?.code;
  const verifier = oauthContext?.verifier;
  const error = oauthContext?.error;

  const showAuthLink = !code && !tokenData;

  // Call createOAuthState to generate a unique random state that is required for the OAuth flow
  useEffect(() => {
    if (!oauthState && !code) {
      createOAuthState().then(({state, challenge}) => {
        setOAuthState(state);
        setChallenge(challenge);
      })
    }
  }, [oauthState, code]);

  // Exchange the code and verifier for a token
  useEffect(() => {
    if (code && verifier && !tokenData) {
      getToken({code, verifier}).then(setTokenData);
    }
  }, [code, verifier, tokenData]);

  const handleGetAccount = useCallback(() => {
    if (tokenData) {
      getAccount(tokenData).then(setAccountData);
    }
  }, [tokenData]);

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
        <Box css={{paddingBottom: 'xlarge'}}>
          {showAuthLink && (
            <Link
              href={getAuthURL(oauthState, challenge)}
            >
              Begin authorization flow
            </Link>
          )}
          {error && (
            <Box css={{paddingY: 'large', marginY: 'large'}}>
              OAuth error: {error}
            </Box>
          )}
          {tokenData && (
            <>
              <Box css={{paddingY: 'large', marginY: 'large'}}>
                Dropbox account is connected.
              </Box>
              {!accountData && (
                <Box css={{paddingY: 'small', marginY: 'small'}}>
                  <Button onPress={handleGetAccount}>Load Account Data</Button>
                </Box>
              )}
            </>
          )}
          {accountData && (
            <Box css={{paddingY: 'small', marginY: 'small'}}>
              Your Dropbox identity: {accountData.name.display_name}
            </Box>
          )}
        </Box>
        <Box css={{paddingY: 'xxlarge', marginY: 'xxlarge'}} />
      </Box>
    </ContextView>
  );
};

export default App;
