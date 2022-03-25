import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {
  Box,
  ContextView,
  Link,
  Inline,
  List,
  ListItem,
} from '@stripe/ui-extension-sdk/ui';
import { useState, useEffect } from 'react';
import { SecretStore } from '../libs/SecretStore';
  
const dbClient = new SecretStore();
const App = ({userContext}: ExtensionContextValue) => {
  const [username, setUsername] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  useEffect(() => {
    if (!userContext) return;
    dbClient.getOptions(userContext.id)
      .then(data => {
        setUsername(data.username || '');
        setCountry(data.country || '');
      });
  }, [userContext]);
  return (
    <ContextView title="Get started with Stripe Apps">
      <Box
        css={{
          padding: 'large',
          backgroundColor: 'container',
          fontFamily: 'monospace',
          borderRadius: 'small',
        }}
      >
        <Box css={{paddingTop: 'large', marginBottom: 'large'}}>
          <Inline>Hello! Here is your application settings.</Inline>
          <List aria-label="settings">
            <ListItem id={username} title={<Box>Username: {username}</Box>} />
            <ListItem id={country} title={<Box>Country: {country}</Box>} />
          </List>
        </Box>

        <Box css={{paddingBottom: 'xlarge'}}>
          <Link
            href="https://stripe.com/docs/stripe-apps/ui-toolkit/components"
            target="stripe-ui-docs"
          >
            Go to UI documentation
          </Link>
        </Box>
        <Box css={{paddingY: 'xxlarge', marginY: 'xxlarge'}} />
      </Box>
    </ContextView>
  );
};

export default App;
