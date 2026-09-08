import {
  createRoutes,
  Redirect,
  route,
} from "@stripe/ui-extension-sdk/navigation";

import { Home } from "./pages/Home";
import { MemberDetailPage } from "./pages/MemberDetail";
import { RewardDetailPage } from "./pages/RewardDetail";
import { TransactionDetailPage } from "./pages/TransactionDetail";

export const routes = createRoutes({
  home: route("/:tabId?", (_params, context) => <Home context={context} />),
  member: route("/members/:id", ({ id }) => <MemberDetailPage id={id} />),
  reward: route("/rewards/:id", ({ id }) => <RewardDetailPage id={id} />),
  transaction: route("/activity/:id", ({ id }) => (
    <TransactionDetailPage id={id} />
  )),

  // Legacy route (Pizzazz v0.9)
  // v0.9 called them "customers"; v1.0 renamed to "members".
  // Keep this so bookmarked /customers/:id links still open the right member.
  legacyCustomer: route("/customers/:id", ({ id }) => (
    <Redirect route={{ key: "member", params: { id } }} />
  )),
});

declare module "@stripe/ui-extension-sdk/navigation" {
  interface RouteRegister {
    routes: typeof routes;
  }
}
