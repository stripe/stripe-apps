import { useReducer } from "react";
import {
  Box,
  DataTable,
  Inline,
  Link,
} from "@stripe/ui-extension-sdk/ui";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";
import { useActivityQuery } from "@/data";
import { DATE_RANGE_OPTIONS, FilterSelect } from "@/components/FilterSelect";
import { isWithinDays } from "@/utils/date";

interface ActivityTabProps {
  onGrantPoints: (memberId: string) => void;
}

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

export function ActivityTab({ onGrantPoints }: ActivityTabProps) {
  const { setRoute } = useRoute();
  const { data: activity, isLoading, isError, error } = useActivityQuery();
  const [filters, dispatchFilters] = useReducer(
    activityFilterReducer,
    initialActivityFilters,
  );

  if (isLoading) {
    return (
      <Box css={{ font: "caption", color: "secondary" }}>Loading…</Box>
    );
  }

  if (isError) {
    return (
      <Box css={{ font: "caption", color: "critical" }}>
        {error?.message ?? "Something went wrong"}
      </Box>
    );
  }

  if (!activity) {
    return null;
  }

  const activityItems = activity
    .filter((txn) => {
      const typeLabel = txn.type === "earned" ? "Earned" : "Redeemed";
      const matchesType = !filters.type || typeLabel === filters.type;
      const matchesDate =
        !filters.date || isWithinDays(txn.timestamp, parseInt(filters.date));
      return matchesType && matchesDate;
    })
    .map((txn) => ({
      id: txn.id,
      memberName: txn.memberName,
      memberEmail: txn.memberEmail,
      type: txn.type === "earned" ? "Earned" : "Redeemed",
      description: txn.description,
      points: txn.points,
      timestamp: txn.timestamp,
    }));

  return (
    <Box css={{ stack: "y", gap: "medium" }}>
      <Box css={{ stack: "x", gap: "small", alignY: "center" }}>
        <FilterSelect
          label="Type"
          value={filters.type}
          options={[
            { label: "Earned", value: "Earned" },
            { label: "Redeemed", value: "Redeemed" },
          ]}
          onChange={(value) => dispatchFilters({ type: "setType", value })}
        />
        <FilterSelect
          label="Date"
          value={filters.date}
          options={DATE_RANGE_OPTIONS}
          onChange={(value) => dispatchFilters({ type: "setDate", value })}
        />
        {(filters.type || filters.date) && (
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
          { key: "memberName", label: "Member" },
          { key: "memberEmail", label: "Email" },
          { key: "type", label: "Type" },
          { key: "description", label: "Description" },
          { key: "points", label: "Points" },
          { key: "timestamp", label: "Time", cell: { type: "date" } },
        ]}
        items={activityItems}
        onRowClick={(item) => setRoute("transaction", { id: String(item.id) })}
        rowActions={[
          {
            id: "grant",
            label: "Grant points",
            onPress: (item) => {
              const txn = activity.find((t) => t.id === item.id);
              if (txn) onGrantPoints(txn.memberId);
            },
          },
        ]}
      />
    </Box>
  );
}
