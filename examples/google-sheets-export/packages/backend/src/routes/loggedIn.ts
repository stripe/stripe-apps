import { authSuccessRedirectURL } from '../config';

export const loggedIn = (req, res, authStore) => {
  const { state, code } = req.query;

  if (
    typeof state !== 'string' ||
    !state ||
    typeof code !== 'string' ||
    !code
  ) {
    return res.sendStatus(400);
  }

  authStore.set(state, code);

  res.render(`${__dirname}/../views/authorized`, {
    redirectUrl: authSuccessRedirectURL,
  });
};
