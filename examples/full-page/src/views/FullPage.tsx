import { AppRouter } from "@stripe/ui-extension-sdk/navigation";
import { ExtensionContextValue } from "@stripe/ui-extension-sdk/utils";

import { withAppProviders } from "@/providers/AppProviders";
import { routes } from "@/routes";

function FullPageView(context: ExtensionContextValue) {
  return (
    <AppRouter
      routes={routes}
      context={context}
      redirectOnNotFound={{ key: "home" }}
    />
  );
}

export default withAppProviders(FullPageView);
