import {ContextView} from '@stripe/tailor-browser-sdk/ui';
import {TailorExtensionContextValue} from '@stripe/tailor-browser-sdk/context';
import {createHttpClient} from '@stripe/tailor-browser-sdk/http_client';
import gravatar from 'gravatar-api';
import Stripe from 'stripe';
import {useState} from 'react';

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

const Gravatar = ({object}: TailorExtensionContextValue) => {
  const [imageUrl, setImageUrl] = useState('');

  try {
    stripe.customers.retrieve(object.id).then((customer) => {
      setImageUrl(
        gravatar.imageUrl({
          email: customer.email,
        }),
      );
    });
  } catch (error) {
    console.log('Gravatar: Something went wrong', error);
  }

  return (
    <ContextView title="Gravatar">
      <img src={imageUrl} />
    </ContextView>
  );
};

export default Gravatar;
