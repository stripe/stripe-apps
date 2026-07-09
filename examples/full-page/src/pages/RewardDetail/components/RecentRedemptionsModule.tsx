import { Box } from "@stripe/ui-extension-sdk/ui";
import {
  DataTable,
  PageModule,
} from "@stripe/ui-extension-sdk/ui/experimental";
import type { RewardRedemptionItem } from "../hooks/useRewardDetailPage";

type RecentRedemptionsModuleProps = {
  pending: boolean;
  error?: { message: string };
  items: RewardRedemptionItem[];
};

export function RecentRedemptionsModule({
  pending,
  error,
  items,
}: RecentRedemptionsModuleProps) {
  return (
    <PageModule title="Recent redemptions">
      {error ? (
        <Box css={{ font: "caption", color: "critical" }}>{error.message}</Box>
      ) : (
        <DataTable
          loading={pending}
          emptyMessage="No recent redemptions"
          columns={[
            { key: "memberName", label: "Member" },
            { key: "points", label: "Points" },
            { key: "timestamp", label: "Date", cell: { type: "date" } },
          ]}
          items={items}
        />
      )}
    </PageModule>
  );
}
