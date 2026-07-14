import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import type { ProgramConfig, Reward } from "@/data";
import { StatCard } from "@/components/StatsCard";
import { formatCurrency, formatPoints } from "@/utils/format";

type SummaryModuleProps = {
  reward: Reward;
  dollarValue: number;
  pointsRedeemed: number;
  currency?: ProgramConfig["currency"];
};

export function SummaryModule({
  reward,
  dollarValue,
  pointsRedeemed,
  currency,
}: SummaryModuleProps) {
  return (
    <PageModule title="Summary">
      <StatCard.Row>
        <StatCard label="Points cost" value={formatPoints(reward.pointsCost)} />
        <StatCard
          label="Dollar value"
          value={formatCurrency(dollarValue, currency)}
        />
        <StatCard label="Redemptions" value={reward.redemptionCount} />
        <StatCard
          label="Points redeemed"
          value={formatPoints(pointsRedeemed)}
        />
      </StatCard.Row>
    </PageModule>
  );
}
