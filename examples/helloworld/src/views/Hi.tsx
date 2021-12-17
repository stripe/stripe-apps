import {
  ContextView,
  Link,
  View,
} from '@stripe/tailor-browser-sdk/ui';
import type { TailorExtensionContextValue } from '@stripe/tailor-browser-sdk/context';

const Hi = ({userContext, environment}: TailorExtensionContextValue) => {
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
            Edit src/views/Hi.tsx and save to reload this view
          </View>
          <Link
            href="https://go/ui-docs"
            target="_blank"
          >
            Go to UI documentation
          </Link>
        </View>
      </View>
    </ContextView>
  );
};

export default Hi;
