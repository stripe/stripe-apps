import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  applyArchiveReward,
  applyArchiveRewards,
  applyGrantPoints,
  applyUpdateMember,
  applyUpdateProgramConfig,
  applyUpdateReward,
} from "./cache-mutations";
import {
  fetchActivity,
  fetchHomeData,
  fetchMemberDetailData,
  fetchMembers,
  fetchOverviewData,
  fetchProgramConfig,
  fetchRewards,
} from "./api";
import { simulateNetworkDelay } from "./network";
import { queryKeys } from "./query-keys";

import type {
  GrantPointsInput,
  UpdateMemberInput,
  UpdateProgramConfigInput,
  UpdateRewardInput,
} from "./api";

export function useMembersQuery() {
  return useQuery({
    queryKey: queryKeys.members,
    queryFn: fetchMembers,
  });
}

export function useRewardsQuery() {
  return useQuery({
    queryKey: queryKeys.rewards,
    queryFn: fetchRewards,
  });
}

export function useActivityQuery() {
  return useQuery({
    queryKey: queryKeys.activity,
    queryFn: fetchActivity,
  });
}

export function useSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: fetchProgramConfig,
  });
}

export function useOverviewQuery() {
  return useQuery({
    queryKey: queryKeys.overview,
    queryFn: fetchOverviewData,
  });
}

export function useHomeQuery() {
  return useQuery({
    queryKey: queryKeys.home,
    queryFn: fetchHomeData,
  });
}

export function useMemberDetailQuery() {
  return useQuery({
    queryKey: queryKeys.memberDetail,
    queryFn: fetchMemberDetailData,
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateMemberInput) => {
      await simulateNetworkDelay();
      applyUpdateMember(queryClient, input);
    },
  });
}

export function useGrantPointsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: GrantPointsInput) => {
      await simulateNetworkDelay();
      applyGrantPoints(queryClient, input);
    },
  });
}

export function useUpdateRewardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRewardInput) => {
      await simulateNetworkDelay();
      applyUpdateReward(queryClient, input);
    },
  });
}

export function useArchiveRewardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await simulateNetworkDelay();
      applyArchiveReward(queryClient, id);
    },
  });
}

export function useArchiveRewardsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await simulateNetworkDelay();
      applyArchiveRewards(queryClient, ids);
    },
  });
}

export function useUpdateProgramConfigMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProgramConfigInput) => {
      await simulateNetworkDelay();
      applyUpdateProgramConfig(queryClient, input);
    },
  });
}
