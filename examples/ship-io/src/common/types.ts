export interface LoginContext {
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
}

export interface ProviderProps {
  children: React.ReactNode;
}
