// routes/ClientRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingM from "../components/animations/LoadingM";

const ClientRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingM />;

  if (!user || user.role !== "candidate") {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
export default ClientRoute;