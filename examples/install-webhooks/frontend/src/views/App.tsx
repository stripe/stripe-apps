import { Box, ContextView, Link } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useEffect, useState } from "react";

const BACKEND_URI = "http://localhost:8080";

const App = ({ userContext, environment }: ExtensionContextValue) => {
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<{
    id: string;
    name: string;
    dateCreated: number;
  }>();
  const currentAccountId = userContext.account.id;

  useEffect(() => {
    if (loading) {
      fetch(`${BACKEND_URI}/account/${currentAccountId}`)
        .then((response) => response.json())
        .then(setAccountData)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [loading, currentAccountId]);

  return (
    <ContextView title="Create your first Stripe app">
      <Box
        css={{
          padding: "large",
          backgroundColor: "container",
          fontFamily: "monospace",
          borderRadius: "small",
        }}
      >
        {!loading &&
          (accountData
            ? `This account (${accountData.name}) installed the app on ${new Date(
                accountData.dateCreated
              ).toLocaleDateString()}`
            : "No information found for this account.")}
      </Box>
    </ContextView>
  );
};

export default App;
