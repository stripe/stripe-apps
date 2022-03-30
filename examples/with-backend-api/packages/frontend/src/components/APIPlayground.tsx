import { Box, Button } from '@stripe/ui-extension-sdk/ui';
import { useBackendAPI } from '../provider/BackendAPI';
import { useState, FC } from 'react';
import { Layout } from './Layout';

export const APIPlayground: FC<{
  description?: string;
  api: {
    path: string;
    method: 'PUT' | 'POST' | 'DELETE';
    body?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  signature: {
    enable: boolean;
    additionalSignature?: {
      [key: string]: string;
    };
  };
}> = ({ api, description, signature }) => {
  const [apiResult, setAPIResult] = useState('');
  const { fetchBackendAPI, apiURL } = useBackendAPI();
  return (
    <Layout description={description}>
      <Box css={{ paddingBottom: 'medium' }}>
        <Button
          type='primary'
          size='large'
          onPress={async () => {
            try {
              setAPIResult('calling...');
              if (signature.enable) {
                const withSignatureRequestResult = await fetchBackendAPI(api.path, api.method, {
                  body: api.body,
                  additionalSignaturePayload: signature.additionalSignature,
                }).then((data) => data.json());
                setAPIResult(JSON.stringify(withSignatureRequestResult, null, 2));
              } else {
                const noSignatureRequestResult = await fetch(
                  `${apiURL}/${api.path.replace(/^\//, '')}`,
                  {
                    method: api.method,
                    body: api.body ? JSON.stringify(api.body) : undefined,
                  },
                ).then((data) => data.json());
                setAPIResult(JSON.stringify(noSignatureRequestResult, null, 2));
              }
            } catch (e) {
              console.log(e);
              if (e instanceof Error) {
                setAPIResult(`${e.name}: ${e.message}`);
              }
            }
          }}
        >
          Call
        </Button>
      </Box>
      {apiResult ? (
        <Box css={{ paddingTop: 'small', marginBottom: 'medium' }}>{apiResult}</Box>
      ) : null}
    </Layout>
  );
};
