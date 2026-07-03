import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import type { Member } from "@/data";
import { FieldGrid } from "@/components/FieldGrid";
import { formatDate } from "@/utils/date";

type DetailsModuleProps = {
  member: Member;
};

export function DetailsModule({ member }: DetailsModuleProps) {
  return (
    <PageModule title="Details">
      <FieldGrid>
        <FieldGrid.Field label="Email" value={member.email} />
        <FieldGrid.Field
          label="Member since"
          value={formatDate(member.joinedDate)}
        />
      </FieldGrid>
    </PageModule>
  );
}
