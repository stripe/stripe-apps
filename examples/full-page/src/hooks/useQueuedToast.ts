import { useCallback, useEffect, useState } from "react";
import { showToast } from "@stripe/ui-extension-sdk/utils";

/** @see https://docs.stripe.com/stripe-apps/reference/extensions-sdk-api#showToast */
const MAX_TOAST_LENGTH = 30;

type ToastType = "success" | "caution" | "pending";

type QueuedToast = {
  message: string;
  type: ToastType;
};

export function truncateToastMessage(message: string): string {
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return "Done";
  }
  if (trimmed.length <= MAX_TOAST_LENGTH) {
    return trimmed;
  }
  return `${trimmed.slice(0, MAX_TOAST_LENGTH - 1)}…`;
}

/**
 * Queues a toast for the next effect tick. Messages are truncated to Stripe's
 * 30-character limit — longer strings are silently rejected by the SDK.
 */
export function useQueuedToast() {
  const [queuedToast, setQueuedToast] = useState<QueuedToast | null>(null);

  const queueToast = useCallback((message: string, type: ToastType) => {
    setQueuedToast({ message: truncateToastMessage(message), type });
  }, []);

  useEffect(() => {
    if (!queuedToast) {
      return;
    }

    void showToast(queuedToast.message, { type: queuedToast.type });
    setQueuedToast(null);
  }, [queuedToast]);

  return { queueToast };
}
