import axios from 'axios';

import { authLogoutUrl } from '../config';

export const logout = async (req, res, tokenStore) => {
  try {
    const token = tokenStore.get(res.locals.sessionId);

    if (!token) {
      return res.sendStatus(401);
    }

    const response = await axios.get(
      `${authLogoutUrl}?token=${token.access_token}`,
    );

    if (response.status === 200) {
      tokenStore.delete(res.locals.sessionId);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(`Error logging out: ${error}`);
    res.sendStatus(503);
  }
};
