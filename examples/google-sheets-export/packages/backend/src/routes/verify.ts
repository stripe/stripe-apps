import { AxiosError } from 'axios';

import { fetchToken } from '../utils/fetchToken';

export const verify = (req, res, authStore, tokenStore) => {
  const { state } = req.query;

  if (typeof state !== 'string') {
    return res.sendStatus(400);
  }

  const code = authStore.get(state);

  if (!code) {
    return res.sendStatus(401);
  }

  authStore.delete(state);

  fetchToken(res.locals.sessionId, code, tokenStore)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        res.sendStatus(401);
      } else {
        res.status(503).send('Cannot contact authentication server');
      }
    });
};
