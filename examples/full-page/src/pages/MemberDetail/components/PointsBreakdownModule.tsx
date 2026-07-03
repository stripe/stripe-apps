import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import { FieldGrid } from "@/components/FieldGrid";
import { formatPoints } from "@/utils/format";

type PointsBreakdownModuleProps = {
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  pointsToNextReward: number;
};

export function PointsBreakdownModule({
  lifetimeEarned,
  lifetimeRedeemed,
  pointsToNextReward,
}: PointsBreakdownModuleProps) {
  return (
    <PageModule title="Points breakdown">
      <FieldGrid>
        <FieldGrid.Field
          label="Lifetime earned"
          value={formatPoints(lifetimeEarned)}
        />
        <FieldGrid.Field
          label="Lifetime redeemed"
          value={formatPoints(lifetimeRedeemed)}
        />
        <FieldGrid.Field
          label="Points to next reward"
          value={
            pointsToNextReward === 0
              ? "Eligible now"
              : formatPoints(pointsToNextReward)
          }
        />
      </FieldGrid>
    </PageModule>
  );
}
