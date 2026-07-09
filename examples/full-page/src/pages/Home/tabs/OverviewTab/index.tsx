import { Box, OverviewPage, Spinner } from "@stripe/ui-extension-sdk/ui";

import { useQueuedToast } from "@/hooks/useQueuedToast";
import { ChartsModule } from "./components/ChartsModule";
import { MembersByTierModule } from "./components/MembersByTierModule";
import { ProgramSummaryModule } from "./components/ProgramSummaryModule";
import { QuickActionsModule } from "./components/QuickActionsModule";
import { RecentActivityModule } from "./components/RecentActivityModule";
import { useOverviewTab } from "./hooks/useOverviewTab";

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
    return (
      <Box
        css={{
          stack: "y",
          alignX: "center",
          alignY: "center",
          height: "fill",
          paddingTop: "xxlarge",
        }}
      >
        <Spinner size="large" />
      </Box>
    );
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
          <ProgramSummaryModule
            timeHorizonLabel={timeHorizonLabel}
            onTimeHorizonChange={onTimeHorizonChange}
            summary={summary}
            currency={settings?.currency}
          />
          <ChartsModule
            memberGrowthChartData={memberGrowthChartData}
            revenueChartData={revenueChartData}
          />
        </>
      }
      secondaryColumn={
        <>
          <QuickActionsModule
            onExportMembers={() =>
              queueToast("Member data exported", "success")
            }
          />
          <MembersByTierModule tierData={tierData} />
          <RecentActivityModule transactions={recentTransactions} />
        </>
      }
    />
  );
}
