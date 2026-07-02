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
import { simulateNetworkDelay, withNetworkDelay } from "./network";
import type { ProgramConfig } from "./config";
import type { Member, Reward, Transaction, TrendPoint } from "./types";

export type OverviewData = {
  activity: Transaction[];
  membersTrend: TrendPoint[];
  revenueTrend: TrendPoint[];
  redemptionsTrend: TrendPoint[];
  pointsLiabilityTrend: TrendPoint[];
};

export type HomeData = {
  members: Member[];
  rewards: Reward[];
};

export type MemberDetailData = {
  activity: Transaction[];
  rewards: Reward[];
};

export type UpdateMemberInput = {
  id: string;
  name: string;
  email: string;
  lifetimeSpend: number;
};

export type GrantPointsInput = {
  memberId: string;
  points: number;
  reason?: string;
};

export type UpdateRewardInput = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: Reward["category"];
  available: boolean;
};

export type UpdateProgramConfigInput = {
  name: string;
  pointsPerDollar: number;
  currency: ProgramConfig["currency"];
  engagementWindows: {
    active: number;
    atRisk: number;
  };
};

export function fetchMembers(): Promise<Member[]> {
  return withNetworkDelay([...membersData]);
}

export function fetchRewards(): Promise<Reward[]> {
  return withNetworkDelay([...rewardsData]);
}

export function fetchActivity(): Promise<Transaction[]> {
  return withNetworkDelay([...activityData]);
}

export function fetchProgramConfig(): Promise<ProgramConfig> {
  return withNetworkDelay({ ...initialProgramConfig });
}

export async function fetchOverviewData(): Promise<OverviewData> {
  await simulateNetworkDelay();
  return {
    activity: [...activityData],
    membersTrend,
    revenueTrend,
    redemptionsTrend,
    pointsLiabilityTrend,
  };
}

export async function fetchHomeData(): Promise<HomeData> {
  await simulateNetworkDelay();
  return {
    members: [...membersData],
    rewards: [...rewardsData],
  };
}

export async function fetchMemberDetailData(): Promise<MemberDetailData> {
  await simulateNetworkDelay();
  return {
    activity: [...activityData],
    rewards: [...rewardsData],
  };
}
