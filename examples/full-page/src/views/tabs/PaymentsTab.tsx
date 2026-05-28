import { useState, useCallback, useMemo } from "react";

import {
  Box,
  DataTable,
  DataTableColumn,
  DateRangePicker,
  SearchField,
} from "@stripe/ui-extension-sdk/ui";

import { payments, customers } from "../../data/mockData";
import type { Payment } from "../../data/mockData";

const formatCurrency = (amount: number): string => {
  return `$${(amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
};

const PAGE_SIZE = 8;

const defaultColumns: DataTableColumn[] = [
  { key: "id", label: "ID" },
  { key: "customer", label: "Customer" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
];

const PaymentsTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [columns, setColumns] = useState(defaultColumns);

  const filteredPayments = useMemo(() => {
    let result: Payment[] = payments;

    if (selectedCustomer) {
      const customerName = customers.find((c) => c.id === selectedCustomer)?.value;
      if (customerName) {
        result = result.filter((p) => p.customer === customerName);
      }
    }

    return result;
  }, [selectedCustomer]);

  const tableItems = filteredPayments.map((p) => ({
    id: p.id,
    customer: p.customer,
    description: p.description,
    amount: formatCurrency(p.amount),
    status: p.status,
    date: p.date,
  }));

  const handleBatchChange = useCallback(
    (selectedItems: { [x: string]: unknown }) => {
      console.log("Selected items:", Object.keys(selectedItems));
    },
    []
  );

  const handleRowClick = useCallback((item: { id?: string | number }) => {
    console.log("Row clicked:", item.id);
  }, []);

  const handleColumnOrderChange = useCallback(
    (newOrder: DataTableColumn[]) => {
      setColumns(newOrder);
    },
    []
  );

  return (
    <Box css={{ stack: "y", rowGap: "large", paddingY: "large" }}>
      <Box css={{ stack: "x", columnGap: "medium", alignItems: "end" }}>
        <Box css={{ width: "1/3" }}>
          <SearchField
            label="Filter by customer"
            placeholder="Search customers..."
            data={customers}
            selectionMode="single"
            onSelectionChange={(key) => {
              setSelectedCustomer(key as string | null);
              setCurrentPage(1);
            }}
          />
        </Box>
        <Box css={{ width: "1/3" }}>
          <DateRangePicker
            label="Date range"
            timeZone="America/Los_Angeles"
            value={{ range: "last4Weeks" }}
            onChange={() => {}}
          />
        </Box>
      </Box>

      <DataTable
        columns={columns}
        items={tableItems}
        emptyMessage={{
          message: "No payments match the current filters.",
          action: {
            label: "Clear filters",
            href: "https://dashboard.stripe.com/payments",
          },
        }}
        pagination={{
          pageSize: PAGE_SIZE,
          totalItems: filteredPayments.length,
          currentPage,
          onPageChange: setCurrentPage,
        }}
        batchable={{ onBatchChange: handleBatchChange }}
        enableColumnReorder
        onColumnOrderChange={handleColumnOrderChange}
        onRowClick={handleRowClick}
        rowActions={[
          {
            id: "view-details",
            label: "View details",
            onPress: (item) => {
              console.log("View details for:", item.id);
            },
          },
          {
            id: "copy-id",
            label: "Copy ID",
            onPress: (item) => {
              console.log("Copy ID:", item.id);
            },
          },
          {
            id: "refund",
            label: "Refund payment",
            type: "destructive",
            onPress: (item) => {
              console.log("Refund:", item.id);
            },
          },
        ]}
      />
    </Box>
  );
};

export default PaymentsTab;
