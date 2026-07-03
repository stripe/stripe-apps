import { DetailPageTable } from "@stripe/ui-extension-sdk/ui";
import {
  DetailPage,
  PageModule,
} from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import { FieldGrid } from "@/components/FieldGrid";
import { StatCard } from "@/components/StatsCard";
import { formatDate } from "@/utils/date";
import { formatCurrency, formatPoints } from "@/utils/format";
import { useMemberDetailPage } from "./useMemberDetailPage";

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
          <PageModule title="Summary">
            <StatCard.Row>
              <StatCard
                label="Points balance"
                value={formatPoints(member.points)}
              />
              <StatCard label="Tier" value={member.tier} />
              <StatCard
                label="Lifetime spend"
                value={formatCurrency(member.lifetimeSpend, settings?.currency)}
              />
              <StatCard label="Total orders" value={totalOrders} />
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
              items={recentActivity}
            />
          </PageModule>
        </>
      }
      secondaryColumn={
        <PageModule title="Details">
          <FieldGrid>
            <FieldGrid.Field label="Email" value={member.email} />
            <FieldGrid.Field
              label="Member since"
              value={formatDate(member.joinedDate)}
            />
          </FieldGrid>
        </PageModule>
      }
    />
  );
}
