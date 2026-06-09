import { useState } from "react";

import {
  Badge,
  Box,
  Button,
  Icon,
  Inline,
  Link,
  PropertyList,
  PropertyListItem,
} from "@stripe/ui-extension-sdk/ui";

import type { Payment, PaymentStatus } from "../../data/mockData";
import { statusLabels } from "../../data/mockData";
import { RefundConfirmation } from "./RefundConfirmation";

const statusBadgeType: Record<PaymentStatus, "positive" | "warning" | "negative" | "neutral"> = {
  succeeded: "positive",
  pending: "warning",
  failed: "negative",
  refunded: "neutral",
};

function formatCurrency(amount: number): string {
  return `$${(amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

interface PaymentDetailProps {
  payment: Payment;
  onBack: () => void;
  onEdit: () => void;
  onRefund: () => void;
}

export function PaymentDetail({ payment, onBack, onEdit, onRefund }: PaymentDetailProps) {
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const canRefund = payment.status === "succeeded" || payment.status === "pending";

  function handleConfirmRefund() {
    onRefund();
    setShowRefundConfirm(false);
  }

  return (
    <Box css={{ stack: "y", rowGap: "large", paddingY: "large" }}>
      <Box css={{ stack: "x", columnGap: "xsmall", alignY: "center" }}>
        <Link onPress={onBack}>
          <Box css={{ stack: "x", columnGap: "xsmall", alignY: "center" }}>
            <Icon name="arrowLeft" size="xsmall" />
            <Inline>Payments</Inline>
          </Box>
        </Link>
        <Inline css={{ color: "secondary" }}>/</Inline>
        <Inline>{payment.id}</Inline>
      </Box>

      <Box css={{ stack: "x", distribute: "space-between", alignY: "center" }}>
        <Box css={{ stack: "x", columnGap: "medium", alignY: "center" }}>
          <Inline css={{ font: "heading" }}>{payment.id}</Inline>
          <Badge type={statusBadgeType[payment.status]}>
            {statusLabels[payment.status]}
          </Badge>
        </Box>
        <Box css={{ stack: "x", columnGap: "small" }}>
          <Button onPress={onEdit}>Edit</Button>
          {canRefund && (
            <Button type="destructive" onPress={function () { setShowRefundConfirm(true); }}>
              Refund
            </Button>
          )}
        </Box>
      </Box>

      <Box css={{ stack: "x", columnGap: "xlarge" }}>
        <Box css={{ width: "2/3", stack: "y", rowGap: "large" }}>
          <Box css={{ stack: "y", rowGap: "small" }}>
            <Inline css={{ font: "subheading" }}>Payment details</Inline>
            <PropertyList>
              <PropertyListItem label="Amount" value={formatCurrency(payment.amount)} />
              <PropertyListItem label="Currency" value={payment.currency.toUpperCase()} />
              <PropertyListItem label="Description" value={payment.description} />
              <PropertyListItem label="Date" value={payment.date} />
            </PropertyList>
          </Box>
        </Box>

        <Box css={{ width: "1/3", stack: "y", rowGap: "large" }}>
          <Box css={{ stack: "y", rowGap: "small" }}>
            <Inline css={{ font: "subheading" }}>Customer</Inline>
            <PropertyList>
              <PropertyListItem label="Name" value={payment.customer} />
              <PropertyListItem label="Email" value={payment.email} />
            </PropertyList>
          </Box>
        </Box>
      </Box>

      <RefundConfirmation
        payment={payment}
        shown={showRefundConfirm}
        onConfirm={handleConfirmRefund}
        onCancel={function () { setShowRefundConfirm(false); }}
      />
    </Box>
  );
}
