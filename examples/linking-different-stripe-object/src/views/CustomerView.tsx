import Stripe from "stripe";
import { Box, ContextView, Icon, Link } from "@stripe/ui-extension-sdk/ui";
import {
  createHttpClient,
  STRIPE_API_KEY,
} from "@stripe/ui-extension-sdk/http_client";

const stripeClient = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: "2020-08-27",
});

import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useCallback, useEffect, useState } from "react";

const CustomerView = ({ userContext, environment }: ExtensionContextValue) => {
  const [customer, setCustomer] = useState<Stripe.Customer>();

  const BASE_URL =
    environment.mode == "test"
      ? `https://dashboard.stripe.com/${environment.mode}`
      : `https://dashboard.stripe.com`;

  const getCustomerData = useCallback(async (customerId: string) => {
    const data = await stripeClient.customers.retrieve(customerId);
    setCustomer(data);
  }, []);

  useEffect(() => {
    if (environment.objectContext?.id) {
      getCustomerData(environment.objectContext?.id);
    }
  }, [getCustomerData]);

  return (
    <ContextView title="Customer Details">
      <Box
        css={{
          padding: "large",
          backgroundColor: "container",
          fontFamily: "monospace",
          borderRadius: "small",
        }}
      >
        <Box css={{ marginBottom: "medium" }}>
          <Link href={`${BASE_URL}/dashboard`}>
            <Icon name="arrowLeft"></Icon>
          </Link>
        </Box>
        <Box
          css={{
            background: "surface",
            marginLeft: "medium",
          }}
        >
          <Box>
            <Box>{customer?.name}</Box>
            <Link href={`mailto:${customer?.email}`} type="secondary">{customer?.email}</Link>
          </Box>
          <Box></Box>
        </Box>
      </Box>
    </ContextView>
  );
};

export default CustomerView;
