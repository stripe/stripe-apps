import {useEffect, useState} from 'react';
import {ContextView, View} from '@stripe/tailor-browser-sdk/ui';
import type {TailorExtensionContextValue} from '@stripe/tailor-browser-sdk/context';
import stripeClient from '../clients/stripe';

const MetadataStorage = ({object}: any) => {
  // const customerContext = environment?.objectContext;
  const [favoriteColor, setFavoriteColor] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // retrieve information from customer metadata.
  const retrieveMetadata = async (customerId: string) => {
    try {
      const customer = await stripeClient.customers.retrieve(customerId);
      if (customer.deleted === true) throw new Error('Customer is deleted');
      console.log('fetched customer: ', customer);
      const {favorite_color} = customer.metadata;
      if (favorite_color) {
        setFavoriteColor(favorite_color);
      }
    } catch (error) {
      console.error('error fetching customer: ', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(object)
    retrieveMetadata(object.id);
  }, [object]);

  return (
    <ContextView
      title="Metadata Demo"
      description="What is this customer's favorite color?"
    >
      <View css={{display: 'flex', padding: 'medium'}}>
        {isLoading ? (
            <View  type="span" css={{ font: 'lead' }}>Loading...</View>
        ) : (
          <View css={{
            color: favoriteColor,
            font: favoriteColor ? 'subtitle' : 'lead',
          }}>
            {favoriteColor
              ? `This customer's favorite color is ${favoriteColor}`
              : 'A favorite color has not been set for this customer.'}
          </View>
        )}
      </View>
    </ContextView>
  );
};

export default MetadataStorage;
