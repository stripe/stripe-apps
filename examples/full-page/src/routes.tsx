import { createRoutes, route } from "@stripe/ui-extension-sdk/navigation";

import { Home } from "./pages/Home";
import { MemberDetailPage } from "./pages/MemberDetail";
import { RewardDetailPage } from "./pages/RewardDetail";
import { TransactionDetailPage } from "./pages/TransactionDetail";

export const routes = createRoutes({
  home: route("/:tabId?", () => <Home />),
  member: route("/members/:id", ({ id }) => <MemberDetailPage id={id} />),
  reward: route("/rewards/:id", ({ id }) => <RewardDetailPage id={id} />),
  transaction: route("/activity/:id", ({ id }) => (
    <TransactionDetailPage id={id} />
  )),
});

declare module "@stripe/ui-extension-sdk/navigation" {
  interface RouteRegister {
    routes: typeof routes;
  }
}
