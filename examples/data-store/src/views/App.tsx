import {
  Box,
  ContextView,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { DataStoreProvider } from '../datastore/Provider';
import { DataStoreForm } from '../components/DataStoreForm';
import { DataStoreView } from '../components/DataStoreView';

const App = ({userContext}: ExtensionContextValue) => {
  return (
    <DataStoreProvider userContext={userContext}>
      <ContextView
        title='[Demo] Data store'
        externalLink={{
          label: 'Document',
          href: 'https://stripe.com/docs/stripe-apps/store-auth-data-custom-objects'
        }}
      >
        <Box>
          <DataStoreForm />
          <DataStoreView />
        </Box>
      </ContextView>
    </DataStoreProvider>
  );
};

export default App;
