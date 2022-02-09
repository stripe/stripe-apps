import axios, { AxiosError } from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as date from 'date-fns';
import express, { Handler } from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import 'source-map-support/register';
import { Stream } from 'stream';
import { Stripe } from 'stripe';

import {
  client_id,
  client_secret,
  githubAPIURI,
  githubAuthURI,
  redirect_uri,
  stripeAppSecret,
  stripeSecretKey,
} from './config';

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2020-08-27',
});

// These will be replaced with an actual persistent state store like Redis or a RDBMS.
const tokenStore = new Map<string, TokenSet>();
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
const LOGOUT_URI = 'https://dashboard.stripe.com';
const USER_URI = `${githubAPIURI}/user`;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Here we extract the session key used. Because we cannot use cookies to set a secure session id, the
 * only thing we can rely on is stripe's user and account IDs. These will be possible to securely verify
 * using a signed header once this is implemented in the Stripe apps SDK (see https://stripe.com/docs/stripe-apps/authenticate)
 */
const verifyCaller: Handler = (req, res, next) => {
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
const refreshToken = async (
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

/**
 * This is the URL that will be opened in a separate tab by the app. It will redirect to the OAuth tenant's login page
 */
app.get('/auth/login', (req, res) => {
  const { state } = req.query;
  if (typeof state !== 'string') {
    res.sendStatus(400);
  } else {
    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id,
      redirect_uri,
      state,
      scope: 'user repo',
    });
    res.redirect(303, `${LOGIN_URI}?${queryParams.toString()}`);
  }
});

/**
 * Once the user has given the OAuth server their consent, they will be redirected to this path. The URL
 * will contain a code that can be exchanged for tokens and a state parameter that allows us to associate
 * them with the user's original request.
 */
app.get('/auth/callback/logged-in', (req, res) => {
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

app.delete('/auth/logout', verifyCaller, (req, res) => {
  tokenStore.delete(res.locals.sessionId);
  res.redirect(303, LOGOUT_URI);
});

/**
 * Here we receive a signed request from the app that associates our known state key with
 * a session ID. With this information we can fetch and save the user's tokens.
 */
app.get('/auth/verify', verifyCaller, (req, res) => {
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
        console.error(error);
        res.sendStatus(401);
      } else {
        res.status(503).send('Cannot contact authentication server');
      }
    });
});

/**
 * This is an example of calling a protected API. We fetch the access token from our cache, renewing it with the
 * refresh token if it is expired, and use it to make a request on behalf of the user.
 *
 * Another approach to calling protected APIs would be to have an API that the frontend could use to fetch the access
 * token, which it would then use to contact the APIs directly. This is less secure but should still be acceptable since
 * access tokens are only valid for a short period of time and the server would still control the refresh mechanism.
 */
app.get('/auth/repositories', verifyCaller, async (req, res) => {
  try {
    let token = tokenStore.get(res.locals.sessionId);
    if (token) {
      if (token.expires < new Date()) {
        token = await refreshToken(res.locals.sessionId, token.refresh_token);
      }
      const response = await axios.get<Stream>(USER_URI, {
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
  } catch (e) {
    console.error(e);
    res.sendStatus(503);
  }
});

createServer(
  {
    key: readFileSync('server.key'),
    cert: readFileSync('server.cert'),
  },
  app,
).listen(8080, () => console.log('Server started'));
