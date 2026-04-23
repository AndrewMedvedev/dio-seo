import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    clearError();
    const success = await login(data.email, data.password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="w-full max-w-md p-4">
      {/* Фоновые блики */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Заголовок с логотипом */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
            <img
              src="http://80.93.62.177:8000/media/images/Logo_bez_fona_bez_teksta.width-80.height-80.png"
              alt="Логотип"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">ДИО-Консалт</h1>
          <p className="text-neutral-500 mt-1">Система поддержки клиентов</p>
        </div>

        {/* Форма входа */}
        <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Вход в систему
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Поле Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="email"
                  {...register("email")}
                  className="w-full pl-12 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  placeholder="example@gmail.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Поле Пароль */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full pl-12 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? "Скрыть" : "Показать"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-linear-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Войти
                </>
              )}
            </button>
          </form>
        </div>

        {/* Футер */}
        <p className="text-center text-neutral-600 text-sm mt-6">
          © 2026 ДИО-Консалт. Все права защищены.
        </p>
      </div>
    </div>
  );
}
