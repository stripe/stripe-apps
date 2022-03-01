import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { TailorExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import React from "react";

const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/graphql",
  cache: new InMemoryCache(),
});

export const withApollo =
  (
    View: React.ComponentType<TailorExtensionContextValue>
  ): React.FC<TailorExtensionContextValue> =>
  (props) =>
    (
      <ApolloProvider client={client}>
        <View {...props} />
      </ApolloProvider>
    );
