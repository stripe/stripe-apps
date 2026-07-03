import { useState } from "react";
import {
  Box,
  Divider,
  Icon,
  Inline,
  Link,
  Menu,
  MenuItem,
  OverviewPage,
  PageModule,
} from "@stripe/ui-extension-sdk/ui";
import {
  BarChart,
  LineChart,
  MeterChart,
} from "@stripe/ui-extension-sdk/ui/next";
import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";

import {
  pointsToDollars,
  TierName,
  useMembersQuery,
  useOverviewQuery,
  useSettingsQuery,
} from "@/data";
import { formatTimestamp } from "@/utils/date";
import { formatCurrency, formatPoints } from "@/utils/format";
import { useQueuedToast } from "@/hooks/useQueuedToast";

// Trend data is chronological Feb 2025 → Feb 2026. Assign years by tracking
// when months roll back to Jan (the start of 2026 in our data).
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

const GrowthIndicator = ({ pct }: { pct: number | null }) => {
  if (pct === null) return null;
  const isPositive = pct >= 0;
  const formatted = `${isPositive ? "+" : ""}${pct.toFixed(1)}%`;
  return (
    <Inline
      css={{
        font: "caption",
        fontWeight: "bold",
        color: isPositive ? "success" : "critical",
      }}
    >
      {formatted}
    </Inline>
  );
};

