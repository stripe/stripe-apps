import type { ProgramConfig } from "@/data/config";

export function formatCurrency(
  amount: number,
  currency: ProgramConfig["currency"] = "usd",
): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPoints(points: number): string {
  return points.toLocaleString();
}
