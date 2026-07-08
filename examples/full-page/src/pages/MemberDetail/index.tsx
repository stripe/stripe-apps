import {
  DetailPage,
  PageModule,
} from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import { DetailsModule } from "./components/DetailsModule";
import { PointsBreakdownModule } from "./components/PointsBreakdownModule";
import { RecentActivityModule } from "./components/RecentActivityModule";
import { SummaryModule } from "./components/SummaryModule";
import { useMemberDetailPage } from "./hooks/useMemberDetailPage";

type MemberDetailPageProps = {
  id: string;
};

export function MemberDetailPage({ id }: MemberDetailPageProps) {
  const { createAppRoute } = useRoute();
  const {
    member,
    pending,
    notFound,
    isError,
    error,
    settings,
    lifetimeEarned,
    lifetimeRedeemed,
    pointsToNextReward,
    totalOrders,
    recentActivity,
  } = useMemberDetailPage(id);

  if (notFound) {
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

  return (
    <DetailPage
      title={member.name}
      breadcrumbs={[
        {
          type: "link",
          label: "Members",
          route: createAppRoute("home", { tabId: "members" }),
        },
      ]}
      primaryColumn={
        <>
          <SummaryModule
            member={member}
            totalOrders={totalOrders}
            currency={settings?.currency}
          />
          <PointsBreakdownModule
            lifetimeEarned={lifetimeEarned}
            lifetimeRedeemed={lifetimeRedeemed}
            pointsToNextReward={pointsToNextReward}
          />
          <RecentActivityModule
            pending={pending}
            error={
              isError
                ? { message: error?.message ?? "Something went wrong" }
                : undefined
            }
            items={recentActivity}
          />
        </>
      }
      secondaryColumn={<DetailsModule member={member} />}
    />
  );
}
