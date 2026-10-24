import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  logout: () => Promise<void>;
  setUser: (u: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      console.log("Loaded token from storage:", storedToken);
      if (storedToken) {
        setToken(storedToken);
      } else {
        setLoading(false);
      }
    };
    loadToken();
  }, []);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        console.log("No token, skipping user fetch");
        return;
      }
  
      try {
        console.log("Fetching user with token:", token);
        api.setAuthToken(token); // ✅ This is now inside here
        const uid = extractUserId(token);
        if (!uid) throw new Error("Invalid token");
  
        const res = await api.getUser(uid);
        setUser(res.data);
      } catch (err) {
        console.error("Error loading user:", err);
        await logout();
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    const tok = res.data.access_token;
  
    console.log("🟢 Saving token:", tok);
  
    // 🔥 Save token BEFORE setting user
    await AsyncStorage.setItem("token", tok);
    setToken(tok); // triggers useEffect to fetch user
    api.setAuthToken(tok); // needed for getUser()
  
    const uid = extractUserId(tok);
    if (uid) {
      const userRes = await api.getUser(uid);
      setUser(userRes.data);
      console.log("🧑‍🚀 Logged in user:", userRes.data);
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

  const logout = async () => {
    setToken(null);
    setUser(null);
    setLoading(false);
    api.setAuthToken(null);
    await AsyncStorage.removeItem("token");
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
