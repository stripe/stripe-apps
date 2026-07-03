import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import { FieldGrid } from "@/components/FieldGrid";

type OrderModuleProps = {
  orderId: string;
};

export function OrderModule({ orderId }: OrderModuleProps) {
  return (
    <PageModule title="Order">
      <FieldGrid>
        <FieldGrid.Field label="Order ID" value={orderId} />
      </FieldGrid>
    </PageModule>
  );
}
