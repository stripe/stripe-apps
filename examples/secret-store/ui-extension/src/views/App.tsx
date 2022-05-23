import { useState } from 'react';
import Stripe from 'stripe';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {
  Box,
  Button,
  ContextView,
  Inline,
  Accordion,
  AccordionItem,
  TextField
} from '@stripe/ui-extension-sdk/ui';
import {createHttpClient, STRIPE_API_KEY} from '@stripe/ui-extension-sdk/http_client';

const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient() as Stripe.HttpClient,
  apiVersion: '2020-08-27',
});

const App = ({userContext}: ExtensionContextValue) => {
  
  const [logs, setLogs] = useState<Array<string>>([]);

  // Set secret form
  const [secretNameForSetSecret, setSecretNameForSetSecret] = useState('');
  const [secretValueForSetSecret, setSecretValueForSetSecret] = useState('');

  // Get secret form
  const [secretNameForGetSecret, setSecretNameForGetSecret] = useState('');

  // Delete secret form
  const [secretNameForDeleteSecret, setSecretNameForDeleteSecret] = useState('');

  const appendToLogs = (text: string) => {
    setLogs((currentLogs) => {
      return [text, ...currentLogs];
    });
  }

  const clearLogs = () => {
    setLogs([]);
  }

  const setSecretButtonPressed = async () =>  {
    try {
      const secret = await stripe.apps.secrets.create(
        {
          scope: { type: "user", user: userContext.id },
          name: secretNameForSetSecret,
          payload: secretValueForSetSecret
        }
      );
      appendToLogs('Created secret ' + secret.name);
    } catch(e) {
      console.error(e);
      appendToLogs('ERROR: ' + (e as Error).message);
    }
  }

  const getSecretButtonPressed = async () => {
    try {
      const secret = await stripe.apps.secrets.find(
        {
          scope: { type: "user", user: userContext.id },
          name: secretNameForGetSecret,
          expand: ['payload']
        }
      );
      appendToLogs("Secret '" + secret.name + "' has value: '" + secret.payload + "'");
    } catch(e) {
      console.error(e);
      appendToLogs('ERROR: ' + (e as Error).message);
    }
  }

  const deleteSecretButtonPressed = async () => {
    try {
      const secret = await stripe.apps.secrets.deleteWhere(
        {
          scope: { type: "user", user: userContext.id },
          name: secretNameForDeleteSecret
        }
      );
      appendToLogs("Secret '" + secret.name + "' has been deleted");
    } catch(e) {
      console.error(e);
      appendToLogs('ERROR: ' + (e as Error).message);
    }
  }

  const listSecretButtonPressed = async () => {
    try {
      const secrets = await stripe.apps.secrets.list(
        {
          scope: { type: "user", user: userContext.id }
        }
      );

      appendToLogs(secrets.data.length + " secret(s) found");
      for (var i = 0; i < secrets.data.length; i++) {
        appendToLogs("Secret " + (i + 1) + " name: '" + secrets.data[i].name + "'");
      }
    } catch(e) {
      console.error(e);
      appendToLogs('ERROR: ' + (e as Error).message);
    }
  }

  const logsMarkup = () => {
    return logs.map((logLine) => {
      return <Box>{logLine}</Box>;
    });
  }
  
  return (
    <ContextView title='Secret Store'>
      <Box css={{margin: 'medium'}}>
        This example app sets, gets, and deletes secrets attached to the currently authenticated user.
      </Box>
      <Accordion>
        <AccordionItem title='Set a secret'>
          <Box css={{margin: 'medium', layout: 'column', gap: 'medium'}}>
            <TextField label='Secret Name' placeholder='OAuth token' onChange={(e) => {
              setSecretNameForSetSecret(e.target.value);
            }}></TextField>
            <TextField label='Secret Value' placeholder='secret_abcxyz' onChange={(e) => {
              setSecretValueForSetSecret(e.target.value);
            }}></TextField>
            <Button type='primary' onPress={setSecretButtonPressed}>Create</Button>
          </Box>
        </AccordionItem>
        <AccordionItem title='Get a secret'>
          <Box css={{margin: 'medium', layout: 'column', gap: 'medium'}}>
            <TextField label='Secret Name' placeholder='OAuth token' onChange={(e) => {
              setSecretNameForGetSecret(e.target.value);
            }}></TextField>
            <Button type='primary' onPress={getSecretButtonPressed}>Fetch</Button>
          </Box>
        </AccordionItem>
        <AccordionItem title='Delete a secret'>
          <Box css={{margin: 'medium', layout: 'column', gap: 'medium'}}>
            <TextField label='Secret Name' placeholder='OAuth token' onChange={(e) => {
              setSecretNameForDeleteSecret(e.target.value);
            }}></TextField>
            <Button type='primary' onPress={deleteSecretButtonPressed}>Delete</Button>
          </Box>
        </AccordionItem>
        <AccordionItem title='List secrets'>
          <Box css={{margin: 'medium', layout: 'column', gap: 'medium'}}>
            <Button type='primary' onPress={listSecretButtonPressed}>Fetch</Button>
          </Box>
        </AccordionItem>
      </Accordion>
      <Box css={{marginTop: 'large'}}>
        <Box css={{stack: 'x', distribute: 'space-between'}}>
          <Inline css={{font: 'heading'}}>Logs</Inline> <Button onPress={clearLogs}>Clear logs</Button>
        </Box>
        <Box css={{layout: 'column', gap: 'medium', borderRadius: 'small', padding: 'small', marginTop: 'medium', keyline: 'neutral'}}>
          {logsMarkup()}
        </Box>
      </Box>
    </ContextView>
  );
};

export default App;