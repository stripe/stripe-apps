import { DetailPage, PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import { DetailsModule } from "./components/DetailsModule";
import { RecentRedemptionsModule } from "./components/RecentRedemptionsModule";
import { SummaryModule } from "./components/SummaryModule";
import { useRewardDetailPage } from "./hooks/useRewardDetailPage";

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
          <SummaryModule
            reward={reward}
            dollarValue={dollarValue}
            pointsRedeemed={pointsRedeemed}
            currency={settings?.currency}
          />
          <DetailsModule reward={reward} categoryLabel={categoryLabel} />
          {recentRedemptions.length > 0 && (
            <RecentRedemptionsModule
              pending={pending}
              error={
                isError
                  ? { message: error?.message ?? "Something went wrong" }
                  : undefined
              }
              items={recentRedemptions}
            />
          )}
        </>
      }
    />
  );
}
