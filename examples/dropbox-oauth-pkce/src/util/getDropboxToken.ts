import { addSeconds } from 'date-fns';

import { TokenData } from "./types";
import { client_id } from '../../config.example.ts';

const APP_NAME = 'com.example.dropbox-oauth-pkce';
const redirectURI = `https://dashboard.stripe.com/test/apps-oauth/${APP_NAME}`;
export const getDropboxAuthURL = (state: string, challenge: string) =>
  `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;

export const getDropboxToken = async ({
  code,
  verifier,
}: {
  code: string;
  verifier: string;
}): Promise<TokenData | void> => {
  try {
    const response = await fetch(
      `https://api.dropboxapi.com/oauth2/token?code=${code}&grant_type=authorization_code&code_verifier=${verifier}&client_id=${client_id}&redirect_uri=${redirectURI}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    if (response.ok) {
      let token = await response.json();
      token = {
        ...token,
        expires_in: addSeconds(Date.now(), token.expires_in),
      };
      return token;
    }
    throw new Error(await response.text());
  } catch (e) {
    console.error('Unable to retrieve access token:', (e as Error).message);
  }
};