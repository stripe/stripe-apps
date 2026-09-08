import { MeterChart } from "@stripe/ui-extension-sdk/ui/next";
import { PageModule } from "@stripe/ui-extension-sdk/ui";
import { useNavigation } from "@stripe/ui-extension-sdk/navigation";

import { memberTierRoute } from "./memberTierRoute";

type TierDatum = {
  label: string;
  value: number;
};

type MembersByTierModuleProps = {
  tierData: TierDatum[];
};

export function MembersByTierModule({ tierData }: MembersByTierModuleProps) {
  const { navigateToAppRoute } = useNavigation();

  return (
    <PageModule title="Members by tier">
      <MeterChart
        data={tierData}
        legendEnabled
        unitFormat={{ unit: "number", options: {} }}
        onSegmentClick={({ data }) => {
          if (!data) return;
          // Open the Members tab pre-filtered to the clicked tier by passing
          // the tier through the route's search params (e.g. ?tier=Barista).
          navigateToAppRoute(memberTierRoute(data.label));
        }}
      />
    </PageModule>
  );
}
