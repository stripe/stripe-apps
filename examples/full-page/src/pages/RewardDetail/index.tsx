import { DetailPageTable } from "@stripe/ui-extension-sdk/ui";
import {
  DetailPage,
  PageModule,
} from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import { FieldGrid } from "@/components/FieldGrid";
import { StatCard } from "@/components/StatsCard";
import { formatCurrency, formatPoints } from "@/utils/format";
import { useRewardDetailPage } from "./useRewardDetailPage";

type RewardDetailPageProps = {
  id: string;
};

export function RewardDetailPage({ id }: RewardDetailPageProps) {
  const { createAppRoute } = useRoute();
  const {
    reward,
    pending,
    notFound,
    isError,
    error,
    settings,
    categoryLabel,
    dollarValue,
    pointsRedeemed,
    recentRedemptions,
  } = useRewardDetailPage(id);

  if (notFound) {
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

  return (
    <DetailPage
      title={reward.name}
      description={reward.description}
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
                value={formatPoints(reward.pointsCost)}
              />
              <StatCard
                label="Dollar value"
                value={formatCurrency(dollarValue, settings?.currency)}
              />
              <StatCard
                label="Redemptions"
                value={reward.redemptionCount}
              />
              <StatCard
                label="Points redeemed"
                value={formatPoints(pointsRedeemed)}
              />
            </StatCard.Row>
          </PageModule>

          <PageModule title="Details">
            <FieldGrid>
              <FieldGrid.Field label="Category" value={categoryLabel} />
              <FieldGrid.Field
                label="Status"
                value={reward.available ? "Available" : "Out of stock"}
              />
            </FieldGrid>
          </PageModule>

          {recentRedemptions.length > 0 && (
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
                items={recentRedemptions}
              />
            </PageModule>
          )}
        </>
      }
    />
  );
}
