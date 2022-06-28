import { useContext, useState, createContext } from "react";
import { LoginContext, ProviderProps } from "../common/types";
import LoginView from "../views/LoginView";

const LoginContext = createContext<LoginContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
});

export const LoginProvider = ({ children }: ProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {isLoggedIn ? children : <LoginView />}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  return { isLoggedIn, setIsLoggedIn };
};
