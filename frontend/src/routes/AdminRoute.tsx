// routes/AdminRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingM from "../components/animations/LoadingM";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();

  if (loading) return <LoadingM />;
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
