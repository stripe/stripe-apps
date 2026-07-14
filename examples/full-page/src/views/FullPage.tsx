import { AppRouter } from "@stripe/ui-extension-sdk/navigation";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/utils";

import { withAppProviders } from "@/providers/AppProviders";

function FullPageView(context: ExtensionContextValue) {
  return <AppRouter context={context} redirectOnNotFound={{ key: "home" }} />;
}

export default withAppProviders(FullPageView);
