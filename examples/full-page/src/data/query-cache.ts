import {
  activityData,
  membersData,
  membersTrend,
  pointsLiabilityTrend,
  redemptionsTrend,
  revenueTrend,
  rewardsData,
} from "./mock";
import { initialProgramConfig } from "./config";
import { queryKeys } from "./query-keys";

import type { QueryClient } from "@tanstack/react-query";
import type { Member, Reward, Transaction } from "./types";
import type { ProgramConfig } from "./config";

export function getOrSeedMembers(queryClient: QueryClient): Member[] {
  return queryClient.getQueryData<Member[]>(queryKeys.members) ?? [...membersData];
}

export function getOrSeedRewards(queryClient: QueryClient): Reward[] {
  return queryClient.getQueryData<Reward[]>(queryKeys.rewards) ?? [...rewardsData];
}

export function getOrSeedActivity(queryClient: QueryClient): Transaction[] {
  return (
    queryClient.getQueryData<Transaction[]>(queryKeys.activity) ?? [
      ...activityData,
    ]
  );
}

export function getOrSeedProgramConfig(queryClient: QueryClient): ProgramConfig {
  return (
    queryClient.getQueryData<ProgramConfig>(queryKeys.settings) ?? {
      ...initialProgramConfig,
    }
  );
}

export function syncCompositeQueries(queryClient: QueryClient) {
  const members = getOrSeedMembers(queryClient);
  const rewards = getOrSeedRewards(queryClient);
  const activity = getOrSeedActivity(queryClient);

  queryClient.setQueryData(queryKeys.members, members);
  queryClient.setQueryData(queryKeys.rewards, rewards);
  queryClient.setQueryData(queryKeys.activity, activity);

  queryClient.setQueryData(queryKeys.home, { members, rewards });
  queryClient.setQueryData(queryKeys.overview, {
    activity,
    membersTrend,
    revenueTrend,
    redemptionsTrend,
    pointsLiabilityTrend,
  });
  queryClient.setQueryData(queryKeys.memberDetail, { activity, rewards });
}

export function requireMembers(queryClient: QueryClient): Member[] {
  return getOrSeedMembers(queryClient);
}

export function requireRewards(queryClient: QueryClient): Reward[] {
  return getOrSeedRewards(queryClient);
}

export function requireActivity(queryClient: QueryClient): Transaction[] {
  return getOrSeedActivity(queryClient);
}

export function requireProgramConfig(queryClient: QueryClient): ProgramConfig {
  return getOrSeedProgramConfig(queryClient);
}
