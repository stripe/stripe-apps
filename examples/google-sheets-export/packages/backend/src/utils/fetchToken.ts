import axios from 'axios';
import { addSeconds } from 'date-fns';

import {
  apiUrl,
  authClientId,
  authClientSecret,
  authTokenUrl,
} from '../config';
import { TokenSet } from '../types';

export const fetchToken = async (
  sessionId: string,
  code: string,
  tokenStore,
): Promise<TokenSet> => {
  const queryParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: authClientId,
    client_secret: authClientSecret,
    redirect_uri: `${apiUrl}/api/auth/callback/logged-in`,
    code,
  });

  const response = await axios.post(authTokenUrl, queryParams, {
    responseType: 'json',
  });
  const { expires_in, ...tokens } = response.data;
  const token = {
    ...tokens,
    expires: addSeconds(Date.now(), expires_in),
  };

  tokenStore.set(sessionId, token);

  return token;
};
