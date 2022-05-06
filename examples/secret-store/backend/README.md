# Secret Store Express Demo

This example Express app shows how to interact with Secret Store from a backend app. The app exposes three API endpoints, `/get_secret`, `/set_secret`, and `/delete_secret`. Usage is as follows:

## Starting the server

```
STRIPE_API_KEY=$STRIPE_TEST_KEY node app.js
```

## Setting a secret

```
curl localhost:4242/set_secret -d "secret_name"="name" -d "secret_value"="shh" -d "user_id"="usr_5"
```

## Getting a secret

```
curl "localhost:4242/get_secret?secret_name=name&user_id=usr_5"
```

## Deleting a secret

```
curl localhost:4242/delete_secret -d "secret_name"="name" -d "user_id"="usr_5"
```

## More information

See the [Secret Store docs](https://stripe.com/docs/stripe-apps/store-auth-data-custom-objects) to learn more about the API, and the [API reference](https://stripe.com/docs/api/secret_management) for request and response definitions.