import { DetailPage, PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import { MemberDetailsModule } from "./components/MemberDetailsModule";
import { OrderModule } from "./components/OrderModule";
import { SummaryModule } from "./components/SummaryModule";
import { useTransactionDetailPage } from "./hooks/useTransactionDetailPage";

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
          <SummaryModule
            transaction={transaction}
            pointsDisplay={pointsDisplay}
            typeLabel={typeLabel}
          />
          {transaction.orderId && (
            <OrderModule orderId={transaction.orderId} />
          )}
          <MemberDetailsModule
            transaction={transaction}
            member={member}
            currency={settings?.currency}
          />
        </>
      }
    />
  );
}
