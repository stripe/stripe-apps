import {
  Notice,
	Group,
} from '@stripe/tailor-browser-sdk/ui';
import {useStripeContext} from '@stripe/tailor-browser-sdk/context';
import {createHttpClient} from '@stripe/tailor-browser-sdk/http_client'
import gravatar from 'gravatar-api';
import Stripe from 'stripe';
import {useState} from 'react';

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
})

const Gravatar = () => {

  const stripeCtx = useStripeContext();
  const [imageUrl, setImageUrl] = useState("");

  try {
    stripe.customers.retrieve(stripeCtx.object.id).then((customer) => {
      setImageUrl(gravatar.imageUrl({
        email: customer.email
      }))    
    });
  } catch (error) {
    console.log('Gravatar: Something went wrong', error);
  }

  return (
    <>
    <Group spacing={12}>
      <Notice
        title="Gravatar"
      />
      <img src={imageUrl} />
      </Group>
    </>
  );
  
};

export default Gravatar;