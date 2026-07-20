"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";

import { getMyProfile, logoutUser } from "@/services/authService";
import { TOKEN_COOKIE } from "@/utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const storedToken =
      localStorage.getItem("user_token") || Cookies.get(TOKEN_COOKIE);
    const storedUser = localStorage.getItem("user_data");

    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    setToken(storedToken);
    Cookies.set(TOKEN_COOKIE, storedToken, { expires: 1, sameSite: "lax" });

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user_data");
      }
    }

    try {
      const profile = await getMyProfile();
      setUser(profile);
      localStorage.setItem("user_data", JSON.stringify(profile));
    } catch {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_data");
      Cookies.remove(TOKEN_COOKIE);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const loginSuccess = useCallback((userData, accessToken) => {
    localStorage.setItem("user_token", accessToken);
    localStorage.setItem("user_data", JSON.stringify(userData));
    Cookies.set(TOKEN_COOKIE, accessToken, { expires: 1, sameSite: "lax" });
    setToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    Cookies.remove(TOKEN_COOKIE);
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isLoggedIn: !!user && !!token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === "admin",
    loginSuccess,
    logout,
    refresh: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

export const useAuth = useAuthContext;
