import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { Stripe } from 'stripe';
dotenv.config();

const app: express.Express = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY as string, {
  apiVersion: '2020-08-27',
});

const secretAPIRouter = express.Router();
/**
 * Express middleware to verify the Stripe APP request
 */
secretAPIRouter.use(async (req, res, next) => {
  const payload = JSON.stringify({
    user_id: req.body['user_id'],
    account_id: req.body['account_id'],
  });
  const sig = req.headers['stripe-signature'];
  try {
    stripe.webhooks.signature.verifyHeader(
      payload,
      Array.isArray(sig) ? sig[0] : sig,
      process.env.STRIPE_APP_SECRET,
    );
    next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: e.message,
    });
  }
});
secretAPIRouter.post('/do_secret_stuff', async (req, res) => {
  try {
    return res.status(200).json({
      message: 'hello.',
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});
secretAPIRouter.post('/customers/create', async (req, res) => {
  const { account_id: accountId } = req.body;
  const customer = await stripe.customers.create(
    {
      description: `Test customer created by the Stripe APP`,
      metadata: {
        accountId,
        userId: req.body['user_id'],
      },
    },
    {
      stripeAccount: accountId,
    },
  );
  return res.status(200).json({
    customer_id: customer.id,
  });
});

const moreSecretAPIRouter = express.Router();
/**
 * Express middleware to verify the Stripe APP request (using additional signature props)
 */
moreSecretAPIRouter.use(async (req, res, next) => {
  const payload = JSON.stringify(req.body);
  const sig = req.headers['stripe-signature'];
  try {
    stripe.webhooks.signature.verifyHeader(
      payload,
      Array.isArray(sig) ? sig[0] : sig,
      process.env.STRIPE_APP_SECRET,
    );
    next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: e.message,
    });
  }
});
moreSecretAPIRouter.post('/do_secret_stuff', async (req, res) => {
  try {
    return res.status(200).json({
      message: 'hello.',
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'hello world',
  });
});

app.use('/more_secret', moreSecretAPIRouter);
app.use('/secret', secretAPIRouter);
app.listen(8080, () => {
  console.log('Start on port 8080.');
});
