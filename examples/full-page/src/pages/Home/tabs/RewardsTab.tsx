import { useReducer, useState } from "react";
import { Box, Button, Inline, Link } from "@stripe/ui-extension-sdk/ui";
import { DataTable } from "@stripe/ui-extension-sdk/ui/experimental";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import {
  useArchiveRewardMutation,
  useArchiveRewardsMutation,
  useRewardsQuery,
} from "@/data";
import { FilterSelect } from "@/components/FilterSelect";
import { useQueuedToast } from "@/hooks/useQueuedToast";

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "coffee":
      return "Coffee";
    case "merchandise":
      return "Merchandise";
    default:
      return category;
  }
};

interface RewardsListProps {
  onEdit: (rewardId: string) => void;
}

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

const RewardsList = ({ onEdit }: RewardsListProps) => {
  const { setRoute } = useRoute();
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

  const selectedIds = Object.keys(selectedItems);
  const hasSelection = selectedIds.length > 0;

  const handleBatchArchive = () => {
    if (!hasSelection) {
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
  };

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

  if (!rewards) {
    return null;
  }

  const rewardItems = rewards
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
            value={filters.category}
            options={[
              { label: "Coffee", value: "Coffee" },
              { label: "Merchandise", value: "Merchandise" },
            ]}
            onChange={(value) =>
              dispatchFilters({ type: "setCategory", value })
            }
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            options={[
              { label: "Available", value: "Available" },
              { label: "Out of stock", value: "Out of stock" },
            ]}
            onChange={(value) => dispatchFilters({ type: "setStatus", value })}
          />
          {(filters.category || filters.status) && (
            <Link onPress={() => dispatchFilters({ type: "clear" })}>
              <Inline css={{ fontWeight: "semibold" }}>Clear filters</Inline>
            </Link>
          )}
        </Box>
        {hasSelection && (
          <Button
            type="destructive"
            onPress={handleBatchArchive}
            pending={isArchivingBatch}
          >
            Archive ({selectedIds.length})
          </Button>
        )}
      </Box>
      <DataTable
        key={tableKey}
        pagination={{
          pageSize: 15,
        }}
        batchable={{
          onBatchChange: setSelectedItems,
        }}
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
        items={rewardItems}
        onRowClick={(item) => setRoute("reward", { id: String(item.id) })}
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
            onPress: (item) => {
              archiveReward(String(item.id), {
                onSuccess: () => {
                  queueToast("Reward archived", "success");
                },
                onError: () => {
                  queueToast("Could not archive reward", "caution");
                },
              });
            },
          },
        ]}
      />
    </Box>
  );
};

interface RewardsTabProps {
  onEdit: (rewardId: string) => void;
}

export function RewardsTab({ onEdit }: RewardsTabProps) {
  return <RewardsList onEdit={onEdit} />;
}
