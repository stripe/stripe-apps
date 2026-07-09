import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import type { Member, ProgramConfig, Transaction } from "@/data";
import { FieldGrid } from "@/components/FieldGrid";
import { formatCurrency, formatPoints } from "@/utils/format";

type MemberDetailsModuleProps = {
  transaction: Transaction;
  member?: Member;
  currency?: ProgramConfig["currency"];
};

export function MemberDetailsModule({
  transaction,
  member,
  currency,
}: MemberDetailsModuleProps) {
  return (
    <PageModule title="Member">
      <FieldGrid>
        <FieldGrid.Field label="Email" value={transaction.memberEmail} />
        {member && <FieldGrid.Field label="Tier" value={member.tier} />}
        {member && (
          <FieldGrid.Field
            label="Current balance"
            value={`${formatPoints(member.points)} points`}
          />
        )}
        {member && (
          <FieldGrid.Field
            label="Lifetime spend"
            value={formatCurrency(member.lifetimeSpend, currency)}
          />
        )}
      </FieldGrid>
    </PageModule>
  );
}
