import {
  DetailPage,
  PageModule,
} from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import { useActivityQuery, useMembersQuery, useSettingsQuery } from "@/data";
import { FieldGrid } from "@/components/FieldGrid";
import { StatCard } from "@/components/StatsCard";
import { formatTimestamp } from "@/utils/date";
import { formatCurrency, formatPoints } from "@/utils/format";

type TransactionDetailPageProps = {
  id: string;
};

export function TransactionDetailPage({ id }: TransactionDetailPageProps) {
  const { createAppRoute } = useRoute();
  const { data: activity, isLoading: activityLoading } = useActivityQuery();
  const { data: members, isLoading: membersLoading } = useMembersQuery();
  const { data: settings } = useSettingsQuery();

  const transaction = activity?.find((txn) => txn.id === id);
  const pending = activityLoading || membersLoading;

  if (!pending && !transaction) {
    return (
      <DetailPage
        title="Transaction not found"
        breadcrumbs={[
          {
            type: "link",
            label: "Activity",
            route: createAppRoute("home"),
          },
        ]}
        primaryColumn={
          <PageModule title="Error">
            This transaction could not be found.
          </PageModule>
        }
      />
    );
  }

  if (!transaction) {
    return null;
  }

  const currentTransaction = transaction;
  const member = members?.find((m) => m.id === currentTransaction.memberId);

  return (
    <DetailPage
      title={currentTransaction.description}
        breadcrumbs={[
          {
            type: "link",
            label: "Activity",
            route: createAppRoute("home"),
          },
        ]}
        primaryColumn={
          <>
            <PageModule title="Summary">
              <StatCard.Row>
                <StatCard
                  label="Points"
                  value={`${currentTransaction.type === "earned" ? "+" : "-"}${formatPoints(currentTransaction.points)}`}
                />
                <StatCard
                  label="Type"
                  value={
                    currentTransaction.type === "earned" ? "Earned" : "Redeemed"
                  }
                />
                <StatCard label="Member" value={currentTransaction.memberName} />
                <StatCard
                  label="Time"
                  value={formatTimestamp(currentTransaction.timestamp)}
                />
              </StatCard.Row>
            </PageModule>

            {currentTransaction.orderId && (
              <PageModule title="Order">
                <FieldGrid>
                  <FieldGrid.Field
                    label="Order ID"
                    value={currentTransaction.orderId}
                  />
                </FieldGrid>
              </PageModule>
            )}

            <PageModule title="Member">
              <FieldGrid>
                <FieldGrid.Field
                  label="Email"
                  value={currentTransaction.memberEmail}
                />
                {member && (
                  <FieldGrid.Field label="Tier" value={member.tier} />
                )}
                {member && (
                  <FieldGrid.Field
                    label="Current balance"
                    value={`${formatPoints(member.points)} points`}
                  />
                )}
                {member && (
                  <FieldGrid.Field
                    label="Lifetime spend"
                    value={formatCurrency(
                      member.lifetimeSpend,
                      settings?.currency,
                    )}
                  />
                )}
              </FieldGrid>
            </PageModule>
          </>
        }
    />
  );
}
