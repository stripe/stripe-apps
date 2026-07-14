import { Box, Inline, Link, Menu, MenuItem } from "@stripe/ui-extension-sdk/ui";
import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";

import { formatCurrency } from "@/utils/format";
import type { OverviewSummary } from "../hooks/useOverviewTab";
import { GrowthIndicator } from "./GrowthIndicator";
import type { ProgramConfig } from "@/data";

type ProgramSummaryModuleProps = {
  timeHorizonLabel: string;
  onTimeHorizonChange: (value: string) => void;
  summary: OverviewSummary;
  currency?: ProgramConfig["currency"];
};

export function ProgramSummaryModule({
  timeHorizonLabel,
  onTimeHorizonChange,
  summary,
  currency,
}: ProgramSummaryModuleProps) {
  return (
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
              <Inline css={{ color: "secondary", fontWeight: "semibold" }}>
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
          <Inline css={{ font: "caption", color: "secondary" }}>Revenue</Inline>
          <Box css={{ stack: "x", gap: "xsmall", alignY: "baseline" }}>
            <Inline css={{ font: "subtitle", fontWeight: "bold" }}>
              {formatCurrency(summary.revenue.value, currency)}
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
              {formatCurrency(summary.pointsLiability.value, currency)}
            </Inline>
            <GrowthIndicator pct={summary.pointsLiability.pct} />
          </Box>
        </Box>
      </Box>
    </PageModule>
  );
}
