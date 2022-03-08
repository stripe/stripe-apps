import {
  Box,
  ContextView,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { useCustomerLoader } from '../hooks/loadCustomer';
import { SendEmailForm } from '../components/SendEmailForm';

const App = (props: ExtensionContextValue) => {
  const customerProps = useCustomerLoader(props);
  return (
    <ContextView title="Send a quick email">
      <Box
        css={{
          padding: 'large',
          backgroundColor: 'container',
          fontFamily: 'monospace',
          borderRadius: 'small',
          gap: 'large'
        }}
      >
        <SendEmailForm {...{
          ...props,
          ...customerProps,
        }} />
      </Box>
    </ContextView>
  );
};

export default App;
