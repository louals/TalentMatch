import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "api";
import { extractUserId } from "../utils/jwt";

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
  }) => Promise<void>;
  logout: () => void;
  setUser: (u: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(!!token); // true only if token exists

  useEffect(() => {
    const fetchUser = async (tok: string) => {
      try {
        const uid = extractUserId(tok);
        if (!uid) throw new Error("Bad token");
        api.setAuthToken(tok);
        const res = await api.getUser(uid);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user -> logging out:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user.role === "employer") {
      navigate("/employer/dashboard");
    } else {
      navigate("/");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    const tok = res.data.access_token;
    setToken(tok);
    localStorage.setItem("token", tok);
    api.setAuthToken(tok);
  
    
    const uid = extractUserId(tok);
    if (uid) {
      const userRes = await api.getUser(uid);
      setUser(userRes.data);
    }
  };

  const register = async ({
    email,
    password,
    first_name,
    last_name,
    role,
  }: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
  }) => {
    await api.register({ email, password, first_name, last_name, role });
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setLoading(false);
    api.setAuthToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
