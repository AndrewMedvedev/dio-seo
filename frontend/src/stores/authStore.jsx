import { create } from "zustand";
import { authApi, saveTokens } from "../api/Auth";

export const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const tokens = await authApi.login(email, password);
      saveTokens(tokens);

      // Получаем данные пользователя

      set({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Неверный email или пароль";

      set({
        isLoading: false,
        error: message,
        isAuthenticated: false,
      });

      return false;
    }
  },

  logout: () => {
    authApi.logout();

    set({
      isAuthenticated: false,
      error: null,
    });
  },

  fetchUser: async () => {
    if (!localStorage.getItem("access_token")) {
      set({ isAuthenticated: false });
      return;
    }

    set({ isLoading: true });

    try {
      // Сохраняем в localStorage

      set({
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        isAuthenticated: false,
        isLoading: false,
      });
      authApi.logout();
    }
  },

  clearError: () => set({ error: null }),
}));
