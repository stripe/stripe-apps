import React, { useReducer } from 'react';

type GitHubStateType = {
  isProfile: boolean;
  username: string | null;
  cursor: string | null;
};

const gitHubInitialState: GitHubStateType = {
  isProfile: false,
  username: null,
  cursor: null,
};

type GitHubReducerActions =
  | { type: 'UPDATE_USERNAME'; username: string | null }
  | { type: 'UPDATE_CURSOR'; cursor: string | null }
  | { type: 'TOGGLE_SEARCH_OR_PROFILE' };

function gitHubReducer(state: GitHubStateType, action: GitHubReducerActions) {
  switch (action.type) {
    case 'UPDATE_USERNAME':
      return { ...state, username: action.username };
    case 'UPDATE_CURSOR':
      return { ...state, cursor: action.cursor };
    case 'TOGGLE_SEARCH_OR_PROFILE':
      return {
        ...state,
        isProfile: !state.isProfile,
      };
    default:
      return state;
  }
}

export const GitHubContext = React.createContext<{
  state: GitHubStateType;
  dispatch: React.Dispatch<GitHubReducerActions>;
}>({ state: gitHubInitialState, dispatch: () => null });

export const GitHubProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(gitHubReducer, gitHubInitialState);

  return (
    <GitHubContext.Provider value={{ state, dispatch }}>
      {children}
    </GitHubContext.Provider>
  );
};
