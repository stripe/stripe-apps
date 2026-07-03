import { MeterChart } from "@stripe/ui-extension-sdk/ui/next";
import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";

type TierDatum = {
  label: string;
  value: number;
};

type MembersByTierModuleProps = {
  tierData: TierDatum[];
};

export function MembersByTierModule({ tierData }: MembersByTierModuleProps) {
  return (
    <PageModule title="Members by tier">
      <MeterChart
        data={tierData}
        legendEnabled
        unitFormat={{ unit: "number", options: {} }}
      />
    </PageModule>
  );
}
