import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

 

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }


  return <>{children}</>;
}
