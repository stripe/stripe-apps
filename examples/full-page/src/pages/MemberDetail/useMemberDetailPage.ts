import { useMemo } from "react";
import {
  useMemberDetailQuery,
  useMembersQuery,
  useSettingsQuery,
} from "@/data";
import { formatPoints } from "@/utils/format";

export type MemberActivityItem = {
  id: string;
  description: string;
  type: "Earned" | "Redeemed";
  points: string;
  timestamp: string;
};

export function useMemberDetailPage(id: string) {
  const { data: members, isLoading: membersLoading } = useMembersQuery();
  const { data, isLoading, isError, error } = useMemberDetailQuery();
  const { data: settings } = useSettingsQuery();

  const member = members?.find((m) => m.id === id);
  const pending = isLoading || membersLoading;
  const notFound = !pending && !member;

  const derived = useMemo(() => {
    if (!member) {
      return null;
    }

    const { activity = [], rewards = [] } = data ?? {};
    const memberTransactions = activity.filter((txn) => txn.memberId === id);
    const lifetimeRedeemed = memberTransactions
      .filter((txn) => txn.type === "redeemed")
      .reduce((sum, txn) => sum + txn.points, 0);
    const lifetimeEarned = member.points + lifetimeRedeemed;
    const lowestRewardCost = Math.min(...rewards.map((r) => r.pointsCost));
    const pointsToNextReward = Math.max(0, lowestRewardCost - member.points);
    const totalOrders = memberTransactions.filter(
      (t) => t.type === "earned",
    ).length;

    const recentActivity: MemberActivityItem[] = memberTransactions
      .slice(0, 5)
      .map((txn) => ({
        id: txn.id,
        description: txn.description,
        type: txn.type === "earned" ? "Earned" : "Redeemed",
        points: `${txn.type === "earned" ? "+" : "-"}${formatPoints(txn.points)}`,
        timestamp: txn.timestamp,
      }));

    return {
      member,
      lifetimeEarned,
      lifetimeRedeemed,
      pointsToNextReward,
      totalOrders,
      recentActivity,
    };
  }, [data, id, member]);

  return {
    member,
    pending,
    notFound,
    isError,
    error,
    settings,
    lifetimeEarned: derived?.lifetimeEarned ?? 0,
    lifetimeRedeemed: derived?.lifetimeRedeemed ?? 0,
    pointsToNextReward: derived?.pointsToNextReward ?? 0,
    totalOrders: derived?.totalOrders ?? 0,
    recentActivity: derived?.recentActivity ?? [],
  };
}