export function OverviewTab() {
  const { data, isLoading, isError, error } = useOverviewQuery();
  const { data: members } = useMembersQuery();
  const { data: settings } = useSettingsQuery();
  const { queueToast } = useQueuedToast();
  const [timeHorizon, setTimeHorizon] = useState("4");

  if (isLoading) {
    return <Box css={{ font: "caption", color: "secondary" }}>Loading…</Box>;
  }

  if (isError) {
    return (
      <Box css={{ font: "caption", color: "critical" }}>
        {error.message ?? "Something went wrong"}
      </Box>
    );
  }

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

  // Current and previous period values for growth indicators
  const prevMembersTrend = membersTrend.slice(-weeksToShow * 2, -weeksToShow);
  const prevRevenueTrend = revenueTrend.slice(-weeksToShow * 2, -weeksToShow);
  const prevRedemptionsTrend = redemptionsTrend.slice(
    -weeksToShow * 2,
    -weeksToShow,
  );
  const currRedemptionsTrend = redemptionsTrend.slice(-weeksToShow);

  const currentMembers =
    slicedMembersTrend[slicedMembersTrend.length - 1]?.value ?? 0;
  const prevMembers = prevMembersTrend[prevMembersTrend.length - 1]?.value ?? 0;

  const currentRevenue = slicedRevenueTrend.reduce((s, d) => s + d.value, 0);
  const prevRevenue = prevRevenueTrend.reduce((s, d) => s + d.value, 0);

  const currentRedemptions = currRedemptionsTrend.reduce(
    (s, d) => s + d.value,
    0,
  );
  const prevRedemptions = prevRedemptionsTrend.reduce((s, d) => s + d.value, 0);

  const currLiability = pointsLiabilityTrend.slice(-weeksToShow);
  const prevLiability = pointsLiabilityTrend.slice(
    -weeksToShow * 2,
    -weeksToShow,
  );
  const currentLiabilityValue =
    currLiability[currLiability.length - 1]?.value ?? 0;
  const prevLiabilityValue =
    prevLiability[prevLiability.length - 1]?.value ?? 0;

  // For 12-month view, aggregate weekly data into monthly buckets
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

  const isYearView = weeksToShow === 52;
  const filteredMembersTrend = isYearView
    ? aggregateMonthly(slicedMembersTrend, "last")
    : slicedMembersTrend;
  const filteredRevenueTrend = isYearView
    ? aggregateMonthly(slicedRevenueTrend, "sum")
    : slicedRevenueTrend;

  const tierData = MEMBER_TIERS.map((tier) => ({
    label: tier,
    value: members?.filter((member) => member.tier === tier).length ?? 0,
  }));

  return (
    <OverviewPage
      primaryColumn={
        <>
          <PageModule title="Program summary">
            <Menu
              onAction={(key) => setTimeHorizon(String(key))}
              trigger={
                <Link>
                  <Box
                    css={{
                      stack: "x",
                      alignY: "center",
                      gap: "xsmall",
                      paddingX: "small",
                      paddingY: "xxsmall",
                      borderRadius: "rounded",
                      borderColor: "neutral",
                      borderStyle: "solid",
                      borderWidth: 1,
                      font: "caption",
                    }}
                  >
                    <Inline
                      css={{ color: "secondary", fontWeight: "semibold" }}
                    >
                      Date range
                    </Inline>
                    <Inline css={{ color: "secondary" }}>|</Inline>
                    <Inline css={{ fontWeight: "semibold" }}>
                      {timeHorizon === "4"
                        ? "Last 4 weeks"
                        : timeHorizon === "12"
                          ? "Last 12 weeks"
                          : "Last 12 months"}
                    </Inline>
                  </Box>
                </Link>
              }
            >
              <MenuItem key="4" id="4">
                Last 4 weeks
              </MenuItem>
              <MenuItem key="12" id="12">
                Last 12 weeks
              </MenuItem>
              <MenuItem key="52" id="52">
                Last 12 months
              </MenuItem>
            </Menu>
            <Box
              css={{
                marginTop: "medium",
                stack: "x",
                gap: "large",
                distribute: "space-between",
              }}
            >
              <Box css={{ stack: "y", gap: "xxsmall" }}>
                <Inline css={{ font: "caption", color: "secondary" }}>
                  Total members
                </Inline>
                <Box css={{ stack: "x", gap: "xsmall", alignY: "baseline" }}>
                  <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
                    {currentMembers}
                  </Inline>
                  <GrowthIndicator
                    pct={pctChange(currentMembers, prevMembers)}
                  />
                </Box>
              </Box>
              <Box css={{ stack: "y", gap: "xxsmall" }}>
                <Inline css={{ font: "caption", color: "secondary" }}>
                  Revenue
                </Inline>
                <Box css={{ stack: "x", gap: "xsmall", alignY: "baseline" }}>
                  <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
                    {formatCurrency(currentRevenue, settings?.currency)}
                  </Inline>
                  <GrowthIndicator
                    pct={pctChange(currentRevenue, prevRevenue)}
                  />
                </Box>
              </Box>
              <Box css={{ stack: "y", gap: "xxsmall" }}>
                <Inline css={{ font: "caption", color: "secondary" }}>
                  Rewards claimed
                </Inline>
                <Box css={{ stack: "x", gap: "xsmall", alignY: "baseline" }}>
                  <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
                    {currentRedemptions}
                  </Inline>
                  <GrowthIndicator
                    pct={pctChange(currentRedemptions, prevRedemptions)}
                  />
                </Box>
              </Box>
              <Box css={{ stack: "y", gap: "xxsmall" }}>
                <Inline css={{ font: "caption", color: "secondary" }}>
                  Points liability
                </Inline>
                <Box css={{ stack: "x", gap: "xsmall", alignY: "baseline" }}>
                  <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
                    {formatCurrency(
                      pointsToDollars(
                        currentLiabilityValue,
                        settings?.pointsPerDollar,
                      ),
                      settings?.currency,
                    )}
                  </Inline>
                  <GrowthIndicator
                    pct={pctChange(currentLiabilityValue, prevLiabilityValue)}
                  />
                </Box>
              </Box>
            </Box>
          </PageModule>

          {/* Charts in container card */}
          <Box
            css={{
              stack: "y",
              gap: "small",
              padding: "small",
              borderRadius: "medium",
              backgroundColor: "container",
            }}
          >
            <Box
              css={{
                stack: "y",
                gap: "xsmall",
                padding: "medium",
                borderRadius: "medium",
                backgroundColor: "surface",
              }}
            >
              <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
                Member growth
              </Inline>
              <Box css={{ height: 182 }}>
                <LineChart
                  data={
                    isYearView
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
                        }))
                  }
                />
              </Box>
            </Box>

            <Box
              css={{
                stack: "y",
                gap: "xsmall",
                padding: "medium",
                borderRadius: "medium",
                backgroundColor: "surface",
              }}
            >
              <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
                Revenue from members
              </Inline>
              <Box css={{ height: 182 }}>
                <BarChart
                  data={
                    isYearView
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
                        }))
                  }
                />
              </Box>
            </Box>
          </Box>
        </>
      }
      secondaryColumn={
        <>
          <PageModule title="Members by tier">
            <MeterChart
              data={tierData}
              legendEnabled
              unitFormat={{ unit: "number", options: {} }}
            />
          </PageModule>

          <PageModule title="Recent activity">
            <Box css={{ stack: "y", gap: "small" }}>
              {recentTransactions.map((txn, i) => (
                <Box key={txn.id} css={{ stack: "y", gap: "small" }}>
                  {i > 0 && <Divider />}
                  <Box
                    css={{
                      stack: "x",
                      distribute: "space-between",
                      alignY: "center",
                    }}
                  >
                    <Box css={{ stack: "y" }}>
                      <Box css={{ fontWeight: "semibold" }}>
                        {txn.memberName}
                      </Box>
                      <Box css={{ font: "caption", color: "secondary" }}>
                        {formatTimestamp(txn.timestamp)}
                      </Box>
                    </Box>
                    <Inline
                      css={{
                        fontWeight: "semibold",
                        color: txn.type === "earned" ? "success" : "info",
                      }}
                    >
                      {txn.type === "earned" ? "+" : "-"}
                      {formatPoints(txn.points)}
                    </Inline>
                  </Box>
                </Box>
              ))}
              <Divider />
              <Inline css={{ font: "caption", color: "secondary" }}>
                View the Activity tab for full history
              </Inline>
            </Box>
          </PageModule>

          <PageModule title="Quick actions">
            <Box css={{ stack: "y", gap: "small" }}>
              <Link
                href="https://dashboard.stripe.com/products"
                target="_blank"
              >
                Create reward
              </Link>
              <Link
                onPress={() => queueToast("Member data exported", "success")}
              >
                Export member list
              </Link>
              <Link href="https://stripe.com/docs" target="_blank">
                <Box css={{ stack: "x", gap: "xsmall", alignY: "center" }}>
                  <Inline>Learn about loyalty programs</Inline>
                  <Icon name="external" size="xsmall" />
                </Box>
              </Link>
            </Box>
          </PageModule>
        </>
      }
    />
  );
}
