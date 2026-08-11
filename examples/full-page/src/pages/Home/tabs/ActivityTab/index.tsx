import { Box, Inline, Link, Spinner } from "@stripe/ui-extension-sdk/ui";
import { DataTable } from "@stripe/ui-extension-sdk/ui/experimental";
import { useNavigation } from "@stripe/ui-extension-sdk/navigation";
import {
  DATE_RANGE_OPTIONS,
  FilterSelect,
} from "@/pages/Home/components/FilterSelect";
import { useActivityTab } from "./hooks/useActivityTab";

interface ActivityTabProps {
  onGrantPoints: (memberId: string) => void;
}

export function ActivityTab({ onGrantPoints }: ActivityTabProps) {
  const { navigateToAppRoute } = useNavigation();

  const {
    items,
    filterType,
    filterDate,
    hasActiveFilters,
    isLoading,
    isError,
    error,
    onFilterType,
    onFilterDate,
    onClearFilters,
  } = useActivityTab();

  if (isLoading) {
    return (
      <Box
        css={{
          stack: "y",
          alignX: "center",
          alignY: "center",
          height: "fill",
          paddingTop: "xxlarge",
        }}
      >
        <Spinner size="large" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box css={{ font: "caption", color: "critical" }}>
        {error?.message ?? "Something went wrong"}
      </Box>
    );
  }

  return (
    <Box css={{ stack: "y", gap: "medium" }}>
      <Box css={{ stack: "x", gap: "small", alignY: "center" }}>
        <FilterSelect
          label="Type"
          value={filterType}
          options={[
            { label: "Earned", value: "Earned" },
            { label: "Redeemed", value: "Redeemed" },
          ]}
          onChange={onFilterType}
        />
        <FilterSelect
          label="Date"
          value={filterDate}
          options={DATE_RANGE_OPTIONS}
          onChange={onFilterDate}
        />
        {hasActiveFilters && (
          <Link onPress={onClearFilters}>
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
        items={items}
        onRowClick={(item) =>
          navigateToAppRoute("transaction", { id: String(item.id) })
        }
        rowActions={[
          {
            id: "grant",
            label: "Grant points",
            onPress: (item) => onGrantPoints(String(item.memberId)),
          },
        ]}
      />
    </Box>
  );
}
