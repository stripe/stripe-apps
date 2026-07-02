// =============================================================================
// LOYALTY PROGRAM DATA
// =============================================================================

import { getDaysSince } from "@/utils/date";

import { initialProgramConfig } from "./config";

export type {
  HomeData,
  MemberDetailData,
  OverviewData,
  UpdateMemberInput,
  GrantPointsInput,
  UpdateRewardInput,
  UpdateProgramConfigInput,
} from "./api";

export type { ProgramConfig } from "./config";

export type {
  Member,
  Reward,
  TierName,
  Transaction,
  TrendPoint,
} from "./types";

export {
  useActivityQuery,
  useArchiveRewardMutation,
  useArchiveRewardsMutation,
  useGrantPointsMutation,
  useHomeQuery,
  useMemberDetailQuery,
  useMembersQuery,
  useOverviewQuery,
  useRewardsQuery,
  useSettingsQuery,
  useUpdateMemberMutation,
  useUpdateProgramConfigMutation,
  useUpdateRewardMutation,
} from "./queries";

// -----------------------------------------------------------------------------
// DERIVED DATA HELPERS
// -----------------------------------------------------------------------------

import type { Member } from "./types";
import type { ProgramConfig } from "./config";

/**
 * Get member engagement status based on last order date
 */
export function getMemberEngagementStatus(
  member: Member,
  engagementWindows: ProgramConfig["engagementWindows"] = initialProgramConfig
    .engagementWindows,
): "active" | "at-risk" | "dormant" {
  const days = getDaysSince(member.lastOrder);
  if (days <= engagementWindows.active) return "active";
  if (days <= engagementWindows.atRisk) return "at-risk";
  return "dormant";
}

/**
 * Convert points to dollar value
 */
export function pointsToDollars(
  points: number,
  pointsPerDollar: number = initialProgramConfig.pointsPerDollar,
): number {
  return points / pointsPerDollar;
}
