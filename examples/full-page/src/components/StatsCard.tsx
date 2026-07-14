import { Box, Inline } from "@stripe/ui-extension-sdk/ui";
import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
};

function StatCardInternal({ label, value }: StatCardProps) {
  return (
    <Box
      css={{
        stack: "y",
        gap: "xxsmall",
        padding: "medium",
        borderRadius: "medium",
        backgroundColor: "surface",
      }}
    >
      <Inline css={{ font: "caption", color: "secondary" }}>{label}</Inline>
      <Inline css={{ font: "subtitle", fontWeight: "bold" }}>{value}</Inline>
    </Box>
  );
}

type StatCardRowProps = {
  children: ReactNode;
};

function StatCardRow({ children }: StatCardRowProps) {
  return (
    <Box
      css={{
        stack: "x",
        gap: "small",
        padding: "small",
        borderRadius: "medium",
        backgroundColor: "container",
      }}
    >
      {children}
    </Box>
  );
}

export const StatCard = Object.assign(StatCardInternal, { Row: StatCardRow });
