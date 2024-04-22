import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { jwtDecode }  from "jwt-decode";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;
  const role = decoded?.role;

  const hasPermission = auth?.accessToken && allowedRoles?.includes(role);
  const isAuthenticated = auth && auth?.accessToken; 

  return hasPermission ? (
    <Outlet />
  ) : isAuthenticated ? (
    <Navigate to="/home" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;