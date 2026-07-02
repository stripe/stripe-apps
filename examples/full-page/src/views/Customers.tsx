import { Box, ContextView, Divider, Link } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { BRAND_COLOR } from "@/constants";
import { withAppProviders } from "@/providers/AppProviders";

/**
 * This is a view that is rendered in the Stripe dashboard's customer list page.
 * In stripe-app.json, this view is configured with stripe.dashboard.customer.list viewport.
 * You can add a new view by running "stripe apps add view" from the CLI.
 */
function CustomersView(_props: ExtensionContextValue) {
  return (
    <ContextView
      title="Pizzazz Loyalty"
      brandColor={BRAND_COLOR}
      externalLink={{
        label: "Watch the demo",
        href: "https://stripe.com/docs/stripe-apps",
      }}
      footerContent={
        <Box css={{ marginBottom: "medium" }}>
          Questions? Get help with your app from the{" "}
          <Link
            external
            href="https://stripe.com/docs/stripe-apps"
            target="_blank"
            type="secondary"
          >
            Stripe Apps docs
          </Link>
          ,
          <Link
            external
            href="https://support.stripe.com/"
            target="_blank"
            type="secondary"
          >
            Stripe Support
          </Link>
          , or the{" "}
          <Link
            external
            href="https://discord.com/invite/stripe"
            target="_blank"
            type="secondary"
          >
            Stripe Developers Discord
          </Link>
          .
        </Box>
      }
    >
      <Box css={{ stack: "y", rowGap: "large" }}>
        <Box>
          Click on a customer to view their loyalty program details and manage
          their rewards.
        </Box>
        <Divider />
        <Box css={{ color: "info" }}>
          Select a customer to see their loyalty points, transaction history,
          and reward status.
        </Box>
      </Box>
    </ContextView>
  );
}

export default withAppProviders(CustomersView);
