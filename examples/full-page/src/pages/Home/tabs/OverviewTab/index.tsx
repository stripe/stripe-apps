import {
  Box,
  Divider,
  Icon,
  Inline,
  Link,
  Menu,
  MenuItem,
  OverviewPage,
} from "@stripe/ui-extension-sdk/ui";
import {
  BarChart,
  LineChart,
  MeterChart,
} from "@stripe/ui-extension-sdk/ui/next";
import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";

import { formatTimestamp } from "@/utils/date";
import { formatCurrency, formatPoints } from "@/utils/format";
import { useQueuedToast } from "@/hooks/useQueuedToast";
import { useOverviewTab } from "./useOverviewTab";

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
  const { queueToast } = useQueuedToast();
  const {
    isLoading,
    isError,
    error,
    settings,
    timeHorizonLabel,
    onTimeHorizonChange,
    recentTransactions,
    tierData,
    memberGrowthChartData,
    revenueChartData,
    summary,
  } = useOverviewTab();

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

  if (!summary) {
    return null;
  }

  return (
    <OverviewPage
      primaryColumn={
        <>
          <PageModule title="Program summary">
            <Menu
              onAction={(key) => onTimeHorizonChange(String(key))}
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
                      {timeHorizonLabel}
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
                    {summary.totalMembers.value}
                  </Inline>
                  <GrowthIndicator pct={summary.totalMembers.pct} />
                </Box>
              </Box>
              <Box css={{ stack: "y", gap: "xxsmall" }}>
                <Inline css={{ font: "caption", color: "secondary" }}>
                  Revenue
                </Inline>
                <Box css={{ stack: "x", gap: "xsmall", alignY: "baseline" }}>
                  <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
                    {formatCurrency(summary.revenue.value, settings?.currency)}
                  </Inline>
                  <GrowthIndicator pct={summary.revenue.pct} />
                </Box>
              </Box>
              <Box css={{ stack: "y", gap: "xxsmall" }}>
                <Inline css={{ font: "caption", color: "secondary" }}>
                  Rewards claimed
                </Inline>
                <Box css={{ stack: "x", gap: "xsmall", alignY: "baseline" }}>
                  <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
                    {summary.redemptions.value}
                  </Inline>
                  <GrowthIndicator pct={summary.redemptions.pct} />
                </Box>
              </Box>
              <Box css={{ stack: "y", gap: "xxsmall" }}>
                <Inline css={{ font: "caption", color: "secondary" }}>
                  Points liability
                </Inline>
                <Box css={{ stack: "x", gap: "xsmall", alignY: "baseline" }}>
                  <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
                    {formatCurrency(
                      summary.pointsLiability.value,
                      settings?.currency,
                    )}
                  </Inline>
                  <GrowthIndicator pct={summary.pointsLiability.pct} />
                </Box>
              </Box>
            </Box>
          </PageModule>

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
                <LineChart data={memberGrowthChartData} />
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
                <BarChart data={revenueChartData} />
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
