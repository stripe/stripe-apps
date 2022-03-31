import {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Button,
  ContextView,
  Link,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {createOAuthState} from '@stripe/ui-extension-sdk/oauth';
import Stripe from 'stripe';
import {
  STRIPE_API_KEY,
  createHttpClient,
} from '@stripe/ui-extension-sdk/http_client';

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

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

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

const App = ({userContext, oauthContext}: ExtensionContextValue) => {
  const [oauthState, setOAuthState] = useState('');
  const [challenge, setChallenge] = useState('');
  const [tokenData, setTokenData] = useState<null | TokenData>(null);
  const [accountData, setAccountData] = useState<null | AccountData>(null);

  const code = oauthContext?.code;
  const verifier = oauthContext?.verifier;
  const error = oauthContext?.error;

  const showAuthLink = !code && !tokenData;

  // Create the Secret Store API URL path.
  const SECRET_NAME = 'secret_token';
  let sharedTokenPath = `scope[type]=user&scope[user]=${userContext?.id}&name=${SECRET_NAME}`
  let postTokenPath = `apps/secrets?${sharedTokenPath}`;
  let getTokenPath = `apps/secrets/find?${sharedTokenPath}&expand[]=payload`;

  // Create a `StripeResource` to load the custom Secret Store API endpoint.
  const createSecretResource = Stripe.StripeResource.extend({
    request: Stripe.StripeResource.method({
      method: 'POST',
      path: postTokenPath,
    }),
  });

  // Create a `StripeResource` to load the custom Secret Store API endpoint.
  const getSecretResource = Stripe.StripeResource.extend({
    request: Stripe.StripeResource.method({
      method: 'GET',
      path: getTokenPath,
    }),
  });

  useEffect(() => {
    if (!tokenData) {
      new getSecretResource(stripe).request(
        {},
        function (err: any, secret: any) {
          if (!err) {
            setTokenData(JSON.parse(secret.payload));
          } else {
            console.error(err);
          }
        },
      );
    }
  }, []);

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
