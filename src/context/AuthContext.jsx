import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/apiService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("esg4u_token");
    const storedUser = localStorage.getItem("esg4u_user");

    if (!token) {
      setLoading(false);
      return;
    }

    if (storedUser) {
      setUserState(JSON.parse(storedUser));
      setLoading(false);
    } else {
      (async () => {
        const result = await authService.me();
        if (result.success) {
          setUserState(result.data);
          localStorage.setItem("esg4u_user", JSON.stringify(result.data));
        } else {
          authService.logout();
        }
        setLoading(false);
      })();
    }
  }, []);

  const setUser = (updater) => {
    setUserState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (next) {
        localStorage.setItem("esg4u_user", JSON.stringify(next));
      } else {
        localStorage.removeItem("esg4u_user");
      }
      return next;
    });
  };

  const login = (token, userData) => {
    localStorage.setItem("esg4u_token", token);
    if (userData) {
      setUser(userData);
      sessionStorage.removeItem("esg4u_tutorial_visto");
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}