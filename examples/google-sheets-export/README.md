# [Demo] Authenticate with Google Sheets using OAuth

An example app that demonstrates the ability to export data out of the Stripe dashboard and into a Google spreadsheet. This app renders on Stripe's `home` viewport and uses OAuth to authenticate the user with Google.

Before you run this application, ensure you are set up by following the [UI Extension docs](https://stripe.com/docs/stripe-apps).

This example uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to hoist shared dependencies between the back end and front end applications.

Before starting the app, you will need to:

- Add the `stripe-preview` executable to your `/usr/bin` or `/usr/local/bin` folder if you're on MacOS. This allows Stripe Apps to be launched from within a `package.json` script. [Using an alias as in the documentation](https://stripe.com/docs/stripe-apps/getting-started#install) is insufficient.
- Create a `.env` file inside the `/backend` folder with your Google Client ID and Client Secret values, and other variables. The included `.env.example` file can be used as a template.
- Run `npm run generateKeys` inside the `/backend` folder to generate a certificate for running the local back end server over HTTPS. (_Note_: these local keys won't be trusted by your browser. For example, in Chrome, when the requests are inevitably blocked, type `thisisunsafe` while the tab is open to proceed. You do not need to type this into the URL bar or any text input - just type it while the tab is open and in focus.)
- View your [Stripe API keys](https://dashboard.stripe.com/test/apikeys) to get values for `STRIPE_API_KEY` and `STRIPE_APP_SECRET`. To get a value for the `.env` variable `STRIPE_APP_SECRET`, you will need to upload your app to Stripe. You can do this with `npm workspace frontend upload`. Then go to the [developer dashboard](https://dashboard.stripe.com/test/apps) to find your app and the generated key.
- [Create a new OAuth app within your Google account](https://developers.google.com/identity/protocols/oauth2). For this development server's current configuration, you should set `http://localhost:4242` as an authorized JavaScript Origin, and set `https://localhost:3000/api/auth/callback/logged-in` as the authorized redirect URI. Use the values you get during this process to fill in `AUTH_CLIENT_ID` and `AUTH_CLIENT_SECRET` variables in the backend's `.env` file.

To run the application, run the following commands from the root folder:

```zsh
# install and hoist dependencies
npm install
```

```zsh
# start the front end app
npm start
```

```zsh
# start the back end server
npm run start:backend
```

The back end server will start on `localhost:3000`.
