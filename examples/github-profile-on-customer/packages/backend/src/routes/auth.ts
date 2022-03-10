import axios, { AxiosError } from 'axios';
import * as date from 'date-fns';
import { Handler, Router } from 'express';
import 'source-map-support/register';
import { Stripe } from 'stripe';

import {
  client_id,
  client_secret,
  githubAuthURI,
  redirect_uri,
  stripeAppSecret,
  stripeSecretKey,
} from '../config';

export const authRouter = Router();

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2020-08-27',
});

// These will be replaced with an actual persistent state store like Redis or a RDBMS.
export const tokenStore = new Map<string, TokenSet>();
const authStore = new Map<string, string>();

type TokenSet = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires: Date;
};

const LOGIN_URI = `${githubAuthURI}/authorize`;
const TOKEN_URI = `${githubAuthURI}/access_token`;
const REFRESH_URI = `${githubAuthURI}/access_token`;

/**
 * Here we extract the session key used. Because we cannot use cookies to set a secure session id, the
 * only thing we can rely on is stripe's user and account IDs. These will be possible to securely verify
 * using a signed header once this is implemented in the Stripe apps SDK (see https://stripe.com/docs/stripe-apps/authenticate)
 */
export const verifyCaller: Handler = (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const userId = req.headers['stripe-user-id'];
  const accountId = req.headers['stripe-account-id'];
  try {
    verifyUser(userId, accountId, sig);
    res.locals.sessionId = `${userId}----${accountId}`;
    next();
  } catch (e) {
    res.sendStatus(400);
  }
};

const verifyUser = (userId: unknown, accountId: unknown, sig: unknown) => {
  if (
    !(
      typeof userId === 'string' &&
      typeof accountId === 'string' &&
      typeof sig === 'string'
    )
  )
    throw new Error('Missing user identifiers');
  stripe.webhooks.signature.verifyHeader(
    JSON.stringify({
      user_id: userId,
      account_id: accountId,
    }),
    sig,
    // Find your app's secret in your app settings page in the Developers Dashboard
    stripeAppSecret,
  );
};

/**
 * Here we use the authorization code provided in the auth callback to fetch and store access, id, and refresh tokens.
 * These will allow us to call the API on behalf of the user.
 */
const fetchToken = async (
  sessionId: string,
  code: string,
): Promise<TokenSet> => {
  const queryParams = new URLSearchParams({
    client_id,
    client_secret,
    redirect_uri,
    code,
  });
  const response = await axios.post(TOKEN_URI, queryParams, {
    headers: {
      Accept: 'application/json',
    },
    responseType: 'json',
  });
  const { expires_in, ...tokens } = response.data;
  const token = {
    ...tokens,
    expires: date.addSeconds(Date.now(), expires_in),
  };
  tokenStore.set(sessionId, token);
  return token;
};

/**
 * Here we fetch a new access token using a stored refresh token. Access tokens often cannot be revoked, so they have]
 * a short expiry. However, to avoid the user having to log in again we can re-authorize using a refresh token, which
 * if it has not been revoked will give us a new access token.
 */
export const refreshToken = async (
  sessionId: string,
  refreshToken: string,
): Promise<TokenSet> => {
  const queryParams = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id,
    client_secret,
    refresh_token: refreshToken,
  });
  const response = await axios.post(REFRESH_URI, queryParams, {
    headers: {
      Accept: 'application/json',
    },
    responseType: 'json',
  });
  const { expires_in, ...tokens } = response.data;
  const token: TokenSet = {
    refresh_token: refreshToken, // if the response does not include a new refresh token, we keep the one we have
    ...tokens,
    expires: date.addSeconds(Date.now(), expires_in),
  };
  tokenStore.set(sessionId, token);
  return token;
};

export const useToken: Handler = async (req, res, next) => {
  try {
    let token = tokenStore.get(res.locals.sessionId);
    if (token) {
      if (token.expires < new Date()) {
        token = await refreshToken(res.locals.sessionId, token.refresh_token);
      }
      res.locals.githubToken = token;
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    res.sendStatus(503);
  }
};

/**
 * This is the URL that will be opened in a separate tab by the app. It will redirect to the OAuth tenant's login page
 */
authRouter.get('/login', (req, res) => {
  const { state } = req.query;
  if (typeof state !== 'string') {
    res.sendStatus(400);
  } else {
    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id,
      redirect_uri,
      state,
      scope: 'user repo read:org',
    });
    res.redirect(303, `${LOGIN_URI}?${queryParams.toString()}`);
  }
});

/**
 * Once the user has given the OAuth server their consent, they will be redirected to this path. The URL
 * will contain a code that can be exchanged for tokens and a state parameter that allows us to associate
 * them with the user's original request.
 */
authRouter.get('/callback/logged-in', (req, res) => {
  const { state, code } = req.query;
  if (
    typeof state !== 'string' ||
    !state ||
    typeof code !== 'string' ||
    !code
  ) {
    res.status(400).send();
  } else {
    authStore.set(state, code);
    res.send(
      'Successfully authenticated. Please close this tab to return to Stripe.',
    );
  }
});

authRouter.delete('/logout', verifyCaller, (req, res) => {
  tokenStore.delete(res.locals.sessionId);
  res.sendStatus(204);
});

/**
 * Here we receive a signed request from the app that associates our known state key with
 * a session ID. With this information we can fetch and save the user's tokens.
 */
authRouter.get('/verify', verifyCaller, (req, res) => {
  const { state } = req.query;
  if (typeof state !== 'string') {
    res.sendStatus(400);
    return;
  }
  const code = authStore.get(state);
  if (!code) {
    res.sendStatus(401);
    return;
  }
  authStore.delete(state);
  fetchToken(res.locals.sessionId, code)
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
});
