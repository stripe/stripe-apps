const express = require('express');
const app = express();

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_API_KEY);

// Since Secret Store isn't in the SDK yet, we create a new Stripe resource with the information
// needed to send requests to the Secret Store API.
const SecretResource = Stripe.StripeResource.extend({
  set: Stripe.StripeResource.method({
    method: 'POST',
    path: 'apps/secrets'
  }),
  find: Stripe.StripeResource.method({
    method: 'GET',
    path: 'apps/secrets/find',
  }),
  delete: Stripe.StripeResource.method({
    method: 'POST',
    path: 'apps/secrets/delete'
  }),
  list: Stripe.StripeResource.method({
    method: 'GET',
    path: 'apps/secrets'
  })
});
const secretResource = new SecretResource(stripe);

app.use(express.urlencoded());

app.post('/set_secret', async (req, res) => {
  const userId = req.body.user_id;
  const secretName = req.body.secret_name;
  const secretValue = req.body.secret_value;

  try {
    const secret = await secretResource.set({'scope[user]': userId, 'scope[type]': 'user', name: secretName, payload: secretValue});

    res.status(200).json(secret);
  } catch(e) {
    console.log(e);
    res.status(e.statusCode).json(e.raw);
  }
});

app.get('/find_secret', async (req, res) => {
  const userId = req.query.user_id;
  const secretName = req.query.secret_name;

  try {
    const secret = await secretResource.find({'scope[user]': userId, 'scope[type]': 'user', name: secretName, 'expand[]': 'payload'});

    res.status(200).json(secret);
  } catch(e) {
    console.log(e);
    res.status(e.statusCode).json(e.raw);
  }
});

app.post('/delete_secret', async (req, res) => {
  const userId = req.body.user_id;
  const secretName = req.body.secret_name;

  try {
    const secret = await secretResource.delete({'scope[user]': userId, 'scope[type]': 'user', name: secretName});

    res.status(200).json(secret);
  } catch(e) {
    console.log(e);
    res.status(e.statusCode).json(e.raw);
  }
});

app.get('/list_secrets', async (req, res) => {
  const userId = req.query.user_id;

  try {
    const secrets = await secretResource.list({'scope[user]': userId, 'scope[type]': 'user'});

    res.status(200).json(secrets);
  } catch(e) {
    console.log(e);
    res.status(e.statusCode).json(e.raw);
  }
});

app.listen(4242, () => { console.log('App listening on port 4242'); });