# [Demo] Send custom Email using SendGrid

![./screenshot.png]

This is an example to send custom email to the customer from the Stripe Dashboard.
The application will get the `to` address and `from` address automatically.
We just put the subject and text of the email.

## Use case

- Notify to the customer about payment issue
- Send a promotional Email
- etc...

## Send a real Email

By default, the application does not send any email.
We need to do the folliwing tasks to do this.

- Deploy API service
- Register the API url to the CSP
- Call the API from the app

### Deploy API service
We need to deploy the Express application to a hosting service.
The source code are in the `api` directory.

```bash
cd api
yarn
```

And we need to put these environment variables into the `api/.env`.

```env
SENDGRID_API_KEY='YOUR_SENDGRID_API_KEY'
```

If you want to test this api locally, we can start it by the command.

```bash
node index.js
```

### Register the API url to the CSP

To call the external API, we need to update the `stripe-app.json` file to register the API url.

```diff
    "content_security_policy": {
-      "connect-src": [],
+      "connect-src": ["https://YOUR-CUSTOM-API-URL"],
      "purpose": ""
    }
```


### Call the API from the app

After deploy the API app, we need to update the URL in the `src/hooks/sendMail.ts`.

```diff
-            setErrorMessage([
-                "API will called by these props",
-                JSON.stringify({
-                    from: fromAddress,
-                    to: customer.email,
-                    subject,
-                    text
-                }, null, 2),
-                "If you want to send a real email, please update the code to call the real API."
-            ].join('\n'))
-            setSendingStatus('error')
-            return;
-            /**
-             * @TODO replace the API to send a real email
-            fetch('https://example.com', {
+            fetch('https://YOUR-CUSTOM-API-URL', {
...
-           */
        },
        sendEmailErrorMessage: errorMessage,
        sendingStatus,
        subject,
        setSubject,
        text,
        setText,
    }
}
```

