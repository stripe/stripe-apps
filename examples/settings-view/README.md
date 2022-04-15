# Settings View Example

This is an example code that demonstrates how to display a settings page and using the SettingsView properties to save settings. The main purpose for this example is to show how to use the settingsView to allow admins configure their app installations.

## Features Demonstrated

- Displaying saved settings
- Saving settings

## Running the example

1. Upload the example using `stripe apps upload`. This is necessary to get the
   APP_SECRET.
2. Set the following environment variables:
   - APP_SECRET, get this from the uploaded app's details view
   - STRIPE_API_KEY, get this from your Stripe developer dashboard
3. Run the backend server with `yarn dev`
4. Run the frontend with `stripe apps start`