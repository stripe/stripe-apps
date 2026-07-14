import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import type { Member, ProgramConfig } from "@/data";
import { StatCard } from "@/components/StatsCard";
import { formatCurrency, formatPoints } from "@/utils/format";

type SummaryModuleProps = {
  member: Member;
  totalOrders: number;
  currency?: ProgramConfig["currency"];
};

export function SummaryModule({
  member,
  totalOrders,
  currency,
}: SummaryModuleProps) {
  return (
    <PageModule title="Summary">
      <StatCard.Row>
        <StatCard label="Points balance" value={formatPoints(member.points)} />
        <StatCard label="Tier" value={member.tier} />
        <StatCard
          label="Lifetime spend"
          value={formatCurrency(member.lifetimeSpend, currency)}
        />
        <StatCard label="Total orders" value={totalOrders} />
      </StatCard.Row>
    </PageModule>
  );
}
