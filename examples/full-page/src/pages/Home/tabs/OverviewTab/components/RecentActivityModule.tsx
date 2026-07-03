import { Box, Divider, Inline } from "@stripe/ui-extension-sdk/ui";
import { PageModule } from "@stripe/ui-extension-sdk/ui/experimental";
import type { Transaction } from "@/data";
import { formatTimestamp } from "@/utils/date";
import { formatPoints } from "@/utils/format";

type RecentActivityModuleProps = {
  transactions: Transaction[];
};

export function RecentActivityModule({
  transactions,
}: RecentActivityModuleProps) {
  return (
    <PageModule title="Recent activity">
      <Box css={{ stack: "y", gap: "small" }}>
        {transactions.map((txn, i) => (
          <Box key={txn.id} css={{ stack: "y", gap: "small" }}>
            {i > 0 && <Divider />}
            <Box
              css={{
                stack: "x",
                distribute: "space-between",
                alignY: "center",
              }}
            >
              <Box css={{ stack: "y" }}>
                <Box css={{ fontWeight: "semibold" }}>{txn.memberName}</Box>
                <Box css={{ font: "caption", color: "secondary" }}>
                  {formatTimestamp(txn.timestamp)}
                </Box>
              </Box>
              <Inline
                css={{
                  fontWeight: "semibold",
                  color: txn.type === "earned" ? "success" : "info",
                }}
              >
                {txn.type === "earned" ? "+" : "-"}
                {formatPoints(txn.points)}
              </Inline>
            </Box>
          </Box>
        ))}
        <Divider />
        <Inline css={{ font: "caption", color: "secondary" }}>
          View the Activity tab for full history
        </Inline>
      </Box>
    </PageModule>
  );
}
