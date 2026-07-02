import { FullPageView } from "@stripe/ui-extension-sdk/ui";
import { useReducer } from "react";
import { Tab, Tabs } from "@stripe/ui-extension-sdk/ui/next";

import { useHomeQuery } from "@/data";
import { useQueuedToast } from "@/hooks/useQueuedToast";
import { GrantPointsDrawer } from "./drawers/GrantPointsDrawer";
import { EditMemberDrawer } from "./drawers/EditMemberDrawer";
import { EditRewardDrawer } from "./drawers/EditRewardDrawer";
import { ActivityTab } from "./tabs/ActivityTab";
import { MembersTab } from "./tabs/MembersTab";
import { OverviewTab } from "./tabs/OverviewTab";
import { RewardsTab } from "./tabs/RewardsTab";
import type { Member, Reward } from "@/data";

type HomeState = {
  editMemberDrawer: { open: boolean; member: Member | null };
  grantDrawer: { open: boolean; preselectedMemberId?: string };
  editRewardDrawer: { open: boolean; reward: Reward | null };
};

type HomeAction =
  | { type: "openEditMember"; member: Member }
  | { type: "closeEditMember" }
  | { type: "openGrantDrawer"; preselectedMemberId?: string }
  | { type: "closeGrantDrawer" }
  | { type: "openEditReward"; reward: Reward }
  | { type: "closeEditReward" };

const initialHomeState: HomeState = {
  editMemberDrawer: { open: false, member: null },
  grantDrawer: { open: false },
  editRewardDrawer: { open: false, reward: null },
};

function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case "openEditMember":
      return {
        ...state,
        editMemberDrawer: { open: true, member: action.member },
      };
    case "closeEditMember":
      return {
        ...state,
        editMemberDrawer: { open: false, member: null },
      };
    case "openGrantDrawer":
      return {
        ...state,
        grantDrawer: {
          open: true,
          preselectedMemberId: action.preselectedMemberId,
        },
      };
    case "closeGrantDrawer":
      return { ...state, grantDrawer: { open: false } };
    case "openEditReward":
      return {
        ...state,
        editRewardDrawer: { open: true, reward: action.reward },
      };
    case "closeEditReward":
      return {
        ...state,
        editRewardDrawer: { open: false, reward: null },
      };
  }
}

export function Home() {
  const { data: homeData } = useHomeQuery();
  const { queueToast } = useQueuedToast();
  const [state, dispatch] = useReducer(homeReducer, initialHomeState);

  const openEditMember = (memberId: string) => {
    const member = homeData?.members.find((m) => m.id === memberId);
    if (member) dispatch({ type: "openEditMember", member });
  };

  const openGrantDrawer = (preselectedMemberId?: string) =>
    dispatch({ type: "openGrantDrawer", preselectedMemberId });

  const openEditReward = (rewardId: string) => {
    const reward = homeData?.rewards.find((r) => r.id === rewardId);
    if (reward) dispatch({ type: "openEditReward", reward });
  };

  return (
    <FullPageView
      pageAction={{
        label: "Grant points",
        onPress: () => openGrantDrawer(),
      }}
    >
      <Tabs>
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
        shown={state.grantDrawer.open}
        setShown={(shown) => {
          if (!shown) dispatch({ type: "closeGrantDrawer" });
        }}
        preselectedMemberId={state.grantDrawer.preselectedMemberId}
        onGranted={() => {
          dispatch({ type: "closeGrantDrawer" });
          queueToast("Points granted", "success");
        }}
        onGrantError={() => {
          queueToast("Could not grant points", "caution");
        }}
      />
      <EditMemberDrawer
        shown={state.editMemberDrawer.open}
        setShown={(shown) => {
          if (!shown) dispatch({ type: "closeEditMember" });
        }}
        member={state.editMemberDrawer.member}
      />
      <EditRewardDrawer
        shown={state.editRewardDrawer.open}
        setShown={(shown) => {
          if (!shown) dispatch({ type: "closeEditReward" });
        }}
        reward={state.editRewardDrawer.reward}
      />
    </FullPageView>
  );
}
