import { useCallback, useMemo, useState } from "react";
import {
  pointsToDollars,
  useMembersQuery,
  useOverviewQuery,
  useSettingsQuery,
  type TierName,
} from "@/data";

const assignYears = <T extends { week: string }>(data: T[]) => {
  let year = 2025;
  let prevMonth = -1;
  return data.map((d) => {
    const monthNum = new Date(`${d.week} 2025`).getMonth();
    if (monthNum < prevMonth) year = 2026;
    prevMonth = monthNum;
    return { ...d, date: new Date(`${d.week} ${year}`) };
  });
};

const pctChange = (current: number, previous: number): number | null => {
  if (previous === 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
};

const MEMBER_TIERS: TierName[] = ["Bean Counter", "Barista", "Roastmaster"];

const aggregateMonthly = <T extends { week: string; value: number }>(
  data: T[],
  mode: "sum" | "last",
) => {
  const withYears = assignYears(data);
  const months = new Map<string, number[]>();
  for (const d of withYears) {
    const key = d.date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    const existing = months.get(key);
    if (existing) {
      existing.push(d.value);
    } else {
      months.set(key, [d.value]);
    }
  }
  return Array.from(months.entries()).map(([month, values]) => ({
    label: month,
    value:
      mode === "sum"
        ? values.reduce((a, b) => a + b, 0)
        : values[values.length - 1],
  }));
};

const TIME_HORIZON_LABELS: Record<string, string> = {
  "4": "Last 4 weeks",
  "12": "Last 12 weeks",
  "52": "Last 12 months",
};

export type OverviewSummaryMetric = {
  value: number;
  pct: number | null;
};

export type OverviewSummary = {
  totalMembers: OverviewSummaryMetric;
  revenue: OverviewSummaryMetric;
  redemptions: OverviewSummaryMetric;
  pointsLiability: OverviewSummaryMetric;
};

export function useOverviewTab() {
  const { data, isLoading, isError, error } = useOverviewQuery();
  const { data: members } = useMembersQuery();
  const { data: settings } = useSettingsQuery();
  const [timeHorizon, setTimeHorizon] = useState("4");

  const onTimeHorizonChange = useCallback((value: string) => {
    setTimeHorizon(value);
  }, []);

  const derived = useMemo(() => {
    if (!data) {
      return null;
    }

    const {
      activity,
      membersTrend,
      revenueTrend,
      redemptionsTrend,
      pointsLiabilityTrend,
    } = data;
    const recentTransactions = activity.slice(0, 5);
    const weeksToShow = parseInt(timeHorizon);
    const slicedMembersTrend = membersTrend.slice(-weeksToShow);
    const slicedRevenueTrend = revenueTrend.slice(-weeksToShow);
    const prevMembersTrend = membersTrend.slice(-weeksToShow * 2, -weeksToShow);
    const prevRevenueTrend = revenueTrend.slice(-weeksToShow * 2, -weeksToShow);
    const prevRedemptionsTrend = redemptionsTrend.slice(
      -weeksToShow * 2,
      -weeksToShow,
    );
    const currRedemptionsTrend = redemptionsTrend.slice(-weeksToShow);

    const currentMembers =
      slicedMembersTrend[slicedMembersTrend.length - 1]?.value ?? 0;
    const prevMembers =
      prevMembersTrend[prevMembersTrend.length - 1]?.value ?? 0;
    const currentRevenue = slicedRevenueTrend.reduce((s, d) => s + d.value, 0);
    const prevRevenue = prevRevenueTrend.reduce((s, d) => s + d.value, 0);
    const currentRedemptions = currRedemptionsTrend.reduce(
      (s, d) => s + d.value,
      0,
    );
    const prevRedemptions = prevRedemptionsTrend.reduce(
      (s, d) => s + d.value,
      0,
    );

    const currLiability = pointsLiabilityTrend.slice(-weeksToShow);
    const prevLiability = pointsLiabilityTrend.slice(
      -weeksToShow * 2,
      -weeksToShow,
    );
    const currentLiabilityValue =
      currLiability[currLiability.length - 1]?.value ?? 0;
    const prevLiabilityValue =
      prevLiability[prevLiability.length - 1]?.value ?? 0;

    const isYearView = weeksToShow === 52;
    const filteredMembersTrend = isYearView
      ? aggregateMonthly(slicedMembersTrend, "last")
      : slicedMembersTrend;
    const filteredRevenueTrend = isYearView
      ? aggregateMonthly(slicedRevenueTrend, "sum")
      : slicedRevenueTrend;

    const memberGrowthChartData = isYearView
      ? (
          filteredMembersTrend as {
            label: string;
            value: number;
          }[]
        ).map((d) => ({
          x: new Date(`1 ${d.label}`),
          y: d.value,
          name: "Members",
        }))
      : assignYears(slicedMembersTrend).map((d) => ({
          x: d.date,
          y: d.value,
          name: "Members",
        }));

    const revenueChartData = isYearView
      ? (
          filteredRevenueTrend as {
            label: string;
            value: number;
          }[]
        ).map((d) => ({
          x: d.label,
          y: d.value,
          name: "Revenue",
        }))
      : slicedRevenueTrend.map((d) => ({
          x: d.week,
          y: d.value,
          name: "Revenue",
        }));

    const tierData = MEMBER_TIERS.map((tier) => ({
      label: tier,
      value: members?.filter((member) => member.tier === tier).length ?? 0,
    }));

    return {
      recentTransactions,
      isYearView,
      tierData,
      memberGrowthChartData,
      revenueChartData,
      summary: {
        totalMembers: {
          value: currentMembers,
          pct: pctChange(currentMembers, prevMembers),
        },
        revenue: {
          value: currentRevenue,
          pct: pctChange(currentRevenue, prevRevenue),
        },
        redemptions: {
          value: currentRedemptions,
          pct: pctChange(currentRedemptions, prevRedemptions),
        },
        pointsLiability: {
          value: pointsToDollars(
            currentLiabilityValue,
            settings?.pointsPerDollar,
          ),
          pct: pctChange(currentLiabilityValue, prevLiabilityValue),
        },
      },
    };
  }, [data, members, settings?.pointsPerDollar, timeHorizon]);

  return {
    isLoading,
    isError,
    error,
    settings,
    timeHorizonLabel: TIME_HORIZON_LABELS[timeHorizon] ?? timeHorizon,
    onTimeHorizonChange,
    recentTransactions: derived?.recentTransactions ?? [],
    tierData: derived?.tierData ?? [],
    memberGrowthChartData: derived?.memberGrowthChartData ?? [],
    revenueChartData: derived?.revenueChartData ?? [],
    summary: derived?.summary ?? null,
  };
}
