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
  Link,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});
const Invoice = ({ userContext, environment }: ExtensionContextValue) => {
  const [invoice, setInvoice] = useState<Stripe.Invoice>();

  const getInvoiceData = useCallback(async (invoiceId: string) => {
    const data = await stripeClient.invoices.retrieve(invoiceId);
    setInvoice(data);
  }, []);

  useEffect(() => {
    if (environment.objectContext?.id) {
      getInvoiceData(environment.objectContext.id);
    }
  }, [getInvoiceData]);

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
        <Box css={{ marginBottom: 'xxlarge', wordBreak: 'break-word' }}>
          <Box css={{ font: 'subtitle' }}>Invoice Details</Box>
          <Divider />
          {!invoice ? (
            <Box css={{ marginY: 'xxlarge' }}>Loading Invoice details...</Box>
          ) : (
            <>
              <Box css={{ layout: 'inline-row', gapX: 'large' }}>
                <Box css={{ font: 'subheading' }}>
                  <Box>Invoice:</Box>
                  <Box>Billed To:</Box>
                  <Box css={{ marginTop: 'small' }}>Amount Paid:</Box>
                  <Box css={{ marginTop: 'small' }}>Balance:</Box>
                  <Box css={{ marginTop: 'medium' }}>Billing Details:</Box>
                  <Box css={{ marginTop: 'xxlarge' }}>Shipping Details:</Box>
                </Box>
                <Box>
                  <Box>{invoice.number}</Box>
                  <Box>
                    <Link>{invoice.customer_email}</Link>
                  </Box>
                  <Box css={{ marginTop: 'xlarge' }}>
                    {invoice.amount_paid}{' '}
                    <Badge type="positive">{invoice.status}</Badge>
                  </Box>
                  <Box css={{ marginTop: 'xlarge' }}>
                    {invoice.amount_remaining}
                  </Box>
                  <Box css={{ marginY: 'medium' }}>
                    <Inline>{invoice.customer_address?.line1}</Inline>
                    <Inline>, {invoice.customer_address?.line2}</Inline>
                    <Inline>{invoice.customer_address?.city}</Inline>
                    <Inline>, {invoice.customer_address?.state}</Inline>
                    <Inline> {invoice.customer_address?.postal_code}</Inline>
                    <Inline> {invoice.customer_address?.country}</Inline>
                  </Box>
                  <Box>
                    <Inline>{invoice.customer_shipping?.address?.line1}</Inline>
                    <Inline>
                      , {invoice.customer_shipping?.address?.line2}
                    </Inline>
                    <Inline>{invoice.customer_shipping?.address?.city}</Inline>
                    <Inline>
                      , {invoice.customer_shipping?.address?.state}
                    </Inline>
                    <Inline>
                      {invoice.customer_shipping?.address?.postal_code}
                    </Inline>
                    <Inline>
                      {invoice.customer_shipping?.address?.country}
                    </Inline>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </ContextView>
  );
};

export default Invoice;
