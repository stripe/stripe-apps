import { useState, useMemo } from "react";

import {
  Box,
  Chip,
  Inline,
  Link,
  Menu,
  MenuItem,
} from "@stripe/ui-extension-sdk/ui";

import { statusLabels, statusOptions } from "../../data/mockData";
import type { Payment, PaymentStatus } from "../../data/mockData";
import { RefundConfirmation } from "./RefundConfirmation";
import { PaymentsTable, fullColumns } from "./PaymentsTable";

const PAGE_SIZE = 8;

interface PaymentsTabProps {
  payments: Payment[];
  paymentsById: Map<string, Payment>;
  customerFilterOptions: Array<{ id: string; label: string }>;
  onSelectPayment: (payment: Payment) => void;
  onRefundPayment: (id: string) => void;
}

export function PaymentsTab({ payments, paymentsById, customerFilterOptions, onSelectPayment, onRefundPayment }: PaymentsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [refundingPaymentId, setRefundingPaymentId] = useState<string | null>(null);

  const refundingPayment = refundingPaymentId ? paymentsById.get(refundingPaymentId) : undefined;

  const hasFilters = statusFilter || customerFilter;

  const customerById = useMemo(function () {
    return new Map(customerFilterOptions.map(function (option) {
      return [option.id, option.label];
    }));
  }, [customerFilterOptions]);

  const filteredPayments = useMemo(function () {
    let result: Payment[] = payments;

    if (statusFilter) {
      result = result.filter(function (payment) {
        return payment.status === statusFilter;
      });
    }

    if (customerFilter) {
      const customerName = customerById.get(customerFilter);
      if (customerName) {
        result = result.filter(function (payment) {
          return payment.customer === customerName;
        });
      }
    }

    return result;
  }, [payments, statusFilter, customerFilter, customerById]);

  function clearFilters() {
    setStatusFilter("");
    setCustomerFilter("");
    setCurrentPage(1);
  }

  return (
    <Box css={{ stack: "y", rowGap: "large", paddingY: "large" }}>
      <Box css={{ stack: "x", columnGap: "small", alignY: "center" }}>
        {statusFilter ? (
          <Chip
            label="Status"
            value={statusLabels[statusFilter as PaymentStatus]}
            onClose={function () {
              setStatusFilter("");
              setCurrentPage(1);
            }}
          />
        ) : (
          <Menu
            onAction={function (key) {
              setStatusFilter(String(key));
              setCurrentPage(1);
            }}
            trigger={
              <Link>
                <Chip label="Status" />
              </Link>
            }
          >
            {statusOptions.map(function (option) {
              return (
                <MenuItem key={option.id} id={option.id}>
                  {option.label}
                </MenuItem>
              );
            })}
          </Menu>
        )}

        {customerFilter ? (
          <Chip
            label="Customer"
            value={customerById.get(customerFilter)}
            onClose={function () {
              setCustomerFilter("");
              setCurrentPage(1);
            }}
          />
        ) : (
          <Menu
            onAction={function (key) {
              setCustomerFilter(String(key));
              setCurrentPage(1);
            }}
            trigger={
              <Link>
                <Chip label="Customer" />
              </Link>
            }
          >
            {customerFilterOptions.map(function (option) {
              return (
                <MenuItem key={option.id} id={option.id}>
                  {option.label}
                </MenuItem>
              );
            })}
          </Menu>
        )}

        {hasFilters && (
          <Link onPress={clearFilters}>
            <Inline css={{ fontWeight: "semibold" }}>Clear filters</Inline>
          </Link>
        )}
      </Box>

      <PaymentsTable
        payments={filteredPayments}
        columns={fullColumns}
        paymentsById={paymentsById}
        onSelectPayment={onSelectPayment}
        emptyMessage="No payments match the current filters."
        pagination={filteredPayments.length > 0 ? {
          pageSize: PAGE_SIZE,
          totalItems: filteredPayments.length,
          currentPage,
          onPageChange: setCurrentPage,
        } : undefined}
        rowActions={[
          {
            id: "refund",
            label: "Refund payment",
            type: "destructive",
            onPress: function (item) {
              setRefundingPaymentId(String(item.id));
            },
          },
        ]}
      />

      <RefundConfirmation
        payment={refundingPayment}
        shown={!!refundingPaymentId}
        onConfirm={function () {
          if (refundingPaymentId) {
            onRefundPayment(refundingPaymentId);
            setRefundingPaymentId(null);
          }
        }}
        onCancel={function () { setRefundingPaymentId(null); }}
      />
    </Box>
  );
}
