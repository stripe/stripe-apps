import { authClientId, authRedirectUrl, authUrl, scope } from '../config';

export const login = (req, res) => {
  const { state } = req.query;
  if (typeof state !== 'string') {
    return res.sendStatus(400);
  }

  const params = new URLSearchParams({
    client_id: authClientId,
    response_type: 'code',
    redirect_uri: authRedirectUrl,
    scope,
    state: state as string,
  });

  res.redirect(303, `${authUrl}?${params.toString()}`);
};
