import { FullPageView } from "@stripe/ui-extension-sdk/ui";
import { Tab, Tabs } from "@stripe/ui-extension-sdk/ui/next";
import { useRoute } from "@stripe/ui-extension-sdk/navigation";

import { GrantPointsDrawer } from "./components/GrantPointsDrawer";
import { EditMemberDrawer } from "./components/EditMemberDrawer";
import { EditRewardDrawer } from "./components/EditRewardDrawer";
import { ActivityTab } from "./tabs/ActivityTab";
import { MembersTab } from "./tabs/MembersTab";
import { OverviewTab } from "./tabs/OverviewTab";
import { RewardsTab } from "./tabs/RewardsTab";
import { useHome } from "./hooks/useHome";

const DEFAULT_TAB = "overview";
type HomeTabId = "overview" | "members" | "rewards" | "activity";

export function Home() {
  const {
    route: { routeParams, key },
    setRoute,
  } = useRoute();
  const {
    grantDrawer,
    editMemberDrawer,
    editRewardDrawer,
    openEditMember,
    openGrantDrawer,
    openEditReward,
    closeGrantDrawer,
    closeEditMemberDrawer,
    closeEditRewardDrawer,
  } = useHome();

  const currentTab = (key === "home" && routeParams.tabId) || DEFAULT_TAB;

  return (
    <FullPageView
      pageAction={{
        label: "Grant points",
        onPress: () => openGrantDrawer(),
      }}
    >
      <Tabs
        selectedKey={currentTab}
        onSelectionChange={(tabId) =>
          setRoute("home", { tabId: tabId as HomeTabId })
        }
      >
        <Tab id="overview" label="Overview">
          <OverviewTab />
        </Tab>
        <Tab id="members" label="Members">
          <MembersTab
            onGrantPoints={(id) => openGrantDrawer(id)}
            onEdit={(id) => openEditMember(id)}
          />
        </Tab>
        <Tab id="rewards" label="Rewards">
          <RewardsTab onEdit={(id) => openEditReward(id)} />
        </Tab>
        <Tab id="activity" label="Activity">
          <ActivityTab onGrantPoints={(id) => openGrantDrawer(id)} />
        </Tab>
      </Tabs>

      <GrantPointsDrawer
        shown={grantDrawer.open}
        setShown={(shown) => {
          if (!shown) closeGrantDrawer();
        }}
        preselectedMemberId={grantDrawer.preselectedMemberId}
      />
      <EditMemberDrawer
        shown={editMemberDrawer.open}
        setShown={(shown) => {
          if (!shown) closeEditMemberDrawer();
        }}
        member={editMemberDrawer.member}
      />
      <EditRewardDrawer
        shown={editRewardDrawer.open}
        setShown={(shown) => {
          if (!shown) closeEditRewardDrawer();
        }}
        reward={editRewardDrawer.reward}
      />
    </FullPageView>
  );
}
