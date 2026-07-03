import { Inline } from "@stripe/ui-extension-sdk/ui";

type GrowthIndicatorProps = {
  pct: number | null;
};

export function GrowthIndicator({ pct }: GrowthIndicatorProps) {
  if (pct === null) return null;
  const isPositive = pct >= 0;
  const formatted = `${isPositive ? "+" : ""}${pct.toFixed(1)}%`;
  return (
    <Inline
      css={{
        font: "caption",
        fontWeight: "bold",
        color: isPositive ? "success" : "critical",
      }}
    >
      {formatted}
    </Inline>
  );
}
