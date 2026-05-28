import {
  FullPageView,
  FullPageTabs,
  FullPageTab,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

import OverviewTab from "./tabs/OverviewTab";
import PaymentsTab from "./tabs/PaymentsTab";

const FullPageApp = ({ userContext, environment }: ExtensionContextValue) => {
  return (
    <FullPageView
      pageAction={{
        label: "Export Report",
        onPress: () => {},
      }}
    >
      <FullPageTabs>
        <FullPageTab
          id="overview"
          label="Overview"
          content={<OverviewTab />}
        />
        <FullPageTab
          id="payments"
          label="Payments"
          content={<PaymentsTab />}
        />
      </FullPageTabs>
    </FullPageView>
  );
};

export default FullPageApp;
