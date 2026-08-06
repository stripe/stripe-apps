import { Box, OverviewPage } from "@stripe/ui-extension-sdk/ui";

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
    pending,
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

  if (isError) {
    return (
      <Box css={{ font: "caption", color: "critical" }}>
        {error?.message ?? "Something went wrong"}
      </Box>
    );
  }

  return (
    <OverviewPage
      pending={pending}
      primaryColumn={
        <>
          {summary ? (
            <ProgramSummaryModule
              timeHorizonLabel={timeHorizonLabel}
              onTimeHorizonChange={onTimeHorizonChange}
              summary={summary}
              currency={settings?.currency}
            />
          ) : null}
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
