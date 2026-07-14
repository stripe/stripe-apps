import {
  Box,
  Button,
  Inline,
  Link,
  Spinner,
} from "@stripe/ui-extension-sdk/ui";
import { DataTable } from "@stripe/ui-extension-sdk/ui/experimental";
import { useNavigation } from "@stripe/ui-extension-sdk/navigation";
import { FilterSelect } from "@/pages/Home/components/FilterSelect";
import { hasRole } from "@/utils/roles";
import { useRewardsTab } from "./hooks/useRewardsTab";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/utils";

interface RewardsTabProps {
  userContext: ExtensionContextValue["userContext"];
  onEdit: (rewardId: string) => void;
}

export function RewardsTab({ userContext, onEdit }: RewardsTabProps) {
  const isAdmin = hasRole(userContext, "admin");
  const { navigateToAppRoute } = useNavigation();

  const {
    items,
    filterCategory,
    filterStatus,
    hasActiveFilters,
    tableKey,
    selectedCount,
    hasSelection,
    isArchivingBatch,
    isLoading,
    isError,
    error,
    onFilterCategory,
    onFilterStatus,
    onClearFilters,
    onBatchChange,
    onBatchArchive,
    onArchiveReward,
  } = useRewardsTab();

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
      <Box
        css={{
          stack: "x",
          gap: "small",
          alignY: "center",
          distribute: "space-between",
        }}
      >
        <Box css={{ stack: "x", gap: "small", alignY: "center" }}>
          <FilterSelect
            label="Category"
            value={filterCategory}
            options={[
              { label: "Coffee", value: "Coffee" },
              { label: "Merchandise", value: "Merchandise" },
            ]}
            onChange={onFilterCategory}
          />
          <FilterSelect
            label="Status"
            value={filterStatus}
            options={[
              { label: "Available", value: "Available" },
              { label: "Out of stock", value: "Out of stock" },
            ]}
            onChange={onFilterStatus}
          />
          {hasActiveFilters && (
            <Link onPress={onClearFilters}>
              <Inline css={{ fontWeight: "semibold" }}>Clear filters</Inline>
            </Link>
          )}
        </Box>
        {isAdmin && hasSelection && (
          <Button
            type="destructive"
            onPress={onBatchArchive}
            pending={isArchivingBatch}
          >
            Archive ({selectedCount})
          </Button>
        )}
      </Box>
      <DataTable
        key={tableKey}
        pagination={{
          pageSize: 15,
        }}
        batchable={
          isAdmin
            ? {
                onBatchChange,
              }
            : undefined
        }
        columns={[
          { key: "name", label: "Reward" },
          { key: "description", label: "Description" },
          { key: "category", label: "Category" },
          { key: "pointsCost", label: "Points cost" },
          { key: "redemptionCount", label: "Redemptions" },
          {
            key: "status",
            label: "Status",
            cell: {
              type: "status",
              statusMap: {
                Available: "positive",
                "Out of stock": "neutral",
              },
            },
          },
        ]}
        items={items}
        onRowClick={(item) =>
          navigateToAppRoute("reward", { id: String(item.id) })
        }
        rowActions={[
          {
            id: "edit",
            label: "Edit",
            onPress: (item) => onEdit(String(item.id)),
          },
          {
            id: "archive",
            label: "Archive",
            type: "destructive",
            onPress: (item) => onArchiveReward(String(item.id)),
          },
        ]}
      />
    </Box>
  );
}
