import { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  role: "ADMIN" | "USER" | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<"ADMIN" | "USER" | null>(localStorage.getItem("role") as "ADMIN" | "USER" | null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as "ADMIN" | "USER" | null;
    
    if (!storedToken) {
      navigate("/login");  // Якщо токена немає — редирект на логін
      return;
    }

    setToken(storedToken);
    setRole(storedRole);
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      console.log("Виконується функція login...");
      const data = await loginUser(email, password);
      console.log("Отримані дані від сервера:", data);

      if (!data.token) throw new Error("Invalid login response");

      setToken(data.token);
      setRole(data.role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      navigate("/"); // Після успішного логіну переходимо на Dashboard
    } catch (error) {
      console.error("Помилка входу:", error);
      throw new Error("Помилка входу: невірний email або пароль");
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login"); // Після логауту повертаємо на логін
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
