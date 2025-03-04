import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
