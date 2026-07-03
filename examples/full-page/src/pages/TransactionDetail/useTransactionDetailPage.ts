import { useMemo } from "react";
import {
  useActivityQuery,
  useMembersQuery,
  useSettingsQuery,
} from "@/data";
import { formatPoints } from "@/utils/format";

export function useTransactionDetailPage(id: string) {
  const { data: activity, isLoading: activityLoading } = useActivityQuery();
  const { data: members, isLoading: membersLoading } = useMembersQuery();
  const { data: settings } = useSettingsQuery();

  const transaction = activity?.find((txn) => txn.id === id);
  const pending = activityLoading || membersLoading;
  const notFound = !pending && !transaction;

  const member = useMemo(
    () => members?.find((m) => m.id === transaction?.memberId),
    [members, transaction?.memberId],
  );

  const pointsDisplay = transaction
    ? `${transaction.type === "earned" ? "+" : "-"}${formatPoints(transaction.points)}`
    : "";

  const typeLabel = transaction
    ? transaction.type === "earned"
      ? "Earned"
      : "Redeemed"
    : "";

  return {
    transaction,
    member,
    pending,
    notFound,
    settings,
    pointsDisplay,
    typeLabel,
  };
}
