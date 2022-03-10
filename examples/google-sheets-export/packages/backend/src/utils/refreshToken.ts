import axios from 'axios';
import { addSeconds } from 'date-fns';

import { authClientId, authClientSecret, authTokenUrl } from '../config';
import { TokenSet } from '../types';

export const refreshToken = async (
  sessionId: string,
  refreshToken: string,
  tokenStore,
): Promise<TokenSet> => {
  const queryParams = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: authClientId,
    client_secret: authClientSecret,
    refresh_token: refreshToken,
  });
  const response = await axios.post(authTokenUrl, queryParams, {
    responseType: 'json',
  });
  const { expires_in, ...tokens } = response.data;
  const token: TokenSet = {
    refresh_token: refreshToken, // if the response does not include a new refresh token, we keep the one we have
    ...tokens,
    expires: addSeconds(Date.now(), expires_in),
  };
  tokenStore.set(sessionId, token);
  return token;
};
