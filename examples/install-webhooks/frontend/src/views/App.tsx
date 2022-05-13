import {
  Box,
  ContextView,
  List,
  ListItem,
  Spinner,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useEffect, useState } from "react";

const BACKEND_URI: string = "http://localhost:8080";

const App = ({ userContext, environment }: ExtensionContextValue) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [accountData, setAccountData] = useState<
    {
      id: string;
      name: string;
      dateCreated: number;
    }[]
  >([]);
  const currentAccountId: string = userContext.account.id;

  useEffect(() => {
    if (loading) {
      fetch(`${BACKEND_URI}/accounts`)
        .then((response) => response.json())
        .then(setAccountData)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [loading, currentAccountId]);

  return (
    <ContextView title="Webhooks Example">
      {loading ? (
        <Spinner />
      ) : (
        <List>
          {accountData.map((item) => (
            <ListItem
              key={item.id}
              id={item.id}
              title={item.id}
              secondaryTitle={`Added ${new Date(
                item.dateCreated
              ).toLocaleDateString()}`}
              value={item.name}
            />
          ))}
        </List>
      )}
    </ContextView>
  );
};

export default App;
