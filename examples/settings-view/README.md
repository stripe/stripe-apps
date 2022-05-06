# Settings View Example

![screenshot](./screenshot-1.png)
![screenshot2](Screenshot-2.png)

This is an example code that demonstrates how to display a settings page and using the SettingsView properties to save settings. The main purpose for this example is to show how to use the settingsView to allow admins configure their app installations.

## Setup

Make sure you are set up correctly by following the [UI Extension docs](https://stripe.com/docs/stripe-apps).

## Running

1. Upload the example using `stripe apps upload`. This is necessary to get the APP_SECRET.
2. Set the following environment variables:
   - APP_SECRET, get this from the uploaded app's details view
   - STRIPE_API_KEY, get this from your Stripe developer dashboard
3. From the `stripe-apps/examples/settings-view` directory, `cd` to `frontend` folder and run `yarn` to install dependencies. Do this also for the `backend` folder.
4. Run the backend server with `yarn dev`
5. Run the frontend with `stripe apps start`

## Testing

There are no tests for this example.