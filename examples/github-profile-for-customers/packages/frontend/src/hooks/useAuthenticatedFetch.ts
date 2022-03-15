import { useState } from 'react';

import { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import fetchStripeSignature from '@stripe/ui-extension-sdk/signature';

export const fetchWithCredentials = async (
  uri: string,
  userContext: TailorExtensionContextValue['userContext'],
  init: RequestInit = {},
) => {
  const { headers, ...options } = init;
  const headersObject = new Headers(headers);
  headersObject.append('stripe-user-id', userContext?.id ?? '');
  headersObject.append('stripe-account-id', userContext?.account.id ?? '');
  headersObject.append('stripe-signature', await fetchStripeSignature());
  return await fetch(uri, {
    ...options,
    headers: headersObject,
  });
};

export const useAuthenticatedFetch = <DataType>(
  userContext: TailorExtensionContextValue['userContext'],
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DataType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (uri: string, init: RequestInit = {}) => {
    setIsLoading(true);

    try {
      const response = await fetchWithCredentials(uri, userContext, init).then(
        res => res.json(),
      );
      setData(response);
      if (error) setError(null);
      setIsLoading(false);
    } catch (error) {
      setError(error as Error);
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, execute };
};
