import {
  ContextView,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import ClimateLinkComponent from '../components/ClimateLinkComponent';

const ClimateSampleApp = ({userContext, environment}: ExtensionContextValue) => {
  return (
    <ContextView title="Link to Stripe Climate in your app">
      <ClimateLinkComponent appId="com.example.climate" />
    </ContextView>
  );
};

export default ClimateSampleApp;
