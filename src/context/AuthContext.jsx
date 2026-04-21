import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/apiService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("esg4u_token");
    const storedUser = localStorage.getItem("esg4u_user");

    if (!token) {
      setLoading(false);
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      (async () => {
        const result = await authService.me();
        if (result.success) {
          setUser(result.data);
          localStorage.setItem("esg4u_user", JSON.stringify(result.data));
        } else {
          authService.logout();
        }
        setLoading(false);
      })();
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("esg4u_token", token);
    if (userData) {
      setUser(userData);
      localStorage.setItem("esg4u_user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}