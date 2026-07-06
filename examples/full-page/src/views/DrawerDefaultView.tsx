import {
  Box,
  ContextView,
  Divider,
  Link,
  Button,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { BRAND_COLOR } from "@/constants";
import { withAppProviders } from "@/providers/AppProviders";

function DrawerDefaultViewContent(_props: ExtensionContextValue) {
  return (
    <ContextView
      title="Pizzazz Loyalty"
      brandColor={BRAND_COLOR}
      externalLink={{
        label: "Watch the demo",
        href: "https://stripe.com/docs/stripe-apps",
      }}
    >
      <Box css={{ stack: "y", rowGap: "large" }}>
        <Box>
          <Box css={{ font: "heading", marginBottom: "small" }}>
            Get started
          </Box>
          <Box css={{ marginBottom: "small", stack: "y", gap: "medium" }}>
            Ready to grow your business without breaking the bank?
            <Box css={{ fontWeight: "bold" }}>
              A customer loyalty program is your key.
            </Box>
          </Box>
          <Box
            css={{
              stack: "y",
              paddingLeft: "medium",
              margin: 0,
              gap: "medium",
            }}
          >
            <Box>
              <Box css={{ color: "brand", fontWeight: "bold" }}>
                Boost Retention:
              </Box>
              It is 5x cheaper to keep a customer than to find a new one.
            </Box>
            <Box>
              <Box css={{ color: "brand", fontWeight: "bold" }}>
                Increase Spending:
              </Box>
              Loyal customers buy more, more often.
            </Box>
            <Box>
              <Box css={{ color: "brand", fontWeight: "bold" }}>
                Create Advocates:
              </Box>
              Turn happy buyers into your best word-of-mouth marketers.
            </Box>
          </Box>
        </Box>
        <Box>
          <Button
            type="primary"
            href={{
              name: "fullPage",
            }}
          >
            Start rewarding
          </Button>
        </Box>
        <Divider />
        <Box css={{ font: "caption", color: "secondary" }}>
          Manage your program from the full-page view, or click on any customer
          to see their loyalty details.
        </Box>
      </Box>
    </ContextView>
  );
}

export default withAppProviders(DrawerDefaultViewContent);
