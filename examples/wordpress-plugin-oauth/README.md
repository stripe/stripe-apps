# Stripe apps for plugin example (WordPress)

You can connect to Stripe account from WordPress through by Stripe Apps for plugin.
This application provides the following features:

- Stripe Apps for plugins
- Provide authentication callback using WP API
- Grant and refresh authentication token
- Create and list Stripe customer by using access_token.

## Requirement

- 2 Stripe account  
1: For uploading (and publish) Stripe App  
2: Install the Stripe app for testing
-  **node version v20.0.0**

## Getting started

You can download two application ( Stripe App, Demo WordPress Site ) from the following Git command:

```bash
% git clone git@github.com:hideokamoto-stripe/stripe-app-plugin-for-wordpress.git
% npm install
```

### Step1: [/wordpress] Setting up WordPress

You need to configure the WordPress plugin. Please run the `npm run -w wordpress start` to launch the WordPress.

```bash
$ npm run -w wordpress start

> wordpress@1.0.0 start
> wp-now start

...

```

The command will show the URL for the WordPress site:

```bash
Starting the server......
directory: /Users/stripe/samples/stripe-app-example-wordperss-oauth/wordpress
mode: plugin
php: 8.0
wp: latest
WordPress latest folder already exists. Skipping download.
SQLite folder already exists. Skipping download.
Server running at http://localhost:8881
```

Visit the WordPress site from the URL from the CLI result.

![WordPress site](/assets/images/step1.png)


### Step2: [/wordpress] Set HTTP proxy by `ngrok`

For connecting with Stripe App, we need to get a public URL. So use `ngrok` to get the proxy URL to the local WordPress site:
If the WordPress URL is `http://localhost:8881` you can run `ngrok` like this:

```bash
$ ngrok http 8881
```

`ngrok` will provide a public URL, so please copy the URL.

### Step3: [/stripe-app] Seting up Stripe App

Let's move on to configure Stripe App, open the `stripe-app/stripe-app.json` for putting the OAuth callback URL:

```diff
  "allowed_redirect_uris": [
-    "https://REPLACE_YOUR_WORDPRESS_URL/wp-json/stripe-apps/v1/callback"
+    "https://{YOUR_NGROK_URL}/wp-json/stripe-apps/v1/callback"
  ],
```

`{YOUR_NGROK_URL}` is a URL you get from the `ngrok http` command.

### Step4: [/stripe-app] Upload Stripe app for get the Stripe APP install URL

You need to upload this app into your Stripe account.

```bash
$ npm run -w stripe-app upload
```

After succeeded to upload the app, you need to run this command:

```bash
$ npm run -w stripe-app stripe apps set distribution public
```

By default, a Stripe App will always be uploaded as a private app due to the number limitation of public apps (1 app per account). Therefore, we need to run this command to make it clear that we want to use this app publicly.

After updating the distribution setting, please upload this app again.

```bash
$ npm run -w stripe-app upload
```

On the Stripe dashboard, you can get the Installation link on the "External test" tab:

![screenshot](/assets/images/step2.png)

Please copy the URL on the `Test mode link`.

### Step5: [/wordpress] Put the API Key and Stripe App install URL

Move to the WordPress site, please visit the administration page through the menu in the header.

![screenshot](/assets/images/step3.png)

Click the `Stripe App` tab in the sidebar menu.

![screenshot](/assets/images/step4.png)

Please put the `Test mode link` starting from 'https://marketplace.stripe.com/oauth' into the `App Install URL` field.
And put your Stripe Secret API key into the `Secret API key` field.

![screenshot](/assets/images/step5.png)

Press the `Save settings` button to save these data.

### Step6: [/wordpress] Save the data and start to OAuth flow

After succeeded to save the data, you can install Stripe App button on the plugin page.

![screenshot](/assets/images/step6.png)


Click this link, and accept the external beta testing.

![screenshot](/assets/images/step7.png)

You can choose or create a new Stripe account to connect to the WordPress site. You need to choose a Stripe account other thant the one used to upload the Stripe app.

![screenshot](/assets/images/step8.png)

After authentication succeeded, you're going to redirect to the plugin setting page.

### Step7: Create a new Stripe customer

You can create a new Stripe customer from this page, please click the `Create a new customer` button.

![screenshot](/assets/images/step9.png)


Then, this WordPress plugin will create a new customer and return the customer data.

![screenshot](/assets/images/step10.png)


## Useful command

### Start Stripe App

```bash
$ npm run -w stripe-app start
```

### Start WordPress 

```bash
$ npm run -w wordpress start
```

### Stripe CLI

```bash
$ npm run -w stripe-app stripe <SUB_COMMAND>

# example
$ npm run -w stripe-app stripe apps grant permission "customer_read" "List the customer names"
```

### wp-now

```bash
$ npm run -w wordpress wp-now <SUB_COMMAND>
```