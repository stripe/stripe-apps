import {
  ContextView,
  Link,
  View,
} from '@stripe/ui-extension-sdk/ui';
import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';

const App = ({userContext, environment}: TailorExtensionContextValue) => {
  return (
    <ContextView title="Get started with Stripe Apps">
      <View
        css={{
          padding: 'medium',
          paddingY: '200px',
          backgroundColor: 'container',
        }}
      >
        <View css={{textAlign: 'center'}}>
          <View
            css={{
              fontFamily: 'monospace',
              marginBottom: 'large',
            }}
          >
            Edit src/views/App.tsx and save to reload this view
          </View>
          <Link
            href="https://stripe.com/docs/stripe-apps/ui-toolkit/components"
            target="_blank"
          >
            Go to UI documentation
          </Link>
        </View>
      </View>
    </ContextView>
  );
};

export default App;
