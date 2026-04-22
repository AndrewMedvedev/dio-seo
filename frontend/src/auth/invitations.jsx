import { useState, useEffect } from "react";
import {
  Send,
  UserPlus,
  Building2,
  Mail,
  Check,
  AlertCircle,
} from "lucide-react";
import { authApi } from "../api/Auth";

export default function InvitationsPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Определяем, нужна ли компания для выбранной роли

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSending(true);
    setError("");

    try {
      await authApi.invitation(email);

      setSuccess(true);
      setEmail("");

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Не удалось отправить приглашение",
      );
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Приглашение</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-8 rounded-3xl space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email адрес *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-2xl text-white placeholder-neutral-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Как это работает */}
        <div className="glass-card p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
          <div className="flex gap-3">
            <UserPlus className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-400 font-medium">Как это работает?</p>
              <p className="text-neutral-400 text-sm mt-1">
                Пользователь получит письмо со ссылкой для регистрации. После
                перехода по ссылке он сможет создать пароль и войти в систему.
              </p>
            </div>
          </div>
        </div>

        {/* Успех */}
        {success && (
          <div className="glass-card p-5 bg-green-500/10 border border-green-500/30 rounded-3xl flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <p className="text-green-400 font-medium">
              Приглашение успешно отправлено!
            </p>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="glass-card p-5 bg-red-500/10 border border-red-500/30 rounded-3xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isSending || !email}
          className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all active:scale-[0.985]"
        >
          {isSending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Отправляем приглашение...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Отправить приглашение
            </>
          )}
        </button>
      </form>
    </div>
  );
}
