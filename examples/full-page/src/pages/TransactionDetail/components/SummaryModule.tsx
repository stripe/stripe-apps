import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import type { Transaction } from "@/data";
import { StatCard } from "@/components/StatsCard";
import { formatTimestamp } from "@/utils/date";

type SummaryModuleProps = {
  transaction: Transaction;
  pointsDisplay: string;
  typeLabel: string;
};

export function SummaryModule({
  transaction,
  pointsDisplay,
  typeLabel,
}: SummaryModuleProps) {
  return (
    <PageModule title="Summary">
      <StatCard.Row>
        <StatCard label="Points" value={pointsDisplay} />
        <StatCard label="Type" value={typeLabel} />
        <StatCard label="Member" value={transaction.memberName} />
        <StatCard
          label="Time"
          value={formatTimestamp(transaction.timestamp)}
        />
      </StatCard.Row>
    </PageModule>
  );
}
