import { useState, useEffect, createContext, useContext } from "react";
import { Button, LoadingState } from "@stripe/tailor-browser-sdk/ui";

import AuthClient from "../clients/auth";
import ZendeskClient from "../clients/zendesk";

const ZendeskContext = createContext<ZendeskClient | null>(null);

export function useZendeskContext() {
  return useContext(ZendeskContext);
}

type TokenFetchState = "init" | "success" | "not_found" | "error" | "no_config";

export const AuthWall = ({ children, account, object }) => {
  const zendeskSubdomain = "htheodore-stripe-test";
  const zendeskClientId = "tailor-zendesk-srv";

  const authClient = new AuthClient(account.id, zendeskSubdomain);
  const [zendeskClient, setZendeskClient] = useState(
    new ZendeskClient(zendeskSubdomain, zendeskClientId, account.id)
  );

  const [tokenFetchState, setTokenFetchState] =
    useState<TokenFetchState>("init");

  const redirectUri = authClient.getRedirectUri();
  const zendeskAuthHref = zendeskClient.getAuthUrl(
    redirectUri,
    object.object,
    object.id,
  );

  const fetchZendeskToken = async () => {
    try {
      const { accessToken } = await authClient.getToken();

      if (!accessToken) {
        setTokenFetchState("not_found");
        return;
      }

      setZendeskClient((client) => {
        client.setAccessToken(accessToken);
        return client;
      });

      setTokenFetchState("success");
    } catch (e) {
      setTokenFetchState("error");
    }
  };

  useEffect(() => {
    fetchZendeskToken();
  }, []);

  switch (tokenFetchState) {
    case "init":
      return <LoadingState size="medium" title="Loading..." />;
    case "success":
      return (
        <ZendeskContext.Provider value={zendeskClient}>
          {children}
        </ZendeskContext.Provider>
      );
    case "not_found":
      return (
        <Button
          color="primary"
          label="Authorize Stripe to access Zendesk"
          href={zendeskAuthHref}
        />
      );
    case "no_config":
      return <>Zendesk integration has not been set up yet.</>;
    case "error":
    default:
      return <>Something went wrong. Please try again later.</>;
  }
};

export default AuthWall;
