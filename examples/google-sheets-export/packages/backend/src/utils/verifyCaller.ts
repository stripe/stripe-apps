import { Handler } from 'express';
import { Stripe } from 'stripe';

import { stripeAPIKey, stripeAppSecret } from '../config';

// Use your Stripe API key here
const stripe = new Stripe(stripeAPIKey, {
  apiVersion: '2020-08-27',
});

const verifyUser = (userId: unknown, accountId: unknown, sig: unknown) => {
  if (
    !(
      typeof userId === 'string' &&
      typeof accountId === 'string' &&
      typeof sig === 'string'
    )
  ) {
    throw new Error('Missing user identifiers');
  }

  stripe.webhooks.signature.verifyHeader(
    JSON.stringify({
      user_id: userId,
      account_id: accountId,
    }),
    sig,
    stripeAppSecret,
  );
};

export const verifyCaller: Handler = (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const userId = req.headers['stripe-user-id'];
  const accountId = req.headers['stripe-account-id'];

  try {
    verifyUser(userId, accountId, sig);
    res.locals.sessionId = `${userId}----${accountId}`;
    next();
  } catch (error) {
    console.log(`Error verifying user: ${error}`);
    res.sendStatus(400);
  }
};
