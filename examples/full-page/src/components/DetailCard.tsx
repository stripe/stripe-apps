import { Box } from "@stripe/ui-extension-sdk/ui";
import { ReactNode } from "react";

type DetailCardProps = {
  title: string;
  children: ReactNode;
};

export function DetailCard({ title, children }: DetailCardProps) {
  return (
    <Box css={{ stack: "y", gap: "small" }}>
      <Box css={{ font: "heading", fontWeight: "semibold" }}>{title}</Box>
      {children}
    </Box>
  );
}
