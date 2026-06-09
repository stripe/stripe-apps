import {
  Box,
  Button,
  FocusView,
  Inline,
} from "@stripe/ui-extension-sdk/ui";

import type { Payment } from "../../data/mockData";

function formatCurrency(amount: number): string {
  return `$${(amount / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

interface RefundConfirmationProps {
  payment: Payment | undefined;
  shown: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RefundConfirmation({ payment, shown, onConfirm, onCancel }: RefundConfirmationProps) {
  return (
    <FocusView
      title="Refund payment"
      shown={shown}
      setShown={function (visible) {
        if (!visible) onCancel();
      }}
      primaryAction={
        <Button type="destructive" onPress={onConfirm}>
          Confirm refund
        </Button>
      }
      secondaryAction={
        <Button onPress={onCancel}>Cancel</Button>
      }
    >
      {payment && (
        <Box css={{ stack: "y", rowGap: "medium", paddingY: "medium" }}>
          <Inline>
            Are you sure you want to refund {formatCurrency(payment.amount)} to{" "}
            {payment.customer}?
          </Inline>
          <Inline css={{ color: "secondary" }}>This action cannot be undone.</Inline>
        </Box>
      )}
    </FocusView>
  );
}
