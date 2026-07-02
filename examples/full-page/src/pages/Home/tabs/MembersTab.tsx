import { useReducer } from "react";
import { Box, DataTable, Inline, Link } from "@stripe/ui-extension-sdk/ui";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import {
  getMemberEngagementStatus,
  useMembersQuery,
  useSettingsQuery,
} from "@/data";
import { DATE_RANGE_OPTIONS, FilterSelect } from "@/components/FilterSelect";
import { isWithinDays } from "@/utils/date";

interface MembersTabProps {
  onGrantPoints: (memberId: string) => void;
  onEdit: (memberId: string) => void;
}

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

export function MembersTab({
  onGrantPoints,
  onEdit,
}: MembersTabProps) {
  const { setRoute } = useRoute();
  const { data: members, isLoading, isError, error } = useMembersQuery();
  const { data: settings } = useSettingsQuery();
  const [filters, dispatchFilters] = useReducer(
    membersFilterReducer,
    initialMembersFilters,
  );

  if (isLoading) {
    return <Box css={{ font: "caption", color: "secondary" }}>Loading…</Box>;
  }

  if (isError) {
    return (
      <Box css={{ font: "caption", color: "critical" }}>
        {error?.message ?? "Something went wrong"}
      </Box>
    );
  }

  if (!members) {
    return null;
  }

  const memberItems = members
    .filter((member) => {
      const status = getMemberEngagementStatus(
        member,
        settings?.engagementWindows,
      );
      const statusLabel =
        status === "active"
          ? "Active"
          : status === "at-risk"
            ? "At risk"
            : "Inactive";
      const matchesTier = !filters.tier || member.tier === filters.tier;
      const matchesStatus = !filters.status || statusLabel === filters.status;
      const matchesDate =
        !filters.date || isWithinDays(member.lastOrder, Number(filters.date));
      return matchesTier && matchesStatus && matchesDate;
    })
    .map((member) => {
      const status = getMemberEngagementStatus(
        member,
        settings?.engagementWindows,
      );
      const statusLabel =
        status === "active"
          ? "Active"
          : status === "at-risk"
            ? "At risk"
            : "Inactive";
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        tier: member.tier,
        points: member.points,
        lifetimeSpend: member.lifetimeSpend * 100, // currency type expects cents
        lastOrder: member.lastOrder,
        status: statusLabel,
      };
    });

  return (
    <Box css={{ stack: "y", gap: "medium" }}>
      <Box css={{ stack: "x", gap: "small", alignY: "center" }}>
        <FilterSelect
          label="Tier"
          value={filters.tier}
          options={[
            { label: "Bean Counter", value: "Bean Counter" },
            { label: "Barista", value: "Barista" },
            { label: "Roastmaster", value: "Roastmaster" },
          ]}
          onChange={(value) => dispatchFilters({ type: "setTier", value })}
        />
        <FilterSelect
          label="Status"
          value={filters.status}
          options={[
            { label: "Active", value: "Active" },
            { label: "At risk", value: "At risk" },
            { label: "Inactive", value: "Inactive" },
          ]}
          onChange={(value) => dispatchFilters({ type: "setStatus", value })}
        />
        <FilterSelect
          label="Last order"
          value={filters.date}
          options={DATE_RANGE_OPTIONS}
          onChange={(value) => dispatchFilters({ type: "setDate", value })}
        />
        {(filters.tier || filters.status || filters.date) && (
          <Link onPress={() => dispatchFilters({ type: "clear" })}>
            <Inline css={{ fontWeight: "semibold" }}>Clear filters</Inline>
          </Link>
        )}
      </Box>
      <DataTable
        pagination={{
          pageSize: 15,
        }}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "tier", label: "Tier" },
          { key: "points", label: "Points" },
          {
            key: "lifetimeSpend",
            label: "Lifetime spend",
            cell: {
              type: "currency",
              currency: (settings?.currency ?? "usd").toUpperCase(),
            },
          },
          { key: "lastOrder", label: "Last order", cell: { type: "date" } },
          {
            key: "status",
            label: "Status",
            cell: {
              type: "status",
              statusMap: {
                Active: "positive",
                "At risk": "warning",
                Inactive: "neutral",
              },
            },
          },
        ]}
        items={memberItems}
        onRowClick={(item) => setRoute("member", { id: String(item.id) })}
        rowActions={[
          {
            id: "grant",
            label: "Grant points",
            onPress: (item) => onGrantPoints(String(item.id)),
          },
          {
            id: "edit",
            label: "Edit",
            onPress: (item) => onEdit(String(item.id)),
          },
        ]}
      />
    </Box>
  );
}
