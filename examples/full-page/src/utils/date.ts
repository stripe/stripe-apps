import { TODAY } from "@/constants";

export function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr);
  const diffMs = TODAY.getTime() - date.getTime();
  return diffMs <= days * 24 * 60 * 60 * 1000 && diffMs >= 0;
}

export function getDaysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const diffTime = TODAY.getTime() - date.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
