import { useCallback, useReducer } from "react";
import { useHomeQuery, type Member, type Reward } from "@/data";

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

export function useHome() {
  const { data: homeData } = useHomeQuery();
  const [state, dispatch] = useReducer(homeReducer, initialHomeState);

  const openEditMember = useCallback(
    (memberId: string) => {
      const member = homeData?.members.find((m) => m.id === memberId);
      if (member) dispatch({ type: "openEditMember", member });
    },
    [homeData?.members],
  );

  const openGrantDrawer = useCallback((preselectedMemberId?: string) => {
    dispatch({ type: "openGrantDrawer", preselectedMemberId });
  }, []);

  const openEditReward = useCallback(
    (rewardId: string) => {
      const reward = homeData?.rewards.find((r) => r.id === rewardId);
      if (reward) dispatch({ type: "openEditReward", reward });
    },
    [homeData?.rewards],
  );

  const closeGrantDrawer = useCallback(() => {
    dispatch({ type: "closeGrantDrawer" });
  }, []);

  const closeEditMemberDrawer = useCallback(() => {
    dispatch({ type: "closeEditMember" });
  }, []);

  const closeEditRewardDrawer = useCallback(() => {
    dispatch({ type: "closeEditReward" });
  }, []);

  return {
    grantDrawer: state.grantDrawer,
    editMemberDrawer: state.editMemberDrawer,
    editRewardDrawer: state.editRewardDrawer,
    openEditMember,
    openGrantDrawer,
    openEditReward,
    closeGrantDrawer,
    closeEditMemberDrawer,
    closeEditRewardDrawer,
  };
}
