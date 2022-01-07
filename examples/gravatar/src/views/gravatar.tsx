import {ContextView} from '@stripe/ui-extension-sdk/ui';
import {TailorExtensionContextValue} from '@stripe/ui-extension-sdk/context';
import {createHttpClient} from '@stripe/ui-extension-sdk/http_client';
import gravatar from 'gravatar-api';
import Stripe from 'stripe';
import {useState} from 'react';

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

const Gravatar = ({environment}: TailorExtensionContextValue) => {
  const [imageUrl, setImageUrl] = useState('');
  const object = environment?.objectContext;

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
