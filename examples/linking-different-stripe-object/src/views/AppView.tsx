import Stripe from "stripe";
import {
  Box,
  ContextView,
  Link,
  List,
  ListItem,
} from "@stripe/ui-extension-sdk/ui";
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

const App = ({ userContext, environment }: ExtensionContextValue) => {
  const BASE_URL =
    environment.mode == "test"
      ? `https://dashboard.stripe.com/${environment.mode}`
      : `https://dashboard.stripe.com`;
  const [customers, setCustomers] = useState<Stripe.Customer[]>();

  const getCustomers = useCallback(async () => {
    const data = await stripeClient.customers.list();
    setCustomers(data.data);
  }, []);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return (
    <ContextView title="Linking to different stripe objects">
      <Box
        css={{
          padding: "large",
          backgroundColor: "container",
          fontFamily: "monospace",
          borderRadius: "small",
        }}
      >
        <List>
          {customers &&
            customers.map((customer) => (
              <ListItem
                value={
                  <Link href={`${BASE_URL}/customers/${customer.id}`}>
                    view
                  </Link>
                }
                id={customer.id}
                title={<Box>{customer.name}</Box>}
                secondaryTitle={<Box>{customer.email}</Box>}
              />
            ))}
        </List>
      </Box>
    </ContextView>
  );
};

export default App;
