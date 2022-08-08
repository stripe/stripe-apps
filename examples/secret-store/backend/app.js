const express = require('express');
const app = express();

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_API_KEY);

app.use(express.urlencoded());

app.post('/set_secret', async (req, res) => {
  const userId = req.body.user_id;
  const secretName = req.body.secret_name;
  const secretValue = req.body.secret_value;
  const secretExpiry = req.body.secret_expiry;

  try {
    const secret = await stripe.apps.secrets.create({
      scope: { type: 'user', user: userId }, 
      name: secretName, 
      payload: secretValue, 
      expires_at: secretExpiry
    });

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
    const secret = await stripe.apps.secrets.find({scope: { type: 'user', user: userId }, name: secretName, expand: ['payload']});

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
    const secret = await stripe.apps.secrets.deleteWhere({scope: { type: 'user', user: userId }, name: secretName});

    res.status(200).json(secret);
  } catch(e) {
    console.log(e);
    res.status(e.statusCode).json(e.raw);
  }
});

app.get('/list_secrets', async (req, res) => {
  const userId = req.query.user_id;

  try {
    const secrets = await stripe.apps.secrets.list({scope: { type: 'user', user: userId }});

    res.status(200).json(secrets);
  } catch(e) {
    console.log(e);
    res.status(e.statusCode).json(e.raw);
  }
});

app.listen(4242, () => { console.log('App listening on port 4242'); });