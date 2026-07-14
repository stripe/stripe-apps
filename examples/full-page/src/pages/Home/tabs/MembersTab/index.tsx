import { Box, Inline, Link, Spinner } from "@stripe/ui-extension-sdk/ui";
import { DataTable } from "@stripe/ui-extension-sdk/ui/experimental";
import { useNavigation } from "@stripe/ui-extension-sdk/navigation";
import {
  DATE_RANGE_OPTIONS,
  FilterSelect,
} from "@/pages/Home/components/FilterSelect";
import { useMembersTab } from "./hooks/useMembersTab";

interface MembersTabProps {
  onGrantPoints: (memberId: string) => void;
  onEdit: (memberId: string) => void;
}

export function MembersTab({ onGrantPoints, onEdit }: MembersTabProps) {
  const { navigateToAppRoute } = useNavigation();
  const {
    items,
    filterTier,
    filterStatus,
    filterDate,
    hasActiveFilters,
    currency,
    isLoading,
    isError,
    error,
    onFilterTier,
    onFilterStatus,
    onFilterDate,
    onClearFilters,
  } = useMembersTab();

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
          label="Tier"
          value={filterTier}
          options={[
            { label: "Bean Counter", value: "Bean Counter" },
            { label: "Barista", value: "Barista" },
            { label: "Roastmaster", value: "Roastmaster" },
          ]}
          onChange={onFilterTier}
        />
        <FilterSelect
          label="Status"
          value={filterStatus}
          options={[
            { label: "Active", value: "Active" },
            { label: "At risk", value: "At risk" },
            { label: "Inactive", value: "Inactive" },
          ]}
          onChange={onFilterStatus}
        />
        <FilterSelect
          label="Last order"
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
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "tier", label: "Tier" },
          { key: "points", label: "Points" },
          {
            key: "lifetimeSpend",
            label: "Lifetime spend",
            cell: {
              type: "currency",
              currency,
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
        items={items}
        onRowClick={(item) =>
          navigateToAppRoute("member", { id: String(item.id) })
        }
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
