import "source-map-support/register";
import express, { Handler } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios, { AxiosError } from "axios";
import { createServer } from "https";
import { readFileSync } from "fs";
import { Stream } from "stream";
import { Stripe } from "stripe";
import * as date from "date-fns";

// Use your Stripe API key here
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2020-08-27",
});

// These will be replaced with an actual persistent state store like Redis or a RDBMS.
const tokenStore = new Map<string, TokenSet>(); // Maps users to their saved tokens
const authStore = new Map<string, string>(); // Maps auth states to their received codes

type TokenSet = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires: Date;
};

// Replace these with the information for your auth server
const LOGIN_URI = `https://${process.env.TENANT_DOMAIN}/authorize`;
const LOGOUT_URI = `https://${process.env.TENANT_DOMAIN}/v2/logout`;
const TOKEN_URI = `https://${process.env.TENANT_DOMAIN}/oauth/token`;
const USERINFO_URI = `https://${process.env.TENANT_DOMAIN}/userinfo`;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Here we extract the session key used. Because we cannot use cookies to set a secure session id, the
 * only thing we can rely on is stripe's user and account IDs. These will be possible to securely verify
 * using a signed header once this is implemented in the Stripe apps SDK (see https://stripe.com/docs/stripe-apps/authenticate)
 */
const verifyCaller: Handler = (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const userId = req.headers["stripe-user-id"];
  const accountId = req.headers["stripe-account-id"];
  try {
    verifyUser(userId, accountId, sig);
    res.locals.sessionId = `${userId}----${accountId}`;
    next();
  } catch (e) {
    res.sendStatus(400);
  }
};

const verifyUser = (userId: unknown, accountId: unknown, sig: unknown) => {
  // TODO: Add Stripe signature verification here when it is ready
  if (
    !(
      typeof userId === "string" &&
      typeof accountId === "string" &&
      typeof sig === "string"
    )
  )
    throw new Error("Missing user identifiers");
  stripe.webhooks.signature.verifyHeader(
    JSON.stringify({
      user_id: userId,
      account_id: accountId,
    }),
    sig,
    // Find your app's secret in your app settings page in the Developers Dashboard
    process.env.APP_SECRET!
  );
};

/**
 * Here we use the authorization code provided in the auth callback to fetch and store access, id, and refresh tokens.
 * These will allow us to call the API on behalf of the user.
 */
const fetchToken = async (
  sessionId: string,
  code: string
): Promise<TokenSet> => {
  const queryParams = new URLSearchParams({
    grant_type: "authorization_code",
    // You will need to load your client ID and secret from your auth configuration
    // using whatever secret management process is appropriate for your infrastructure
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    redirect_uri: "https://localhost:8080/auth/callback/logged-in",
    code,
  });
  const response = await axios.post(TOKEN_URI, queryParams, {
    responseType: "json",
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
  refreshToken: string
): Promise<TokenSet> => {
  const queryParams = new URLSearchParams({
    grant_type: "refresh_token",
    // You will need to load your client ID and secret from your auth configuration
    // using whatever secret management process is appropriate for your infrastructure
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    refresh_token: refreshToken,
  });
  const response = await axios.post(TOKEN_URI, queryParams, {
    responseType: "json",
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
app.get("/auth/login", (req, res) => {
  const { state } = req.query;
  if (typeof state !== "string") {
    res.sendStatus(400);
  } else {
    const queryParams = new URLSearchParams({
      audience: "https://test-api.example.com",
      response_type: "code",
      client_id: process.env.CLIENT_ID!,
      redirect_uri: "https://localhost:8080/auth/callback/logged-in",
      state,
      scope: "offline_access openid profile email",
    });
    res.redirect(303, `${LOGIN_URI}?${queryParams.toString()}`);
  }
});

/**
 * Once the user has given the OAuth server their consent, they will be redirected to this path. The URL
 * will contain a code that can be exchanged for tokens and a state parameter that allows us to associate
 * them with the user's original request.
 */
app.get("/auth/callback/logged-in", (req, res) => {
  const { state, code } = req.query;
  if (
    typeof state !== "string" ||
    !state ||
    typeof code !== "string" ||
    !code
  ) {
    res.sendStatus(400);
  } else {
    authStore.set(state, code);
    res.send(
      "Successfully authenticated. Please close this tab to return to Stripe."
    );
  }
});

/**
 * To log out from the auth tenant and thus revoke the refresh token we must redirect to it
 */
app.get("/auth/logout", (req, res) => {
  res.redirect(303, LOGOUT_URI);
});

/**
 * Deleting the tokens stored in session must be a separate call from logout, since logout redirects
 * are not signed, so we have no way of verifying the user on this server.
 */
app.delete("/auth/session", verifyCaller, (req, res) => {
  tokenStore.delete(res.locals.sessionId);
  res.sendStatus(204);
});

/**
 * Here we receive a signed request from the app that associates our known state key with
 * a session ID. With this information we can fetch and save the user's tokens.
 */
app.get("/auth/verify", verifyCaller, (req, res) => {
  const { state } = req.query;
  if (typeof state !== "string") {
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
        res.status(503).send("Cannot contact authentication server");
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
app.get("/auth/userinfo", verifyCaller, async (req, res) => {
  try {
    let token = tokenStore.get(res.locals.sessionId);
    if (token) {
      if (token.expires < new Date()) {
        token = await refreshToken(res.locals.sessionId, token.refresh_token);
      }
      const response = await axios.get<Stream>(USERINFO_URI, {
        responseType: "stream",
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
    console.log(e);
    res.sendStatus(503);
  }
});

createServer(
  // This auth server will only work under HTTPS. If you want to run it for testing
  // you should generate a local certificate with a tool like mkcert. In production
  // infrastructure certs and HTTPS will likely be handled at a different level and
  // this node server can be HTTP.
  {
    key: readFileSync("key.pem"),
    cert: readFileSync("cert.pem"),
  },
  app
).listen(8080, () => console.log("Server started"));
