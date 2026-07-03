import { useCallback, useMemo, useReducer } from "react";
import { useActivityQuery } from "@/data";
import { isWithinDays } from "@/utils/date";

export type ActivityItem = {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  type: "Earned" | "Redeemed";
  description: string;
  points: number;
  timestamp: string;
};

type ActivityFilterState = {
  type: string;
  date: string;
};

type ActivityFilterAction =
  | { type: "setType"; value: string }
  | { type: "setDate"; value: string }
  | { type: "clear" };

const initialActivityFilters: ActivityFilterState = {
  type: "",
  date: "",
};

function getTypeLabel(type: "earned" | "redeemed"): "Earned" | "Redeemed" {
  return type === "earned" ? "Earned" : "Redeemed";
}

function activityFilterReducer(
  state: ActivityFilterState,
  action: ActivityFilterAction,
): ActivityFilterState {
  switch (action.type) {
    case "setType":
      return { ...state, type: action.value };
    case "setDate":
      return { ...state, date: action.value };
    case "clear":
      return initialActivityFilters;
  }
}

export function useActivityTab() {
  const { data: activity, isLoading, isError, error } = useActivityQuery();
  const [filters, dispatchFilters] = useReducer(
    activityFilterReducer,
    initialActivityFilters,
  );

  const items = useMemo((): ActivityItem[] => {
    if (!activity) {
      return [];
    }

    return activity
      .filter((txn) => {
        const typeLabel = getTypeLabel(txn.type);
        const matchesType = !filters.type || typeLabel === filters.type;
        const matchesDate =
          !filters.date || isWithinDays(txn.timestamp, parseInt(filters.date));
        return matchesType && matchesDate;
      })
      .map((txn) => ({
        id: txn.id,
        memberId: txn.memberId,
        memberName: txn.memberName,
        memberEmail: txn.memberEmail,
        type: getTypeLabel(txn.type),
        description: txn.description,
        points: txn.points,
        timestamp: txn.timestamp,
      }));
  }, [activity, filters]);

  const onFilterType = useCallback((value: string) => {
    dispatchFilters({ type: "setType", value });
  }, []);

  const onFilterDate = useCallback((value: string) => {
    dispatchFilters({ type: "setDate", value });
  }, []);

  const onClearFilters = useCallback(() => {
    dispatchFilters({ type: "clear" });
  }, []);

  const hasActiveFilters = Boolean(filters.type || filters.date);

  return {
    items,
    filterType: filters.type,
    filterDate: filters.date,
    hasActiveFilters,
    isLoading,
    isError,
    error,
    onFilterType,
    onFilterDate,
    onClearFilters,
  };
}
