import { ContextView } from '@stripe/ui-extension-sdk/ui';
import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { BackendAPIProvider } from '../provider/BackendAPI';
import { APIPlayground } from '../components/APIPlayground';

export default function Index(props: ExtensionContextValue) {
  return (
    <BackendAPIProvider userContext={props.userContext} apiURL='http://localhost:8080'>
      <ContextView title='Create your first Stripe app'>
        <APIPlayground
          description='Call the secret backend API'
          api={{
            path: '/secret/do_secret_stuff',
            method: 'POST',
          }}
          signature={{
            enable: true,
          }}
        />
        <APIPlayground
          description='Call the secret backend API (with additional signature props)'
          api={{
            path: '/more_secret/do_secret_stuff',
            method: 'POST',
          }}
          signature={{
            enable: true,
            additionalSignature: {
              viewportID: props.environment?.viewportID || 'view',
            },
          }}
        />
        <APIPlayground
          description='Call the secret backend API(no signature)'
          api={{
            path: '/secret/do_secret_stuff',
            method: 'POST',
          }}
          signature={{
            enable: false,
          }}
        />
        <APIPlayground
          description='Create a new stripe customer data'
          api={{
            path: '/secret/customers/create',
            method: 'POST',
          }}
          signature={{
            enable: true,
          }}
        />
      </ContextView>
    </BackendAPIProvider>
  );
}
