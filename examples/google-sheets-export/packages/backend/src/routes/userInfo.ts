import axios from 'axios';
import { Stream } from 'stream';

import { authUserInfoUrl } from '../config';
import { refreshToken } from '../utils/refreshToken';

export const userInfo = async (req, res, tokenStore) => {
  try {
    let token = tokenStore.get(res.locals.sessionId);
    if (token) {
      if (token.expires < new Date()) {
        token = await refreshToken(
          res.locals.sessionId,
          token.refresh_token,
          tokenStore,
        );
      }

      const response = await axios.get<Stream>(authUserInfoUrl, {
        responseType: 'stream',
        headers: {
          authorization: `${token.token_type} ${token.access_token}`,
        },
      });
      res.status(response.status);
      response.data.pipe(res);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(`Error fetching user information: ${error}`);
    res.sendStatus(503);
  }
};
