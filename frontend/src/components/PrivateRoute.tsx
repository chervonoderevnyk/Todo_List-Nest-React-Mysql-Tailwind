import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Отримуємо токен з localStorage

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
