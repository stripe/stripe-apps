import {useEffect, useState} from 'react';
import {ContextView, Box} from '@stripe/ui-extension-sdk/ui';
import type {ExtensionContextValue} from '@stripe/ui-extension-sdk/context';
import stripeClient from '../clients/stripe';

type ColorOption = "critical" | "primary" | "disabled" | "brand" | "info" | "success" | "attention" | null;
const ColorOptions = [ "critical", "primary", "disabled", "brand", "info", "success", "attention" ];

const MetadataStorage = ({ environment }: ExtensionContextValue) => {
  const object = environment?.objectContext;
  const [favoriteColor, setFavoriteColor] = useState<ColorOption>(null);
  const [isLoading, setIsLoading] = useState(true);

  // retrieve information from customer metadata.
  const retrieveMetadata = async (customerId: string) => {
    try {
      const customer = await stripeClient.customers.retrieve(customerId);
      if (customer.deleted === true) throw new Error('Customer is deleted');
      const {favorite_color} = customer.metadata;
      if (favorite_color && ColorOptions.includes(favorite_color)) {
        setFavoriteColor(favorite_color as ColorOption);
      }
    } catch (error) {
      console.error('error fetching customer: ', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (object) {
      retrieveMetadata(object.id);
    }
}, [object]);

  return (
    <ContextView
      title="Metadata Demo"
      description="What is this customer's favorite color?"
    >
      <Box css={{ layout: 'row', padding: 'medium'}}>
        {isLoading ? (
            <Box css={{ font: 'lead' }}>Loading...</Box>
        ) : (
          <Box css={{
            color: favoriteColor || 'primary',
            font: favoriteColor ? 'subtitle' : 'lead',
          }}>
            {favoriteColor
              ? `This customer's favorite color is ${favoriteColor}`
              : 'A favorite color has not been set for this customer.'}
          </Box>
        )}
      </Box>
    </ContextView>
  );
};

export default MetadataStorage;
