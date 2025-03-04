import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import axios from "axios";

// Схема валідації
const signUpSchema = z.object({
  name: z.string().min(2, "Мінімум 2 символи"),
  email: z.string().email("Некоректний email"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await axios.post("http://localhost:3002/user/sign-up", data);
      alert("Реєстрація успішна!");
    } catch (error) {
      alert("Помилка реєстрації");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Реєстрація</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("name")}
            type="text"
            placeholder="Ім'я"
            className="w-full p-2 border rounded mb-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            {...register("password")}
            type="password"
            placeholder="Пароль"
            className="w-full p-2 border rounded mb-2"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Зареєструватися
          </button>
        </form>
        <p className="mt-2 text-sm">
          Вже маєте акаунт? <Link to="/login" className="text-blue-500">Увійти</Link>
        </p>
      </div>
    </div>
  );
}
