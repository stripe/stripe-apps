import { DetailPageTable } from "@stripe/ui-extension-sdk/ui";
import {
  DetailPage,
  PageModule,
} from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import {
  useMemberDetailQuery,
  useMembersQuery,
  useSettingsQuery,
} from "@/data";
import { FieldGrid } from "@/components/FieldGrid";
import { StatCard } from "@/components/StatsCard";
import { formatDate } from "@/utils/date";
import { formatCurrency, formatPoints } from "@/utils/format";

type MemberDetailPageProps = {
  id: string;
};

export function MemberDetailPage({ id }: MemberDetailPageProps) {
  const { createAppRoute } = useRoute();
  const { data: members, isLoading: membersLoading } = useMembersQuery();
  const { data, isLoading, isError, error } = useMemberDetailQuery();
  const { data: settings } = useSettingsQuery();

  const member = members?.find((m) => m.id === id);
  const pending = isLoading || membersLoading;

  if (!pending && !member) {
    return (
      <DetailPage
        title="Member not found"
        breadcrumbs={[
          {
            type: "link",
            label: "Members",
            route: createAppRoute("home", { tabId: "members" }),
          },
        ]}
        primaryColumn={
          <PageModule title="Error">This member could not be found.</PageModule>
        }
      />
    );
  }

  if (!member) {
    return null;
  }

  const currentMember = member;
  const { activity = [], rewards = [] } = data ?? {};

  const memberTransactions = activity.filter((txn) => txn.memberId === id);
  const memberActivity = memberTransactions.slice(0, 5);
  const lifetimeRedeemed = memberTransactions
    .filter((txn) => txn.type === "redeemed")
    .reduce((sum, txn) => sum + txn.points, 0);
  const lifetimeEarned = currentMember.points + lifetimeRedeemed;
  const lowestRewardCost = Math.min(...rewards.map((r) => r.pointsCost));
  const pointsToNextReward = Math.max(
    0,
    lowestRewardCost - currentMember.points,
  );

  return (
    <DetailPage
      title={currentMember.name}
      breadcrumbs={[
        {
          type: "link",
          label: "Members",
          route: createAppRoute("home", { tabId: "members" }),
        },
      ]}
      primaryColumn={
        <>
          <PageModule title="Summary">
            <StatCard.Row>
              <StatCard
                label="Points balance"
                value={formatPoints(currentMember.points)}
              />
              <StatCard label="Tier" value={currentMember.tier} />
              <StatCard
                label="Lifetime spend"
                value={formatCurrency(
                  currentMember.lifetimeSpend,
                  settings?.currency,
                )}
              />
              <StatCard
                label="Total orders"
                value={
                  memberTransactions.filter((t) => t.type === "earned").length
                }
              />
            </StatCard.Row>
          </PageModule>

          <PageModule title="Points breakdown">
            <FieldGrid>
              <FieldGrid.Field
                label="Lifetime earned"
                value={formatPoints(lifetimeEarned)}
              />
              <FieldGrid.Field
                label="Lifetime redeemed"
                value={formatPoints(lifetimeRedeemed)}
              />
              <FieldGrid.Field
                label="Points to next reward"
                value={
                  pointsToNextReward === 0
                    ? "Eligible now"
                    : formatPoints(pointsToNextReward)
                }
              />
            </FieldGrid>
          </PageModule>

          <PageModule title="Recent activity">
            <DetailPageTable
              pending={pending}
              error={
                isError
                  ? { message: error?.message ?? "Something went wrong" }
                  : undefined
              }
              emptyMessage="No recent activity"
              columns={[
                { key: "description", label: "Description" },
                { key: "type", label: "Type" },
                { key: "points", label: "Points" },
                { key: "timestamp", label: "Date", cell: { type: "date" } },
              ]}
              items={memberActivity.map((txn) => ({
                id: txn.id,
                description: txn.description,
                type: txn.type === "earned" ? "Earned" : "Redeemed",
                points: `${txn.type === "earned" ? "+" : "-"}${formatPoints(txn.points)}`,
                timestamp: txn.timestamp,
              }))}
            />
          </PageModule>
        </>
      }
      secondaryColumn={
        <PageModule title="Details">
          <FieldGrid>
            <FieldGrid.Field label="Email" value={currentMember.email} />
            <FieldGrid.Field
              label="Member since"
              value={formatDate(currentMember.joinedDate)}
            />
          </FieldGrid>
        </PageModule>
      }
    />
  );
}
