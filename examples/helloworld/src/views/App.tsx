import {
  Box,
  ContextView,
  Link,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

const App = ({userContext, environment}: ExtensionContextValue) => {
  return (
    <ContextView title="Create your first Stripe app">
      <Box
        css={{
          padding: 'large',
          backgroundColor: 'container',
          fontFamily: 'monospace',
          borderRadius: 'small',
        }}
      >
        <Box css={{paddingY: 'xxlarge', marginY: 'xxlarge'}} />
        <Box css={{paddingTop: 'large', marginBottom: 'large'}}>
          Edit src/views/App.tsx and save to reload this view
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
