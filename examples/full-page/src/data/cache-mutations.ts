import type { QueryClient } from "@tanstack/react-query";

import type {
  GrantPointsInput,
  UpdateMemberInput,
  UpdateProgramConfigInput,
  UpdateRewardInput,
} from "./api";
import { queryKeys } from "./query-keys";
import {
  requireActivity,
  requireMembers,
  requireProgramConfig,
  requireRewards,
  syncCompositeQueries,
} from "./query-cache";

const GRANT_REASON_LABELS: Record<string, string> = {
  customer_service: "Customer service gesture",
  promotion: "Promotional campaign",
  referral: "Referral bonus",
  birthday: "Birthday reward",
  anniversary: "Membership anniversary",
  compensation: "Service recovery",
  other: "Other",
};

export function applyUpdateMember(
  queryClient: QueryClient,
  input: UpdateMemberInput,
) {
  const members = requireMembers(queryClient);
  if (!members.some((member) => member.id === input.id)) {
    throw new Error(`Member not found: ${input.id}`);
  }

  queryClient.setQueryData(
    queryKeys.members,
    members.map((member) =>
      member.id === input.id
        ? {
            ...member,
            name: input.name,
            email: input.email,
            lifetimeSpend: input.lifetimeSpend,
          }
        : member,
    ),
  );

  const activity = requireActivity(queryClient);
  queryClient.setQueryData(
    queryKeys.activity,
    activity.map((txn) =>
      txn.memberId === input.id
        ? { ...txn, memberName: input.name, memberEmail: input.email }
        : txn,
    ),
  );

  syncCompositeQueries(queryClient);
}

export function applyGrantPoints(
  queryClient: QueryClient,
  input: GrantPointsInput,
) {
  const members = requireMembers(queryClient);
  const member = members.find((m) => m.id === input.memberId);
  if (!member) {
    throw new Error(`Member not found: ${input.memberId}`);
  }
  if (input.points <= 0) {
    throw new Error("Points must be greater than zero");
  }

  queryClient.setQueryData(
    queryKeys.members,
    members.map((m) =>
      m.id === input.memberId
        ? { ...m, points: m.points + input.points }
        : m,
    ),
  );

  const description = input.reason
    ? (GRANT_REASON_LABELS[input.reason] ?? "Bonus points granted")
    : "Bonus points granted";

  const activity = requireActivity(queryClient);
  queryClient.setQueryData(queryKeys.activity, [
    {
      id: `txn_${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      memberEmail: member.email,
      type: "earned" as const,
      points: input.points,
      description,
      timestamp: new Date().toISOString(),
    },
    ...activity,
  ]);

  syncCompositeQueries(queryClient);
}

export function applyUpdateReward(
  queryClient: QueryClient,
  input: UpdateRewardInput,
) {
  const rewards = requireRewards(queryClient);
  const reward = rewards.find((r) => r.id === input.id);
  if (!reward) {
    throw new Error(`Reward not found: ${input.id}`);
  }

  const previousName = reward.name;
  queryClient.setQueryData(
    queryKeys.rewards,
    rewards.map((r) =>
      r.id === input.id
        ? {
            ...r,
            name: input.name,
            description: input.description,
            pointsCost: input.pointsCost,
            category: input.category,
            available: input.available,
          }
        : r,
    ),
  );

  if (input.name !== previousName) {
    const activity = requireActivity(queryClient);
    queryClient.setQueryData(
      queryKeys.activity,
      activity.map((txn) =>
        txn.type === "redeemed" && txn.description === previousName
          ? { ...txn, description: input.name }
          : txn,
      ),
    );
  }

  syncCompositeQueries(queryClient);
}

export function applyArchiveReward(queryClient: QueryClient, id: string) {
  applyArchiveRewards(queryClient, [id]);
}

export function applyArchiveRewards(queryClient: QueryClient, ids: string[]) {
  const rewards = requireRewards(queryClient);
  const idSet = new Set(ids);
  if (!ids.every((id) => rewards.some((reward) => reward.id === id))) {
    throw new Error("One or more rewards were not found");
  }

  queryClient.setQueryData(
    queryKeys.rewards,
    rewards.map((reward) =>
      idSet.has(reward.id) ? { ...reward, available: false } : reward,
    ),
  );

  syncCompositeQueries(queryClient);
}

export function applyUpdateProgramConfig(
  queryClient: QueryClient,
  input: UpdateProgramConfigInput,
) {
  const current = requireProgramConfig(queryClient);
  queryClient.setQueryData(queryKeys.settings, {
    ...current,
    name: input.name,
    pointsPerDollar: input.pointsPerDollar,
    currency: input.currency,
    engagementWindows: {
      ...current.engagementWindows,
      active: input.engagementWindows.active,
      atRisk: input.engagementWindows.atRisk,
    },
  });
}
