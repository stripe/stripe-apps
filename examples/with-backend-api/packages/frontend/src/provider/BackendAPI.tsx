import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { createContext, FC, useContext, useMemo } from 'react';
import fetchStripeSignature from '@stripe/ui-extension-sdk/signature';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FetchBackendAPI = <Body = any>(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  options?: {
    body?: Body;
    additionalSignaturePayload?: {
      [key: string]: string;
    };
  },
) => Promise<Response>;
const BackendAPIContext = createContext<{
  apiURL: string;
  fetchBackendAPI: FetchBackendAPI;
}>({} as any);
/* eslint-enable @typescript-eslint/no-explicit-any */

export const useBackendAPI = () => useContext(BackendAPIContext);
export const BackendAPIProvider: FC<
  Pick<ExtensionContextValue, 'userContext'> & {
    apiURL: string;
  }
> = ({ children, apiURL, userContext }) => {
  const userId = userContext?.id;
  const accountId = userContext?.account.id;
  const fetchBackendAPI = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function <Body = any>(
      path: string,
      method: 'POST' | 'PUT' | 'DELETE',
      options?: {
        body?: Body;
        additionalSignaturePayload?: {
          [key: string]: string;
        };
      },
    ): Promise<Response> {
      const signaturePayload = {
        user_id: userId,
        account_id: accountId,
      };
      const api = `${apiURL}/${path.replace(/^\//, '')}`;
      const signature = await fetchStripeSignature(options?.additionalSignaturePayload);
      const result = await fetch(api, {
        method,
        headers: {
          'Stripe-Signature': signature,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...options?.body,
          ...options?.additionalSignaturePayload,
          ...signaturePayload,
        }),
      });
      return result;
    };
  }, [userId, accountId]);
  return (
    <BackendAPIContext.Provider
      value={{
        apiURL,
        fetchBackendAPI,
      }}
    >
      {children}
    </BackendAPIContext.Provider>
  );
};
