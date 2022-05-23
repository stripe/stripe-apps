# Webhooks Example

The following example demonstrates an app that does some automated onboarding of
accounts when they install an app and then makes that information available to
the frontend. This will be a useful pattern in cases where you need to provision
resources for each connected account or even just track app installations.

![App screenshot with account list](./app-screenshot.png)

# Running

## Backend
This example includes 7 server implementations in Node, Ruby, Python, Java, .NET, GO and PHP.

Follow the steps below to run locally.

1. Start by forwarding events to the local server by running
   `stripe listen --forward-connect-to localhost:8080/webhook`. Make a note of
   the signing secret the CLI gives you when it starts listening.

2. Copy the `.env.example` file into a file named `.env` in the folder of the server you want to use. For example:
    ```bash
    cp .env.example backend/java/app/.env
    ``` 

3. Set the following values:
   1. STRIPE_API_KEY with the secret API key from
      [your Developer Dashboard](https://dashboard.stripe.com/test/apikeys)
   2. STRIPE_WEBHOOK_SECRET with the signing secret you noted earlier

4. In a second terminal, navigate to the directory of the server language you want and follow the instructions in the server folder README on how to run. Example:

    ```bash
    cd backend/node # There's a README in this folder with instructions
    yarn
    yarn start
    ```

5. If your test account is not already set up as a Connect platform, it will
   need to be set up as one in order to test connected account webhooks. Go to
   [the Connect section of the Dashboard](https://dashboard.stripe.com/test/connect/accounts/overview)
   and click "Get Started" to set it up. This process isn't necessary to set up
   webhooks for production apps, it is just currently required for testing.

6. In that same connect overview page, press the "Create" button and create a
   new Custom account. This is an easy way to simulate a user who has installed
   our app. Make a note of their account ID.

7. In a third terminal, generate a mock event by running
   `stripe trigger --stripe-account CONNECTED_ACCOUNT_ID customer.created` where
   CONNECTED_ACCOUNT_ID is the ID you noted above. This should add the account
   to the backend's data storage and make it visible in the App frontend.

## Frontend

1. From the `frontend` folder, Install dependencies by running `yarn`
2. Make sure you have
   [installed the Stripe Apps CLI plugin](https://stripe.com/docs/stripe-apps/getting-started#install)
3. Start the app preview by running `stripe apps start`

NOTE: In production, the event produced upon app installation would be
`account.application.authorized`. Since this event cannot yet be triggered via
the CLI, we have to use `customer.created`. The rest of the code is the same,
since all events from connected accounts include the connected account ID.
