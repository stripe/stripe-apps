# Webhook Example NodeJS Backend

This is an example backend that receives webhooks and uses them to store
information about connected accounts. This same structure, with the addition of
a real production database, could be used to onboard users that install an app
and provision resources for them.

## Running

1. Start by forwarding events to the local server by running
   `stripe listen --forward-connect-to localhost:8080/webhook`. Make a note of
   the signing secret the CLI gives you when it starts listening.
2. Duplicate the `.env.example` file in this folder and rename the copy `.env`.
   Fill out this new `.env` with the following variables:
   1. STRIPE_API_KEY with the secret API key from
      [your Developer Dashboard](https://dashboard.stripe.com/test/apikeys)
   2. STRIPE_WEBHOOK_SECRET with the signing secret you noted earlier
3. In a second terminal, install dependencies by running `yarn` and start the
   server by running `yarn start`
4. If your test account is not already set up as a Connect platform, it will
   need to be set up as one in order to test connected account webhooks. Go to
   [the Connect section of the Dashboard](https://dashboard.stripe.com/test/connect/accounts/overview)
   and click "Get Started" to set it up. This process isn't necessary to set up
   webhooks for production apps, it is just currently required for testing.
5. In that same connect overview page, press the "Create" button and create a
   new Custom account. This is an easy way to simulate a user who has installed
   our app. Make a note of their account ID.
6. In a third terminal, generate a mock event by running
   `stripe trigger --stripe-account CONNECTED_ACCOUNT_ID customer.created` where
   CONNECTED_ACCOUNT_ID is the ID you noted above. This should add the account
   to the backend's data storage and make it visible in the App frontend.

NOTE: In production, the event produced upon app installation would be
`account.application.authorized`. Since this event cannot yet be triggered via
the CLI, we have to use `customer.created`. The rest of the code is the same,
since all events from connected accounts include the connected account ID.
