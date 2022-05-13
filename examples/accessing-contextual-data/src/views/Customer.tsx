import Stripe from 'stripe';
import { useEffect, useState, useCallback } from 'react';
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {
  Box,
  ContextView,
  Divider,
  Inline,
  Link,
} from '@stripe/ui-extension-sdk/ui';

const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

const Customer = ({ userContext, environment }: ExtensionContextValue) => {
  const [customer, setCustomer] = useState<Stripe.Customer | Stripe.DeletedCustomer>();

  const getCustomer = useCallback(async (customerId: string) => {
    const data = await stripeClient.customers.retrieve(customerId);
    setCustomer(data);
  }, []);

  useEffect(() => {
    if (environment.objectContext?.id) {
      getCustomer(environment.objectContext.id);
    }
  }, [getCustomer]);

  return (
    <ContextView title={`Welcome, ${userContext?.name}!`}>
      <Box
        css={{
          padding: 'large',
          backgroundColor: 'container',
          fontFamily: 'monospace',
          borderRadius: 'large',
        }}
      >
        <Box css={{ marginBottom: 'xxlarge' }}>
          <Box css={{ font: 'subtitle' }}>Customer Details</Box>
          <Divider />
          {!customer ? (
            <Box css={{ marginY: 'xxlarge' }}>Loading Customer's Detail...</Box>
          ) : !customer.deleted && (
            <>
              <Box css={{ font: 'heading', fontWeight: 'bold' }}>
                Name: <Inline>{customer.name}</Inline>
              </Box>
              <Inline css={{ font: 'heading', fontWeight: 'bold' }}>
                Email:{' '}
              </Inline>
              <Link>{customer.email}</Link>
              <Box
                css={{ layout: 'column', gap: 'large', marginTop: 'xlarge' }}
              >
                <Box css={{ width: 'auto' }}>
                  <Box css={{ font: 'heading' }}>Address</Box>
                  {customer.address ? (
                    <Box>
                      <Box>{customer.address.line1}</Box>
                      <Box>
                        {customer.address.city}, {customer.address.state},{' '}
                        {customer.address.country}.
                      </Box>
                      <Box>{customer.address.postal_code}</Box>
                    </Box>
                  ) : (
                    <Inline css={{ font: 'body' }}>No Address found</Inline>
                  )}
                </Box>
                <Box>
                  <Box css={{ font: 'heading' }}>Shipping</Box>
                  {customer.shipping ? (
                    <Box>
                      <Box>{customer.shipping.address?.line1}</Box>
                      <Box>
                        {customer.shipping.address?.city},{' '}
                        {customer.shipping.address?.state},{' '}
                        {customer.shipping.address?.country}.
                      </Box>
                      <Box>{customer.shipping.address?.postal_code}</Box>
                    </Box>
                  ) : (
                    <Inline css={{ font: 'body' }}>
                      No Shipping info found
                    </Inline>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </ContextView>
  );
};

export default Customer;
