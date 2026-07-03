import {
  DetailPage,
  PageModule,
} from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import { FieldGrid } from "@/components/FieldGrid";
import { StatCard } from "@/components/StatsCard";
import { formatTimestamp } from "@/utils/date";
import { formatCurrency, formatPoints } from "@/utils/format";
import { useTransactionDetailPage } from "./useTransactionDetailPage";

type TransactionDetailPageProps = {
  id: string;
};

export function TransactionDetailPage({ id }: TransactionDetailPageProps) {
  const { createAppRoute } = useRoute();
  const {
    transaction,
    member,
    notFound,
    settings,
    pointsDisplay,
    typeLabel,
  } = useTransactionDetailPage(id);

  if (notFound) {
    return (
      <DetailPage
        title="Transaction not found"
        breadcrumbs={[
          {
            type: "link",
            label: "Activity",
            route: createAppRoute("home", { tabId: "activity" }),
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

  return (
    <DetailPage
      title={transaction.description}
      breadcrumbs={[
        {
          type: "link",
          label: "Activity",
          route: createAppRoute("home", { tabId: "activity" }),
        },
      ]}
      primaryColumn={
        <>
          <PageModule title="Summary">
            <StatCard.Row>
              <StatCard label="Points" value={pointsDisplay} />
              <StatCard label="Type" value={typeLabel} />
              <StatCard label="Member" value={transaction.memberName} />
              <StatCard
                label="Time"
                value={formatTimestamp(transaction.timestamp)}
              />
            </StatCard.Row>
          </PageModule>

          {transaction.orderId && (
            <PageModule title="Order">
              <FieldGrid>
                <FieldGrid.Field
                  label="Order ID"
                  value={transaction.orderId}
                />
              </FieldGrid>
            </PageModule>
          )}

          <PageModule title="Member">
            <FieldGrid>
              <FieldGrid.Field
                label="Email"
                value={transaction.memberEmail}
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
