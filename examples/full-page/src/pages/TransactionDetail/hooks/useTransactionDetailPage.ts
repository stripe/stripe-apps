import { useMemo } from "react";
import { useActivityQuery, useMembersQuery, useSettingsQuery } from "@/data";
import { formatPoints } from "@/utils/format";

export function useTransactionDetailPage(id: string) {
  const { data: activity, isFetching: activityLoading } = useActivityQuery();
  const { data: members, isFetching: membersLoading } = useMembersQuery();
  const { data: settings, isFetching: settingsLoading } = useSettingsQuery();

  const transaction = activity?.find((txn) => txn.id === id);
  const pending = activityLoading || membersLoading || settingsLoading;
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
