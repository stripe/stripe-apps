import Stripe from 'stripe';
import { useEffect, useState, useCallback } from 'react';
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client';
import {
  Badge,
  Box,
  ContextView,
  Divider,
  Inline,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

const Payment = ({ userContext, environment }: ExtensionContextValue) => {
  const [payment, setPayment] = useState<Stripe.PaymentIntent>();

  const getPaymentData = useCallback(async (paymentId: string) => {
    const data = await stripeClient.paymentIntents.retrieve(paymentId);
    setPayment(data);
  }, []);

  useEffect(() => {
    if (environment.objectContext?.id) {
      getPaymentData(environment.objectContext.id);
    }
  }, [getPaymentData]);

  const getStatusBadgeType = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'succeeded':
        return 'positive';
      case 'canceled':
        return 'negative';
      case 'processing':
        return 'warning';
      default:
        return undefined;
    }
  };

  return (
    <ContextView title={`Welcome, ${userContext?.name}!`}>
      <Box
        css={{
          padding: 'large',
          backgroundColor: 'container',
          fontFamily: 'monospace',
          borderRadius: 'small',
        }}
      >
        <Box css={{ marginBottom: 'xxlarge' }}>
          <Box css={{ font: 'subtitle' }}>Payment Info</Box>
          <Divider />
          {!payment ? (
            <Box css={{ marginY: 'xxlarge' }}>Loading Payment details...</Box>
          ) : (
            <Tabs fitted>
              <TabList>
                {['payment', 'charges'].map((i) => (
                  <Tab key={i}>{i}</Tab>
                ))}
              </TabList>
              <TabPanels>
                <TabPanel key="payment">
                  <Box css={{ marginY: 'medium' }}>
                    <Inline css={{ marginRight: 'large' }}>Status: </Inline>
                    <Badge type={getStatusBadgeType(payment.status)}>
                      {payment.status}
                    </Badge>
                  </Box>
                  <Box css={{ marginY: 'medium' }}>
                    <Inline css={{ marginRight: 'large' }}>Amount: </Inline>
                    <Inline>
                      {payment.amount}
                      {payment.currency}
                    </Inline>
                  </Box>
                  <Box css={{ marginY: 'medium' }}>
                    <Inline css={{ marginRight: 'medium' }}>Customer:</Inline>
                    <Inline>{payment.customer}</Inline>
                  </Box>
                  <Box css={{ marginY: 'medium' }}>
                    <Inline>Description: </Inline>
                    <Inline>{payment.description}</Inline>
                  </Box>
                </TabPanel>
                <TabPanel key="charges">
                  <Box>
                    {payment.charges?.data.map((item) => (
                      <Box css={{ marginBottom: 'medium' }}>
                        <Box css={{ marginY: 'medium' }}>
                          <Inline css={{ marginRight: 'large' }}>
                            Statement Descriptor:
                          </Inline>
                          <Inline>
                            {item.calculated_statement_descriptor}
                          </Inline>
                        </Box>
                        <Box css={{ marginY: 'medium' }}>
                          <Inline css={{ marginRight: 'large' }}>
                            Card type:
                          </Inline>
                          <Badge type="info">
                            {item.payment_method_details?.card?.brand}
                          </Badge>
                        </Box>
                        <Box css={{ marginY: 'medium' }}>
                          <Inline css={{ marginRight: 'medium' }}>
                            Card Number:
                          </Inline>
                          <Inline>
                            ....
                            {item.payment_method_details?.card?.last4}
                          </Inline>
                        </Box>
                        <Box css={{ marginY: 'medium' }}>
                          <Inline css={{ marginRight: 'large' }}>
                            CVC Check:
                          </Inline>
                          <Badge type={getStatusBadgeType(payment.status)}>
                            {
                              item.payment_method_details?.card?.checks
                                ?.cvc_check
                            }
                          </Badge>
                        </Box>
                        <Box css={{ marginY: 'medium' }}>
                          <Inline css={{ marginRight: 'xxlarge' }}>
                            Country:
                          </Inline>
                          <Inline>
                            {item.payment_method_details?.card?.country}
                          </Inline>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
      </Box>
    </ContextView>
  );
};

export default Payment;
