# Stripe Climate Example App

![Screenshot](./screenshot.png)

Simple example to show you how to integrate a link to Stripe Climate into your app.

## Setup

Make sure you are set up correctly by following the [UI Extension docs](https://stripe.com/docs/stripe-apps).

## Running

1. From the `stripe-apps/examples/climate` directory, run `yarn` to install dependencies
2. Once you install the `stripe apps` CLI plugin, run the start command:

```
stripe apps start
```

Then in your Stripe dashboard navigate to any page and you should see the example Stripe Climate
link snippet

## Using in your own app
Feel free to copy over the ClimateLinkComponent into your own app, or tweak the component as
you see appropriate to fit into your app.

Keep in mind that you'll need to copy over the `stripe_climate_logo.svg` as well for it to work
properly