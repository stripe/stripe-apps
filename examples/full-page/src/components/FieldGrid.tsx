import { Box } from "@stripe/ui-extension-sdk/ui";
import type { ReactNode } from "react";

type FieldGridProps = {
  children: ReactNode;
};

function FieldGridInternal({ children }: FieldGridProps) {
  return (
    <Box css={{ stack: "x", gap: "xlarge" }}>
      <Box css={{ width: "1/2", stack: "y", gap: "medium" }}>
        {Array.isArray(children)
          ? children.filter(Boolean).filter((_, i) => i % 2 === 0)
          : children}
      </Box>
      <Box css={{ width: "1/2", stack: "y", gap: "medium" }}>
        {Array.isArray(children)
          ? children.filter(Boolean).filter((_, i) => i % 2 === 1)
          : null}
      </Box>
    </Box>
  );
}

type FieldProps = {
  label: string;
  value: ReactNode;
};

function Field({ label, value }: FieldProps) {
  return (
    <Box css={{ stack: "y", gap: "xxsmall" }}>
      <Box css={{ fontWeight: "bold" }}>{label}</Box>
      <Box>{value}</Box>
    </Box>
  );
}

export const FieldGrid = Object.assign(FieldGridInternal, { Field });
