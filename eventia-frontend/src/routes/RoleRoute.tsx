import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { user, loadingSession } = useAuth();

  if (loadingSession) {
    return <p>Cargando sesión...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/perfil" replace />;
  }

  return children;
}

export default RoleRoute;