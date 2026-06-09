import {
  DataTable,
  DataTableColumn,
} from "@stripe/ui-extension-sdk/ui";

import { statusLabels } from "../../data/mockData";
import type { Payment } from "../../data/mockData";

function formatCurrency(amount: number): string {
  return `$${(amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

const statusCell = {
  type: "status" as const,
  statusMap: {
    Succeeded: "positive" as const,
    Pending: "warning" as const,
    Failed: "negative" as const,
    Refunded: "neutral" as const,
  },
};

const receiptCell = { type: "link" as const };

export const fullColumns: DataTableColumn[] = [
  { key: "id", label: "ID" },
  { key: "customer", label: "Customer" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status", cell: statusCell },
  { key: "date", label: "Date" },
  { key: "receipt", label: "Receipt", cell: receiptCell },
];

export const summaryColumns: DataTableColumn[] = [
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status", cell: statusCell },
  { key: "date", label: "Date" },
  { key: "receipt", label: "Receipt", cell: receiptCell },
];

export function toTableItem(payment: Payment) {
  return {
    id: payment.id,
    customer: payment.customer,
    description: payment.description,
    amount: formatCurrency(payment.amount),
    status: statusLabels[payment.status],
    date: payment.date,
    receipt: payment.receiptUrl,
  };
}

interface PaymentsTableProps {
  payments: Payment[];
  columns: DataTableColumn[];
  paymentsById: Map<string, Payment>;
  onSelectPayment: (payment: Payment) => void;
  pagination?: {
    pageSize: number;
    totalItems: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
  rowActions?: Array<{
    id: string;
    label: string;
    type?: "destructive";
    onPress: (item: { id?: string | number }) => void;
  }>;
  emptyMessage?: string;
}

export function PaymentsTable({
  payments,
  columns,
  paymentsById,
  onSelectPayment,
  pagination,
  rowActions,
  emptyMessage,
}: PaymentsTableProps) {
  const items = payments.map(toTableItem);

  function handleRowClick(item: { id?: string | number }) {
    const payment = paymentsById.get(String(item.id));
    if (payment) {
      onSelectPayment(payment);
    }
  }

  return (
    <DataTable
      columns={columns}
      items={items}
      onRowClick={handleRowClick}
      pagination={pagination}
      rowActions={rowActions}
      emptyMessage={emptyMessage}
    />
  );
}
