import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch, apiUrl, getStoredToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()));

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return null;
    }

    const response = await apiFetch("/api/auth/me");

    if (!response.ok) {
      throw new Error("Session expired");
    }

    const data = await response.json();
    setUser(data.user);
    return data.user;
  }, [token]);

  useEffect(() => {
    const loadSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch (error) {
        localStorage.removeItem("eventhub_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [token, refreshUser]);

  const updateSession = (sessionToken, sessionUser) => {
    localStorage.setItem("eventhub_token", sessionToken);
    setToken(sessionToken);
    setUser(sessionUser);
  };

  const login = async (credentials) => {
    const response = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to log in");
    }

    updateSession(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    const response = await fetch(apiUrl("/api/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to register");
    }

    updateSession(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("eventhub_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}