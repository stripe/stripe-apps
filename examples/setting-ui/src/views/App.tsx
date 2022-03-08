import {
  Box,
  ContextView,
  Link,
  Inline,
  List,
  ListItem,
} from '@stripe/ui-extension-sdk/ui';
import { useState, useEffect } from 'react';
import { DummyDB } from '../libs/dummyDB';

const dbClient = new DummyDB();
const App = () => {
  const [username, setUsername] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  useEffect(() => {
    dbClient.getOptions()
      .then(data => {
        setUsername(data.username);
        setCountry(data.country);
      });
  }, []);
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
