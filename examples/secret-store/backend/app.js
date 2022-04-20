const express = require('express');
const app = express();

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_API_KEY);

const SecretResource = Stripe.StripeResource.extend({
  find: Stripe.StripeResource.method({
    method: "GET",
    path: 'apps/secrets/find',
  }),
  set: Stripe.StripeResource.method({
    method: 'POST',
    path: 'apps/secrets'
  }),
  delete: Stripe.StripeResource.method({
    method: 'POST',
    path: 'apps/secrets/delete'
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

app.get('/get_secret', async (req, res) => {
  const userId = req.query.user_id;
  const secretName = req.query.secret_name;

  try {
    const secret = await secretResource.find({'scope[user]': userId, 'scope[type]': 'user', name: secretName});

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

app.listen(4242, () => { console.log('App listening on port 4242')});