import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Гості бачать тільки ці сторінки */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Приватні маршрути, доступні тільки після входу */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>

          {/* Якщо немає збігів — перенаправляємо на login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
