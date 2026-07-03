import { useCallback, useMemo, useReducer, useState } from "react";
import {
  useArchiveRewardMutation,
  useArchiveRewardsMutation,
  useRewardsQuery,
} from "@/data";
import { useQueuedToast } from "@/hooks/useQueuedToast";

export type RewardItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  pointsCost: number;
  redemptionCount: number;
  status: "Available" | "Out of stock";
};

type RewardsFilterState = {
  category: string;
  status: string;
};

type RewardsFilterAction =
  | { type: "setCategory"; value: string }
  | { type: "setStatus"; value: string }
  | { type: "clear" };

const initialRewardsFilters: RewardsFilterState = {
  category: "",
  status: "",
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

function rewardsFilterReducer(
  state: RewardsFilterState,
  action: RewardsFilterAction,
): RewardsFilterState {
  switch (action.type) {
    case "setCategory":
      return { ...state, category: action.value };
    case "setStatus":
      return { ...state, status: action.value };
    case "clear":
      return initialRewardsFilters;
  }
}

export function useRewardsTab() {
  const { data: rewards, isLoading, isError, error } = useRewardsQuery();
  const { mutate: archiveReward } = useArchiveRewardMutation();
  const { mutate: archiveRewards, isPending: isArchivingBatch } =
    useArchiveRewardsMutation();
  const { queueToast } = useQueuedToast();
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { id: string | number }>
  >({});
  const [tableKey, setTableKey] = useState(0);
  const [filters, dispatchFilters] = useReducer(
    rewardsFilterReducer,
    initialRewardsFilters,
  );

  const items = useMemo((): RewardItem[] => {
    if (!rewards) {
      return [];
    }

    return rewards
      .filter((reward) => {
        const categoryLabel = getCategoryLabel(reward.category);
        const statusLabel = reward.available ? "Available" : "Out of stock";
        const matchesCategory =
          !filters.category || categoryLabel === filters.category;
        const matchesStatus = !filters.status || statusLabel === filters.status;
        return matchesCategory && matchesStatus;
      })
      .map((reward) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        category: getCategoryLabel(reward.category),
        pointsCost: reward.pointsCost,
        redemptionCount: reward.redemptionCount,
        status: reward.available ? "Available" : "Out of stock",
      }));
  }, [rewards, filters]);

  const selectedIds = Object.keys(selectedItems);
  const hasSelection = selectedIds.length > 0;

  const onFilterCategory = useCallback((value: string) => {
    dispatchFilters({ type: "setCategory", value });
  }, []);

  const onFilterStatus = useCallback((value: string) => {
    dispatchFilters({ type: "setStatus", value });
  }, []);

  const onClearFilters = useCallback(() => {
    dispatchFilters({ type: "clear" });
  }, []);

  const onBatchArchive = useCallback(() => {
    if (selectedIds.length === 0) {
      return;
    }

    archiveRewards(selectedIds, {
      onSuccess: () => {
        const count = selectedIds.length;
        queueToast(
          count === 1 ? "Reward archived" : `${count} rewards archived`,
          "success",
        );
        setSelectedItems({});
        setTableKey((key) => key + 1);
      },
      onError: () => {
        queueToast("Could not archive rewards", "caution");
      },
    });
  }, [archiveRewards, queueToast, selectedIds]);

  const onArchiveReward = useCallback(
    (rewardId: string) => {
      archiveReward(rewardId, {
        onSuccess: () => {
          queueToast("Reward archived", "success");
        },
        onError: () => {
          queueToast("Could not archive reward", "caution");
        },
      });
    },
    [archiveReward, queueToast],
  );

  const hasActiveFilters = Boolean(filters.category || filters.status);

  return {
    items,
    filterCategory: filters.category,
    filterStatus: filters.status,
    hasActiveFilters,
    tableKey,
    selectedItems,
    selectedCount: selectedIds.length,
    hasSelection,
    isArchivingBatch,
    isLoading,
    isError,
    error,
    onFilterCategory,
    onFilterStatus,
    onClearFilters,
    onBatchChange: setSelectedItems,
    onBatchArchive,
    onArchiveReward,
  };
}
