import type { TailorExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { ContextView } from '@stripe/ui-extension-sdk/ui';

import { Auth } from '../components/Auth';

const App = ({ userContext, environment }: TailorExtensionContextValue) => {
  return (
    <ContextView title="Log in with GitHub using OAuth">
      <Auth />
    </ContextView>
  );
};

export default App;
