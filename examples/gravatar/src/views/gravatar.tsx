import {
  Notice,
	Group,
} from '@stripe-internal/extensions-sail';
import {useStripeContext, createHttpClient} from '@stripe/tailor-browser-sdk';
import gravatar from 'gravatar-api';
import Stripe from 'stripe';
import {useState} from 'react';

const stripe = Stripe(process.env.STRIPE_API_KEY, {
  httpClient: createHttpClient()
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