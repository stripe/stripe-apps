import { DetailPageTable } from "@stripe/ui-extension-sdk/ui";
import {
  DetailPage,
  PageModule,
} from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import {
  pointsToDollars,
  useActivityQuery,
  useRewardsQuery,
  useSettingsQuery,
} from "@/data";
import { FieldGrid } from "@/components/FieldGrid";
import { StatCard } from "@/components/StatsCard";
import { formatCurrency, formatPoints } from "@/utils/format";

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "coffee":
      return "Coffee";
    case "merchandise":
      return "Merchandise";
    default:
      return category;
  }
};

type RewardDetailPageProps = {
  id: string;
};

export function RewardDetailPage({ id }: RewardDetailPageProps) {
  const { createAppRoute } = useRoute();
  const { data: rewards, isLoading: rewardsLoading } = useRewardsQuery();
  const { data: activity, isLoading, isError, error } = useActivityQuery();
  const { data: settings } = useSettingsQuery();

  const reward = rewards?.find((r) => r.id === id);
  const pending = isLoading || rewardsLoading;

  if (!pending && !reward) {
    return (
      <DetailPage
        title="Reward not found"
        breadcrumbs={[
          {
            type: "link",
            label: "Rewards",
            route: createAppRoute("home", { tabId: "rewards" }),
          },
        ]}
        primaryColumn={
          <PageModule title="Error">
            This reward could not be found.
          </PageModule>
        }
      />
    );
  }

  if (!reward) {
    return null;
  }

  const currentReward = reward;
  const rewardActivity = (activity ?? [])
    .filter(
      (txn) =>
        txn.type === "redeemed" && txn.description === currentReward.name,
    )
    .slice(0, 5);

  return (
    <DetailPage
      title={currentReward.name}
        description={currentReward.description}
        breadcrumbs={[
          {
            type: "link",
            label: "Rewards",
            route: createAppRoute("home", { tabId: "rewards" }),
          },
        ]}
        primaryColumn={
          <>
            <PageModule title="Summary">
              <StatCard.Row>
                <StatCard
                  label="Points cost"
                  value={formatPoints(currentReward.pointsCost)}
                />
                <StatCard
                  label="Dollar value"
                  value={formatCurrency(
                    pointsToDollars(
                      currentReward.pointsCost,
                      settings?.pointsPerDollar,
                    ),
                    settings?.currency,
                  )}
                />
                <StatCard
                  label="Redemptions"
                  value={currentReward.redemptionCount}
                />
                <StatCard
                  label="Points redeemed"
                  value={formatPoints(
                    currentReward.pointsCost * currentReward.redemptionCount,
                  )}
                />
              </StatCard.Row>
            </PageModule>

            <PageModule title="Details">
              <FieldGrid>
                <FieldGrid.Field
                  label="Category"
                  value={getCategoryLabel(currentReward.category)}
                />
                <FieldGrid.Field
                  label="Status"
                  value={currentReward.available ? "Available" : "Out of stock"}
                />
              </FieldGrid>
            </PageModule>

            {rewardActivity.length > 0 && (
              <PageModule title="Recent redemptions">
                <DetailPageTable
                  pending={pending}
                  error={
                    isError
                      ? { message: error?.message ?? "Something went wrong" }
                      : undefined
                  }
                  columns={[
                    { key: "memberName", label: "Member" },
                    { key: "points", label: "Points" },
                    { key: "timestamp", label: "Date", cell: { type: "date" } },
                  ]}
                  items={rewardActivity.map((txn) => ({
                    id: txn.id,
                    memberName: txn.memberName,
                    points: `-${formatPoints(txn.points)}`,
                    timestamp: txn.timestamp,
                  }))}
                />
              </PageModule>
            )}
          </>
        }
    />
  );
}
