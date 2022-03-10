import { useCallback } from 'react';

import fetchStripeSignature from '@stripe/ui-extension-sdk/signature';

import { UserContext } from '../types';

export default function useFetchWithCredentials(
  userContext: UserContext | undefined,
): (uri: string, { headers, ...options }?: RequestInit) => Promise<Response> {
  const fetchWithCredentials = useCallback(
    async (uri: string, { headers, ...options }: RequestInit = {}) => {
      const headersObject = new Headers(headers);
      headersObject.append('stripe-user-id', userContext?.id ?? '');
      headersObject.append('stripe-account-id', userContext?.account.id ?? '');
      headersObject.append('stripe-signature', await fetchStripeSignature());

      return await fetch(uri, {
        ...options,
        headers: headersObject,
      });
    },
    [],
  );

  return fetchWithCredentials;
}
