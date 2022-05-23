import Stripe from 'stripe';
import { useEffect, useState, useCallback } from 'react';
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client';
import { Box, ContextView, Divider, Inline } from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

const Product = ({ userContext, environment }: ExtensionContextValue) => {
  const [product, setProduct] = useState<Stripe.Product>();
  const getProductData = useCallback(async (productId: string) => {
    const data = await stripeClient.products.retrieve(productId);
    setProduct(data);
  }, []);

  useEffect(() => {
    if (environment.objectContext?.id) {
      getProductData(environment.objectContext.id);
    }
  }, [getProductData]);
  return (
    <ContextView title={`Hi, ${userContext?.name}`}>
      <Box
        css={{
          padding: 'large',
          backgroundColor: 'container',
          fontFamily: 'monospace',
          borderRadius: 'small',
        }}
      >
        <Box css={{ marginBottom: 'xxlarge' }}>
          <Box css={{ font: 'subtitle' }}>Product Details</Box>
          <Divider />
          {!product ? (
            <Box css={{ marginY: 'xxlarge' }}>Loading Product details...</Box>
          ) : (
            <>
              <Box css={{ paddingY: 'small', marginY: 'small' }} />
              <Box css={{ marginY: 'large' }}>
                Name: <Inline>{product.name}</Inline>
              </Box>
              <Box css={{ marginY: 'large' }}>
                ID: <Inline>{product.id}</Inline>
              </Box>
              <Box css={{ marginY: 'large' }}>
                Created: <Inline>{product.created}</Inline>
              </Box>
              <Box css={{ marginY: 'large' }}>
                Description:{' '}
                <Inline>
                  {product.description ? product.description : 'No Description'}
                </Inline>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </ContextView>
  );
};

export default Product;
