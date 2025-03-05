import { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/AuthService";

interface AuthContextType {
  token: string | null;
  role: "ADMIN" | "USER" | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<"ADMIN" | "USER" | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as "ADMIN" | "USER" | null;
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);  

  const login = async (email: string, password: string) => {
    try {
      console.log("Виконується функція login...");
      const data = await loginUser(email, password); // Замість 'data.token' використовуйте 'data.accessToken'
      console.log("Отримані дані від сервера:", data);
  
      if (!data.token) throw new Error("Invalid login response");
  
      setToken(data.token);  // Оновлено для використання 'accessToken'
      setRole(data.role);          // Якщо role повертається, збережіть його тут
      localStorage.setItem("token", data.token);  // Збережіть 'accessToken'
      localStorage.setItem("role", data.role);  // Якщо role повертається, збережіть його
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
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
