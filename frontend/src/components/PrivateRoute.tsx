import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const authContext = useContext(AuthContext);
  return authContext?.token ? <Outlet /> : <Navigate to="/login" />;
}
