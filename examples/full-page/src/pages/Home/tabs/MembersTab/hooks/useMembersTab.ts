import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  useAppRoute,
  useNavigation,
} from "@stripe/ui-extension-sdk/navigation";
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

  // The "Members by tier" chart on the Overview tab links here with the tier in
  // the route's `tier` path param. We seed the filter from it and keep the two
  // in sync, but the reducer stays the single source of truth for the filters.
  const route = useAppRoute();
  const { navigateToAppRoute } = useNavigation();
  const tierParam = (route.key === "home" && route.routeParams.tier) || "";

  const [filters, dispatchFilters] = useReducer(
    membersFilterReducer,
    tierParam,
    (tier): MembersFilterState => ({ ...initialMembersFilters, tier }),
  );

  // Subscribe to route changes so navigating in with a new tier (or browser
  // back/forward) updates the filter even if this tab stays mounted.
  useEffect(() => {
    dispatchFilters({ type: "setTier", value: tierParam });
  }, [tierParam]);

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

  const onFilterTier = useCallback(
    (value: string) => {
      dispatchFilters({ type: "setTier", value });
      // Mirror the tier into the route's path param so the URL stays
      // shareable. Omitting `tier` drops it when the filter is cleared.
      navigateToAppRoute({
        key: "home",
        params: value ? { tabId: "members", tier: value } : { tabId: "members" },
      });
    },
    [navigateToAppRoute],
  );

  const onFilterStatus = useCallback((value: string) => {
    dispatchFilters({ type: "setStatus", value });
  }, []);

  const onFilterDate = useCallback((value: string) => {
    dispatchFilters({ type: "setDate", value });
  }, []);

  const onClearFilters = useCallback(() => {
    dispatchFilters({ type: "clear" });
    // Drop the `tier` path param for the current route.
    navigateToAppRoute({ key: "home", params: { tabId: "members" } });
  }, [navigateToAppRoute]);

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
