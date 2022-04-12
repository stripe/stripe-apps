import Stripe from 'stripe';
import {
  STRIPE_API_KEY,
  createHttpClient,
} from '@stripe/ui-extension-sdk/http_client';
import { useState, useEffect, useCallback } from 'react';

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

export function useSecretStore<T>(userId: string, secretName: string) {
  const [secret, setSecret] = useState<T | null>(null);

  const postSecret = useCallback(
    (newSecret: any) => {
      const postTokenPath = `apps/secrets?scope[type]=user&scope[user]=${userId}&name=${secretName}`;
      const createSecretResource = Stripe.StripeResource.extend({
        request: Stripe.StripeResource.method({
          method: 'POST',
          path: postTokenPath,
        }),
      });

      new createSecretResource(stripe).request(
        { payload: JSON.stringify(newSecret) },
        function (err: any) {
          if (err) {
            console.error(err);
          } else {
            setSecret(newSecret);
          }
        },
      );
    },
    [userId, secretName],
  );

  const getSecret = useCallback(() => {
    const getTokenPath = `apps/secrets/find?scope[type]=user&scope[user]=${userId}&name=${secretName}&expand[]=payload`;
    const getSecretResource = Stripe.StripeResource.extend({
      request: Stripe.StripeResource.method({
        method: 'GET',
        path: getTokenPath,
      }),
    });

    new getSecretResource(stripe).request(
      {},
      function (err: any, retrievedSecret: any) {
        if (!err) {
          const theSecret = JSON.parse(retrievedSecret.payload);
          setSecret(theSecret);
        }
      },
    );
  }, [userId, secretName]);

  useEffect(() => {
    getSecret();
  }, [getSecret]);

  return { secret, postSecret };
}
