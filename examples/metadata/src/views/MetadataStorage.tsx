import {useEffect, useState} from 'react';
import {ContextView, Group, Text} from '@stripe/tailor-browser-sdk/ui';
import type {TailorExtensionContextValue} from '@stripe/tailor-browser-sdk/context';
import stripeClient from '../clients/stripe';

const MetadataStorage = ({object}: TailorExtensionContextValue) => {
  const [favoriteColor, setFavoriteColor] = useState(null);
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
    retrieveMetadata(object.id);
  }, [object.id]);

  return (
    <ContextView
      title="Metadata Demo"
      description="What is this customer's favorite color?"
    >
      <Group direction="horizontal" spacing={20}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <Text color={favoriteColor} size={16}>
            {favoriteColor
              ? `This customer's favorite color is ${favoriteColor}`
              : 'A favorite color has not been set for this customer.'}
          </Text>
        )}
      </Group>
    </ContextView>
  );
};

export default MetadataStorage;
