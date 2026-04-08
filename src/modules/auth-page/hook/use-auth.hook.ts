import { useState } from "react";
import type { DemoAccount, LoginForm } from "../../../common/type/app.type";
import { loginWithDemoAccount } from "../../../service/auth.service";

type UseAuthHookArgs = {
  demoAccounts: DemoAccount[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  setAppError: (message: string) => void;
};

export const useAuthHook = ({ demoAccounts, showToast, setAppError }: UseAuthHookArgs) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: demoAccounts[0].email,
    password: demoAccounts[0].password,
  });
  const [loginError, setLoginError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<DemoAccount>(demoAccounts[0]);

  const handleLogin = async () => {
    setAppError("");
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const matched = await loginWithDemoAccount(
        demoAccounts,
        loginForm.email,
        loginForm.password
      );

      if (!matched) {
        setLoginError("Invalid demo account. Please use one of the accounts listed on the right.");
        return;
      }

      setCurrentUser(matched);
      setIsAuthenticated(true);
      showToast("Login successful.", "success");
    } catch {
      setAppError("Login failed. Please try again.");
      showToast("Login failed.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoggingIn,
    loginForm,
    setLoginForm,
    loginError,
    currentUser,
    handleLogin,
    handleLogout,
  };
};
