import { useMemo } from "react";

import {
  BarChart,
  Box,
  Inline,
  LineChart,
  OverviewPage,
  OverviewPageModule,
  PropertyList,
  PropertyListItem,
  Sparkline,
} from "@stripe/ui-extension-sdk/ui";

import { revenueByDay, dailyRevenue, dailyPaymentCount, statusLabels } from "../../data/mockData";
import type { Payment } from "../../data/mockData";
import { PaymentsTable, summaryColumns } from "./PaymentsTable";

function formatCurrency(amount: number): string {
  return `$${(amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

interface OverviewTabProps {
  payments: Payment[];
  paymentsById: Map<string, Payment>;
  onSelectPayment: (payment: Payment) => void;
}

export function OverviewTab({
  payments,
  paymentsById,
  onSelectPayment,
}: OverviewTabProps) {
  const recentPayments = payments.slice(0, 5);

  const succeededPayments = payments.filter(function (payment) {
    return payment.status === "succeeded";
  });
  const totalRevenue = succeededPayments.reduce(function (sum, payment) {
    return sum + payment.amount;
  }, 0);
  const totalPayments = payments.length;
  const successRate =
    totalPayments > 0
      ? Math.round((succeededPayments.length / totalPayments) * 100)
      : 0;

  const revenueByStatus = useMemo(
    function () {
      const grouped: Record<string, number> = {};

      for (const payment of payments) {
        const label = statusLabels[payment.status];
        grouped[label] = (grouped[label] || 0) + payment.amount;
      }

      return Object.entries(grouped).map(function ([status, amount]) {
        return { status, amount };
      });
    },
    [payments],
  );

  return (
    <OverviewPage
      primaryColumn={
        <>
          <OverviewPageModule title="Revenue Trend" subtitle="Last 10 days">
            <LineChart
              data={revenueByDay}
              x={{ value: "date", label: "Date" }}
              y={{ value: "amount", label: "Revenue (cents)" }}
            />
          </OverviewPageModule>

          <OverviewPageModule title="Recent Payments">
            <PaymentsTable
              payments={recentPayments}
              columns={summaryColumns}
              paymentsById={paymentsById}
              onSelectPayment={onSelectPayment}
            />
          </OverviewPageModule>
        </>
      }
      secondaryColumn={
        <>
          <OverviewPageModule title="Revenue by Status">
            <BarChart
              data={revenueByStatus}
              x={{ value: "status", label: "Status" }}
              y={{ value: "amount", label: "Amount (cents)" }}
            />
          </OverviewPageModule>

          <OverviewPageModule title="Quick Stats">
            <PropertyList>
              <PropertyListItem
                label="Total Revenue"
                value={formatCurrency(totalRevenue)}
              />
              <PropertyListItem
                label="Total Payments"
                value={String(totalPayments)}
              />
              <PropertyListItem
                label="Success Rate"
                value={`${successRate}%`}
              />
              <PropertyListItem
                label="Avg. Payment"
                value={
                  succeededPayments.length > 0
                    ? formatCurrency(
                        Math.round(totalRevenue / succeededPayments.length),
                      )
                    : "$0.00"
                }
              />
            </PropertyList>
          </OverviewPageModule>

          <OverviewPageModule title="Revenue Sparkline" subtitle="10-day trend">
            <Box css={{ stack: "y", rowGap: "medium" }}>
              <Box css={{ stack: "y", rowGap: "xsmall" }}>
                <Inline css={{ font: "caption", color: "secondary" }}>Daily revenue</Inline>
                <Sparkline
                  data={dailyRevenue}
                  x="date"
                  y="amount"
                  tooltip
                />
              </Box>
              <Box css={{ stack: "y", rowGap: "xsmall" }}>
                <Inline css={{ font: "caption", color: "secondary" }}>Payment volume</Inline>
                <Sparkline
                  data={dailyPaymentCount}
                  x="date"
                  y="count"
                  tooltip
                />
              </Box>
            </Box>
          </OverviewPageModule>
        </>
      }
    />
  );
}
