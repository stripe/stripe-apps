import { memberTierRoute } from "./memberTierRoute";

describe("memberTierRoute", () => {
  it("keeps the selected tier in the URL search params", () => {
    expect(memberTierRoute("Barista")).toEqual({
      key: "home",
      params: { tabId: "members" },
      searchParams: { tier: "Barista" },
    });
  });
});
