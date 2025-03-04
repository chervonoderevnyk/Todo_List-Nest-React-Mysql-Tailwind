import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const signInSchema = z.object({
  email: z.string().email("Некоректний email"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data: SignInFormData) => {
    try {
      if (authContext) {
        await authContext.login(data.email, data.password); // Викликаємо login з контексту
        navigate("/"); // Редирект на головну сторінку (Dashboard)
      }
    } catch (error) {
      alert("Помилка входу");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Вхід</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("email")} type="email" placeholder="Email" className="w-full p-2 border rounded mb-2" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input {...register("password")} type="password" placeholder="Пароль" className="w-full p-2 border rounded mb-2" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Увійти
          </button>
        </form>
        <p className="mt-2 text-sm">
          Не маєте акаунту? <Link to="/sign-up" className="text-blue-500">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
}
