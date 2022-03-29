import { FC, useState } from 'react';
import { Box, TextField, Button, Notice } from '@stripe/ui-extension-sdk/ui';
import { useDataStore } from '../datastore/Provider';

export const DataStoreForm: FC = () => {
  const [preferredUsername, setPreferredUsername] = useState('');
  const [status, setStatus] = useState<{
    type?: 'negative' | 'positive';
    message?: string;
  }>({});
  const { client } = useDataStore();
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
      {status.type ? (
        <Notice
          type={status.type}
          title={status.type === 'negative' ? "Error": 'Update succeeded'}
          description={status.message}
          onDismiss={() => setStatus({})}
        />
      ): null}
      <TextField
        type='text'
        label='preferred username'
        onChange={e => {
          setPreferredUsername(e.target.value);
        }}
      />
      <Button
        type='primary'
        onPress={async () => {
          if (!client) return;
          try {
            setStatus({});
            await client.saveSecret('preferred_username', preferredUsername);
            setStatus({
              type: 'positive',
              message: 'Please click the `Reload` button to load the data.'
            });
          } catch (e) {
            console.log(e);
            if (e instanceof Error) {
              setStatus({
                type: 'negative',
                message: e.message,
              });
            }
          }
        }}
      >Save</Button>
    </Box>
  );
}