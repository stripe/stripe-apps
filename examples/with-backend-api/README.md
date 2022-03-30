# Using backend API with verifing signature

This is the example app to learn how can we call the external backend API secure.

Related Document: https://stripe.com/docs/stripe-apps/build-backend

<img width="925" alt="スクリーンショット 2022-03-30 19 11 41" src="https://user-images.githubusercontent.com/95597878/160808074-1db2686d-7463-4251-849f-eea903b6e6f0.png">


## Getting started

We need to process several steps to work this application.

### Step1: Setting up the workspace

Go to the `examples/with-backend-api` directory.
And run the `yarn` command to install dependencies.

### Step2: Upload the app to your Stripe account

We need to get the application secret before starting this app.

Please run the `stripe apps upload` command to upload it.

And go to the Stripe dashboard to get the application secret.

More detail: https://stripe.com/docs/stripe-apps/build-backend#before-you-begin

### Step3: Update environment variable in the backend app

Rename the `packages/backend/.env.example` file to `packages/backend/.env`.

```bash
% cp packages/backend/.env.example packages/backend/.env
```

And put your `Stripe Secret API Key` and your `Stripe APP secret` in to the file.

```
STRIPE_APP_SECRET=absec_xxxx
STRIPE_SECRET_API_KEY=sk_test_xxxx
```

### Step4: Start the backend API

You can start the backend application by using the following commands:

```bash
# in the project root
% yarn start:backend

# in /packages/backend
% yarn start
```

You can test this application by this command.

```bash
$ curl http://localhost:8080/ | jq .
{
  "message": "hello world"
}
```

### Step5: Start the Stripe APP

Finally, we can start the Stripe app.

```bash
# in the project root
% yarn start:frontend

# in /packages/frontend
% yarn start
```

## Features

We can try the following case to call the external API:

- Call the secret backend API  
Simply use-case that calling the backend API with the signature from Stripe.  
Related: https://stripe.com/docs/stripe-apps/build-backend#send-a-signed-request
- Call the secret backend API (with additional signature props)  
Adding an additional parameter to verify the request.  
Related: https://stripe.com/docs/stripe-apps/build-backend#send-a-signed-request-with-additional-data
- Call the secret backend API(no signature)  
Trying to call the API without signature.  
This request must be rejected.
- Create a new stripe customer data  
Simply example to call the Stripe API with the app user's Stripe account.
We can create a new Stripe customer in their account.
Related: https://stripe.com/docs/stripe-apps/build-backend#call-backend-from-ui-extension


