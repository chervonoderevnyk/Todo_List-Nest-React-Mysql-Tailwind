const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:3002");

interface AuthResponse {
  token: string;
  role: "ADMIN" | "USER";
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`,
    },
    body: JSON.stringify({ email, password }),
  });

  console.log("Статус відповіді:", response.status);
  console.log("Заголовки:", response.headers);

  if (!response.ok) {
    throw new Error("Невірний email або пароль");
  }

  const data = await response.json();
  console.log("Отримані дані:", data); // <--- Перевіряємо відповідь
  return data;
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error("Помилка при реєстрації");
  }

  return response.json();
};
