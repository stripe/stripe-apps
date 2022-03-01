import { Box, ContextView, Link } from "@stripe/ui-extension-sdk/ui";
import {
  createHttpClient,
  STRIPE_API_KEY,
} from "@stripe/ui-extension-sdk/http_client";
import type { TailorExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { withApollo } from "./apollo-client";
import Stripe from "stripe";
import { useEffect } from "react";

const query = gql`
  query FetchCountryInfo($code: ID!) {
    country(code: $code) {
      name
      native
      capital
      emoji
      currency
      languages {
        code
        name
      }
    }
  }
`;

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: "2020-08-27",
});

const App = ({ userContext, environment }: TailorExtensionContextValue) => {
  const [fetchCountryData, { data, loading, error }] = useLazyQuery(query);
  useEffect(() => {
    if (environment?.objectContext.id) {
      stripe.customers
        .retrieve(environment.objectContext.id)
        .then((customer) => {
          if (!customer.deleted && customer.address?.country) {
            fetchCountryData({ variables: { code: customer.address.country } });
          }
        });
    }
  }, []);
  console.log(data)
  return (
    <ContextView title="Create your first Stripe app">
      {error && (
        <Box>There was an error fetching country data for this customer</Box>
      )}
      {!data && !loading && !error && (
        <Box>This customer does not have country data available</Box>
      )}
      {data && (
        <Box>
          This customer is in {data.country.emoji}
          {data.country.name} (a.k.a. {data.country.native}). The capital of{" "}
          {data.country.name} is {data.country.capital}. They speak{" "}
          {new Intl.ListFormat("en-US").format(
            data.country.languages.map((l) => l.name)
          )}{" "}
          and use {data.country.currency} as currency.
        </Box>
      )}
    </ContextView>
  );
};

export default withApollo(App);
