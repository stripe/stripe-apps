export function memberTierRoute(tier: string) {
  return {
    key: "home" as const,
    params: { tabId: "members" },
    searchParams: { tier },
  };
}
