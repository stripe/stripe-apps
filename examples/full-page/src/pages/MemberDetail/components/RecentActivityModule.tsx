import { DetailPageTable } from "@stripe/ui-extension-sdk/ui";
import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import type { MemberActivityItem } from "../hooks/useMemberDetailPage";

type RecentActivityModuleProps = {
  pending: boolean;
  error?: { message: string };
  items: MemberActivityItem[];
};

export function RecentActivityModule({
  pending,
  error,
  items,
}: RecentActivityModuleProps) {
  return (
    <PageModule title="Recent activity">
      <DetailPageTable
        pending={pending}
        error={error}
        emptyMessage="No recent activity"
        columns={[
          { key: "description", label: "Description" },
          { key: "type", label: "Type" },
          { key: "points", label: "Points" },
          { key: "timestamp", label: "Date", cell: { type: "date" } },
        ]}
        items={items}
      />
    </PageModule>
  );
}
