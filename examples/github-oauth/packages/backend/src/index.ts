import axios, { AxiosError } from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createHash, randomUUID } from 'crypto';
import express from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import { join } from 'path';
import 'source-map-support/register';

import { authorizationURI, client_id, client_secret, tokenURI } from './config';

const codeCache = new Map();
const verifierCache = new Map();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/auth/login', (req, res) => {
  const { state } = req.query;
  if (typeof state !== 'string') {
    res.status(400).send();
  } else {
    const codeVerifier = randomUUID();
    verifierCache.set(state, codeVerifier);
    const verifierHash = createHash('sha256');
    verifierHash.update(codeVerifier);
    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id,
      redirect_uri: 'https://localhost:8080/auth/authorize',
      scope: 'user repo',
      state,
      code_challenge: verifierHash.digest('base64url'),
      code_challenge_method: 'S256',
    });
    res.redirect(303, `${authorizationURI}?${queryParams.toString()}`);
  }
});

app.get('/auth/authorize', (req, res) => {
  const { state, code } = req.query;
  if (
    typeof state !== 'string' ||
    !state ||
    typeof code !== 'string' ||
    !code
  ) {
    res.status(400).send();
  } else {
    if (verifierCache.has(state)) {
      codeCache.set(state, code);
      res.send('Authenticated! Close this tab or window to return to Stripe');
    } else {
      res
        .status(401)
        .send(
          'State parameter not recognized. Please try authenticating again.',
        );
    }
  }
});

app.get('/auth/token', (req, res) => {
  const { state } = req.query;
  if (typeof state !== 'string' || !state) {
    res.status(400).send();
  } else {
    const verifier = verifierCache.get(state);
    const code = codeCache.get(state);
    if (code && verifier) {
      const queryParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id,
        client_secret,
        redirect_uri: 'https://localhost:8080/auth/authorize',
        code,
        code_verifier: verifier,
      });
      axios
        .post<JSON>(tokenURI, queryParams, {
          headers: {
            Accept: 'application/json',
          },
        })
        .then(codeResponse => {
          res.set('content-type', codeResponse.headers['content-type']);
          res.status(codeResponse.status);
          res.send(codeResponse.data);
        })
        .catch((error: AxiosError<JSON>) => {
          if (error.response) {
            const codeResponse = error.response;
            res.set('content-type', codeResponse.headers['content-type']);
            res.status(codeResponse.status);
            res.send(codeResponse.data);
          } else {
            res.status(503).send('Cannot contact authentication server');
          }
        });
    } else {
      res
        .status(401)
        .send(
          'State parameter not recognized. Please try authenticating again.',
        );
    }
  }
});

app.get('/auth/refresh-token', (req, res) => {
  const { token } = req.query;
  if (typeof token !== 'string' || !token) {
    res.status(400).send();
  } else {
    const queryParams = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token,
      client_id,
      client_secret,
      redirect_uri: 'https://localhost:8080/auth/authorize',
    });
    axios
      .post<JSON>(tokenURI, queryParams, {
        headers: {
          Accept: 'application/json',
        },
      })
      .then(codeResponse => {
        res.set('content-type', codeResponse.headers['content-type']);
        res.send(codeResponse.data);
      })
      .catch((error: AxiosError<JSON>) => {
        if (error.response) {
          const codeResponse = error.response;
          res.set('content-type', codeResponse.headers['content-type']);
          res.status(codeResponse.status);
          res.send(codeResponse.data);
        } else {
          res.status(503).send('Cannot contact authentication server');
        }
      });
  }
});

const options = {
  key: readFileSync(join(__dirname, '../server.key')),
  cert: readFileSync(join(__dirname, '../server.cert')),
};
createServer(options, app).listen(8080, () => console.log('Server started'));
