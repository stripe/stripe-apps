# [Demo] Send custom Email using SendGrid

![Setting UI](./screenshot-1.png)

![Application UI](./screenshot-2.png)

This is an example to save/update any application settings in the Stripe Dashboard.
You can see how can we save/update your application option in the Stripe dashboard.

## Use case

- Save custom application settings
- Put any 3rd party API key
- etc..

## DO NOT USE IT FOR PRODUCTION

The example is using Stripe product as a Database.
You can see the code in the `src/libs/dummyDB.ts` file.
This file is only for the demo application, please do not use this file for your application.

Please rewrite this file from dummy DB to use your own API (and your own database).

## Running

1. From the `stripe-apps/examples/etting-ui` directory, run `yarn` to install dependencies
2. Once you install the `stripe apps` CLI plugin, run the start command:

```
stripe apps start
```

## Unit test

```bash
npm run test
```