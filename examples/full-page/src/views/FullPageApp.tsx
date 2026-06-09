import {
  FullPageView,
  FullPageTabs,
  FullPageTab,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

import { usePayments } from "../hooks/usePayments";
import { OverviewTab } from "./tabs/OverviewTab";
import { PaymentsTab } from "./tabs/PaymentsTab";
import { PaymentDetail } from "./tabs/PaymentDetail";
import { PaymentForm } from "./tabs/PaymentForm";

export default function FullPageApp({ userContext, environment }: ExtensionContextValue) {
  const {
    payments,
    paymentsById,
    customerFilterOptions,
    selectedPayment,
    showForm,
    editingPayment,
    selectPayment,
    createPayment,
    editPayment,
    refundPayment,
    refundPaymentById,
    openCreateForm,
    openEditForm,
    closeForm,
  } = usePayments();

  if (selectedPayment) {
    return (
      <>
        <FullPageView>
          <PaymentDetail
            payment={selectedPayment}
            onBack={function () { selectPayment(null); }}
            onEdit={openEditForm}
            onRefund={refundPayment}
          />
        </FullPageView>
        <PaymentForm
          shown={showForm}
          onClose={closeForm}
          payment={editingPayment}
          onSave={editPayment}
        />
      </>
    );
  }

  return (
    <>
      <FullPageView
        pageAction={{
          label: "Create payment",
          onPress: openCreateForm,
        }}
      >
        <FullPageTabs>
          <FullPageTab
            id="overview"
            label="Overview"
            content={
              <OverviewTab
                payments={payments}
                paymentsById={paymentsById}
                onSelectPayment={selectPayment}
              />
            }
          />
          <FullPageTab
            id="payments"
            label="Payments"
            content={
              <PaymentsTab
                payments={payments}
                paymentsById={paymentsById}
                customerFilterOptions={customerFilterOptions}
                onSelectPayment={selectPayment}
                onRefundPayment={refundPaymentById}
              />
            }
          />
        </FullPageTabs>
      </FullPageView>
      <PaymentForm
        shown={showForm}
        onClose={closeForm}
        payment={editingPayment}
        onSave={createPayment}
      />
    </>
  );
}
