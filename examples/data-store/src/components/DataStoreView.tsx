import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Inline, Button, Notice } from '@stripe/ui-extension-sdk/ui';
import { useDataStore } from '../datastore/Provider';

export const DataStoreView: FC = () => {
  const { client } = useDataStore();
  const [preferredUsername, setPreferredUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const loadStoredData = useCallback(async () => {
    if (!client) return;
    try {
      const data = await client.getSecret('preferred_username');
      if (!data) return null;
      setPreferredUsername(data);
    } catch (e) {
      console.log(e)
      if (e instanceof Error) {
        setErrorMessage(e);
      }
    }
  }, [client, setErrorMessage, setPreferredUsername]);
  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);
  if (!client) return null;
  return (
    <Box
      css={{
        fontFamily: 'monospace',
        padding: 'large',
        marginY: 'medium',
        backgroundColor: 'container',
        borderRadius: 'small',
        layout: 'column',
        gap: 'small',
      }}
    >
      {errorMessage ? (
        <Notice
          type='negative'
          title={errorMessage.name}
          description={errorMessage.message}
          onDismiss={() => setErrorMessage(null)}
        />
      ): null}
      <Box>
        <Inline>Your preferred username is </Inline>
        <Inline css={{fontWeight: 'bold'}}>{preferredUsername}</Inline>
      </Box>
      <Button
        type='primary'
        onPress={async () => loadStoredData()}
      >Reload</Button>
    </Box>
  );
};