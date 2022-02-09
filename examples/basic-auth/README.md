# Integration with OAuth2 authentication example

This example, which consists of both an app and an example NodeJS backend,
demonstrates how to use a backend server to authenticate with an OAuth2
authorization server.

Because an app cannot at the moment receive an OAuth2 callback or securely save
auth tokens, we need a server with a storage solution which will store the
tokens for a user. User identity can be securely validated using
[signature checking](https://stripe.com/docs/stripe-apps/authenticate), allowing
tokens to be fetched as needed.

The example backend here is one that keeps the tokens on the server and expects
the frontend to call authenticated APIs only through the backend. This is the
most secure solution, however if proxying through a backend server is
undesirable, a solution where the frontend can request the access token stored
on the server to call the APIs directly is also possible and relatively
low-risk.

## Running the example

1. Upload the app using `stripe apps upload`. This is necessary to get the
   APP_SECRET (see below)
2. Use a tool like [mkcert](https://github.com/FiloSottile/mkcert) to create a
   local private key and certificate pair and save them in the backend folder as
   `key.pem` and `cert.pem` respectively. This is so the server can run behind
   TLS even in development.
3. Add "https://localhost:8080/auth/callback/logged-in" as a valid redirect URL
   in your auth server configuration.
4. Set the following environment variables:
   1. AUTH_HOST, the hostname of the authorization server you're authenticating
      with, such as `example.us.auth0.com`
   2. CLIENT_ID and CLIENT_SECRET, which you should generate and get from your
      authentication server
   3. APP_SECRET, get this from the uploaded app's details view
   4. STRIPE_API_KEY, get this from your Stripe developer dashboard
5. Run the backend server with `yarn dev`
6. Run the frontend with `stripe apps start`
7. You should be able to log in and log out. If you can't, your auth server
   might have slightly different paths to core apis like log in, userinfo or log
   out. You can modify lines 30-33 of the backend to match your server's
   configuration.

## Translating the example into production code

The most important changes that a production version of this pattern will have
to have are a real HTTPS implementation, which will probably be provided for you
by your infrastructure, and a real storage backend. Anything that can do
persistent and secure key-value storage will work. Redis is an acceptable and
widely-available solution.
