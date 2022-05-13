import Stripe from 'stripe';
import { useEffect, useState, useCallback } from 'react';
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client';
import {
  Box,
  ContextView,
  Divider,
  Inline,
  Link,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

const Subscription = ({ userContext, environment }: ExtensionContextValue) => {
  const [subscription, setSubscription] = useState<Stripe.Subscription>();
  const getSubscriptionData = useCallback(async (subscriptionId: string) => {
    const data = await stripeClient.subscriptions.retrieve(subscriptionId);
    setSubscription(data);
  }, []);

  useEffect(() => {
    if (environment.objectContext?.id) {
      getSubscriptionData(environment.objectContext.id);
    }
  }, [getSubscriptionData]);

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
          <Box css={{ font: 'subtitle' }}>Subscription Details</Box>
          <Divider />
          {!subscription ? (
            <Box css={{ marginY: 'xxlarge' }}>
              Loading Subscription details...
            </Box>
          ) : (
            <>
              <Box css={{ marginY: 'large' }}>
                Customer: <Inline>{subscription.customer}</Inline>
              </Box>
              {typeof subscription.customer !== 'string' && !subscription.customer.deleted && (
                <>
                  <Box css={{ marginY: 'large' }}>
                    Email: <Link>{subscription.customer.email}</Link>
                  </Box>
                  <Box css={{ marginY: 'large' }}>
                    Name: <Inline>{subscription.customer.name}</Inline>
                  </Box>
                </>
              )}
              <Box css={{ marginY: 'large' }}>
                Due Date: <Inline>{subscription.days_until_due}</Inline>
              </Box>
              <Box css={{ marginY: 'large' }}>
                Status: <Inline>{subscription.status}</Inline>
              </Box>
              <Box css={{ marginY: 'large' }}>
                Collection: <Inline>{subscription.collection_method}</Inline>
              </Box>
              <Box css={{ marginY: 'large' }}>
                Start Date: <Inline>{subscription.current_period_start}</Inline>
              </Box>
              <Box css={{ marginY: 'large' }}>
                End Date: <Inline>{subscription.current_period_end}</Inline>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </ContextView>
  );
};

export default Subscription;
