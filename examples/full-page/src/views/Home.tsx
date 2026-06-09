import {
  Box,
  Button,
  ContextView,
  Inline,
  Link,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { navigateToDashboardRoute } from "@stripe/ui-extension-sdk/utils";

import BrandIcon from "./brand_icon.svg";

export default function Home({ userContext, environment }: ExtensionContextValue) {
  return (
    <ContextView
      title="Revenue Analytics"
      brandColor="#635BFF"
      brandIcon={BrandIcon}
      externalLink={{
        label: "View documentation",
        href: "https://docs.stripe.com/stripe-apps/patterns/full-page-apps",
      }}
    >
      <Box css={{ stack: "y", rowGap: "large" }}>
        <Box>
          <Box css={{ font: "heading" }}>Revenue Analytics Dashboard</Box>
          <Box css={{ marginTop: "small", color: "secondary" }}>
            View revenue trends, browse payment history, and configure your
            analytics preferences — all in a dedicated full-page experience.
          </Box>
        </Box>

        <Box css={{ stack: "y", rowGap: "small" }}>
          <Box>
            <Inline css={{ fontWeight: "semibold" }}>Overview</Inline> — Revenue
            charts and quick stats
          </Box>
          <Box>
            <Inline css={{ fontWeight: "semibold" }}>Payments</Inline> —
            Filterable payment list with detail navigation
          </Box>
        </Box>

        <Button
          type="primary"
          onPress={() => {
            navigateToDashboardRoute({
              name: "fullPage",
              params: { tabId: "overview" },
            });
          }}
        >
          Open dashboard
        </Button>

        <Box css={{ color: "secondary", font: "caption" }}>
          This example demonstrates{" "}
          <Link
            external
            href="https://docs.stripe.com/stripe-apps/patterns/full-page-apps"
          >
            full-page Stripe Apps
          </Link>{" "}
          using FullPageView, DataTable, charts, DateRangePicker, and
          SearchField components.
        </Box>
      </Box>
    </ContextView>
  );
};

