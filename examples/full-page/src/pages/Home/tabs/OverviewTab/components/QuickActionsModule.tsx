import { Box, Icon, Inline, Link } from "@stripe/ui-extension-sdk/ui";
import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";

type QuickActionsModuleProps = {
  onExportMembers: () => void;
};

export function QuickActionsModule({
  onExportMembers,
}: QuickActionsModuleProps) {
  return (
    <PageModule title="Quick actions">
      <Box css={{ stack: "y", gap: "small" }}>
        <Link href="https://dashboard.stripe.com/products" target="_blank">
          Create reward
        </Link>
        <Link onPress={onExportMembers}>Export member list</Link>
        <Link href="https://stripe.com/docs" target="_blank">
          <Box css={{ stack: "x", gap: "xsmall", alignY: "center" }}>
            <Inline>Learn about loyalty programs</Inline>
            <Icon name="external" size="xsmall" />
          </Box>
        </Link>
      </Box>
    </PageModule>
  );
}
