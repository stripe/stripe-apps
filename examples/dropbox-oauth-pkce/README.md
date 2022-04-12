# Dropbox OAuth PKCE with Secret Store

**This app is not endorsed by Dropbox, it was written by Stripe as a demonstration of the Stripe App platform.**

The "Dropbox OAuth PKCE" app allows Dashboard users to retrieve an OAuth token from Dropbox using OAuth 2.0 PKCE.

## Platform capabilities demonstrated
- OAuth PKCE workflow
  - `createOAuthState` function
- Using Secret Store API to save OAuth tokens
- Connecting to an external API

## Usage

To test this example, you'll need to [create a Dropbox app](https://www.dropbox.com/lp/developers).

Once you've created an app, copy the "App key" from the developer console and paste it into a new file `config.ts` like so:

```typescript
export const client_id='random_clientID'
```

This test app will require the correct redirect URI to be set in the app settings. In the case of this example, that's:

```
https://dashboard.stripe.com/test/apps-oauth/com.example.dropbox-oauth-pkce
```

Finally, for the Load Account Data button to work, grant your app the `sharing.read` scope.