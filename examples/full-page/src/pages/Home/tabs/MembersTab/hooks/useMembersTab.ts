import { useCallback, useMemo, useReducer } from "react";
import {
  getMemberEngagementStatus,
  useMembersQuery,
  useSettingsQuery,
  type Member,
  type ProgramConfig,
} from "@/data";
import { isWithinDays } from "@/utils/date";

export type MemberItem = {
  id: string;
  name: string;
  email: string;
  tier: string;
  points: number;
  lifetimeSpend: number;
  lastOrder: string;
  status: "Active" | "At risk" | "Inactive";
};

type MembersFilterState = {
  tier: string;
  status: string;
  date: string;
};

type MembersFilterAction =
  | { type: "setTier"; value: string }
  | { type: "setStatus"; value: string }
  | { type: "setDate"; value: string }
  | { type: "clear" };

const initialMembersFilters: MembersFilterState = {
  tier: "",
  status: "",
  date: "",
};

function getStatusLabel(
  member: Member,
  engagementWindows?: ProgramConfig["engagementWindows"],
): MemberItem["status"] {
  const status = getMemberEngagementStatus(member, engagementWindows);
  if (status === "active") return "Active";
  if (status === "at-risk") return "At risk";
  return "Inactive";
}

function membersFilterReducer(
  state: MembersFilterState,
  action: MembersFilterAction,
): MembersFilterState {
  switch (action.type) {
    case "setTier":
      return { ...state, tier: action.value };
    case "setStatus":
      return { ...state, status: action.value };
    case "setDate":
      return { ...state, date: action.value };
    case "clear":
      return initialMembersFilters;
  }
}

export function useMembersTab() {
  const { data: members, isLoading, isError, error } = useMembersQuery();
  const { data: settings } = useSettingsQuery();
  const [filters, dispatchFilters] = useReducer(
    membersFilterReducer,
    initialMembersFilters,
  );

  const items = useMemo((): MemberItem[] => {
    if (!members) {
      return [];
    }

    return members
      .filter((member) => {
        const statusLabel = getStatusLabel(member, settings?.engagementWindows);
        const matchesTier = !filters.tier || member.tier === filters.tier;
        const matchesStatus = !filters.status || statusLabel === filters.status;
        const matchesDate =
          !filters.date || isWithinDays(member.lastOrder, Number(filters.date));
        return matchesTier && matchesStatus && matchesDate;
      })
      .map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        tier: member.tier,
        points: member.points,
        lifetimeSpend: member.lifetimeSpend * 100,
        lastOrder: member.lastOrder,
        status: getStatusLabel(member, settings?.engagementWindows),
      }));
  }, [members, filters, settings?.engagementWindows]);

  const onFilterTier = useCallback((value: string) => {
    dispatchFilters({ type: "setTier", value });
  }, []);

  const onFilterStatus = useCallback((value: string) => {
    dispatchFilters({ type: "setStatus", value });
  }, []);

  const onFilterDate = useCallback((value: string) => {
    dispatchFilters({ type: "setDate", value });
  }, []);

  const onClearFilters = useCallback(() => {
    dispatchFilters({ type: "clear" });
  }, []);

  const hasActiveFilters = Boolean(
    filters.tier || filters.status || filters.date,
  );

  return {
    items,
    filterTier: filters.tier,
    filterStatus: filters.status,
    filterDate: filters.date,
    hasActiveFilters,
    currency: (settings?.currency ?? "usd").toUpperCase(),
    isLoading,
    isError,
    error,
    onFilterTier,
    onFilterStatus,
    onFilterDate,
    onClearFilters,
  };
}
