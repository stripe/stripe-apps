import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import type { Reward } from "@/data";
import { FieldGrid } from "@/components/FieldGrid";

type DetailsModuleProps = {
  reward: Reward;
  categoryLabel: string;
};

export function DetailsModule({ reward, categoryLabel }: DetailsModuleProps) {
  return (
    <PageModule title="Details">
      <FieldGrid>
        <FieldGrid.Field label="Category" value={categoryLabel} />
        <FieldGrid.Field
          label="Status"
          value={reward.available ? "Available" : "Out of stock"}
        />
      </FieldGrid>
    </PageModule>
  );
}
