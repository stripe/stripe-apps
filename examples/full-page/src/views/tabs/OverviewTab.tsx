import {
  BarChart,
  Box,
  LineChart,
  OverviewPage,
  OverviewPageModule,
  PropertyList,
  PropertyListItem,
  DataTable,
  DataTableColumn,
} from "@stripe/ui-extension-sdk/ui";

import { payments, revenueByDay, revenueByStatus } from "../../data/mockData";

const formatCurrency = (amount: number): string => {
  return `$${(amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
};

const recentPayments = payments.slice(0, 5);

const columns: DataTableColumn[] = [
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
];

const tableItems = recentPayments.map((p) => ({
  id: p.id,
  customer: p.customer,
  amount: formatCurrency(p.amount),
  status: p.status,
  date: p.date,
}));

const totalRevenue = payments
  .filter((p) => p.status === "succeeded")
  .reduce((sum, p) => sum + p.amount, 0);

const totalPayments = payments.length;
const successRate = Math.round(
  (payments.filter((p) => p.status === "succeeded").length / totalPayments) * 100
);

const OverviewTab = () => {
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
            <DataTable columns={columns} items={tableItems} />
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
              <PropertyListItem label="Total Revenue" value={formatCurrency(totalRevenue)} />
              <PropertyListItem label="Total Payments" value={String(totalPayments)} />
              <PropertyListItem label="Success Rate" value={`${successRate}%`} />
              <PropertyListItem label="Avg. Payment" value={formatCurrency(Math.round(totalRevenue / payments.filter(p => p.status === "succeeded").length))} />
            </PropertyList>
          </OverviewPageModule>
        </>
      }
    />
  );
};

export default OverviewTab;
