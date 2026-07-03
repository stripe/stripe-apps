import { useMemo } from "react";
import {
  pointsToDollars,
  useActivityQuery,
  useRewardsQuery,
  useSettingsQuery,
} from "@/data";
import { formatPoints } from "@/utils/format";

export type RewardRedemptionItem = {
  id: string;
  memberName: string;
  points: string;
  timestamp: string;
};

function getCategoryLabel(category: string) {
  switch (category) {
    case "coffee":
      return "Coffee";
    case "merchandise":
      return "Merchandise";
    default:
      return category;
  }
}

export function useRewardDetailPage(id: string) {
  const { data: rewards, isLoading: rewardsLoading } = useRewardsQuery();
  const { data: activity, isLoading, isError, error } = useActivityQuery();
  const { data: settings } = useSettingsQuery();

  const reward = rewards?.find((r) => r.id === id);
  const pending = isLoading || rewardsLoading;
  const notFound = !pending && !reward;

  const recentRedemptions = useMemo((): RewardRedemptionItem[] => {
    if (!reward) {
      return [];
    }

    return (activity ?? [])
      .filter(
        (txn) =>
          txn.type === "redeemed" && txn.description === reward.name,
      )
      .slice(0, 5)
      .map((txn) => ({
        id: txn.id,
        memberName: txn.memberName,
        points: `-${formatPoints(txn.points)}`,
        timestamp: txn.timestamp,
      }));
  }, [activity, reward]);

  const categoryLabel = reward ? getCategoryLabel(reward.category) : "";
  const dollarValue = reward
    ? pointsToDollars(reward.pointsCost, settings?.pointsPerDollar)
    : 0;
  const pointsRedeemed = reward
    ? reward.pointsCost * reward.redemptionCount
    : 0;

  return {
    reward,
    pending,
    notFound,
    isError,
    error,
    settings,
    categoryLabel,
    dollarValue,
    pointsRedeemed,
    recentRedemptions,
  };
}
