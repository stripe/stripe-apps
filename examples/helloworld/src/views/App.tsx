import {
  ContextView,
  Link,
  Box,
} from '@stripe/ui-extension-sdk/ui';
import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';

const App = ({userContext, environment}: TailorExtensionContextValue) => {
  return (
    <ContextView title="Get started with Stripe Apps">
      <Box
        css={{
          padding: 'medium',
          paddingY: 200,
          backgroundColor: 'container',
        }}
      >
        <Box>
          <Box
            css={{
              fontFamily: 'monospace',
              marginBottom: 'large',
            }}
          >
            Edit src/views/App.tsx and save to reload this view
          </Box>
          <Link
            href="https://stripe.com/docs/stripe-apps/ui-toolkit/components"
            target="_blank"
          >
            Go to UI documentation
          </Link>
        </Box>
      </Box>
    </ContextView>
  );
};

export default App;
