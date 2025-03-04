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
      const data = await loginUser(email, password);
      if (!data.token) throw new Error("Invalid login response");
  
      setToken(data.token);
      setRole(data.role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
    } catch (error) {
      alert("Помилка входу: невірний email або пароль");
      throw error;
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
