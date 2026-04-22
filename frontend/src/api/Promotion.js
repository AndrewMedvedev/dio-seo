import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json", // рекомендуется добавить
  },
  withCredentials: true, // ← Важно! Чтобы браузер отправлял cookies автоматически
});

// ========================
// Хелперы для работы с токенами
// ========================
export const tokenStorage = {
  getAccessToken() {
    // Сначала пытаемся взять из localStorage, потом из cookie
    return (
      localStorage.getItem("access_token") || getCookie("access_token") || null
    );
  },

  getRefreshToken() {
    return (
      localStorage.getItem("refresh_token") ||
      getCookie("refresh_token") ||
      null
    );
  },

  setTokens(accessToken, refreshToken, expiresAt) {
    // localStorage
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("token_expires_at", expiresAt.toString());

    // Cookies
    const accessExpires = new Date(expiresAt * 1000);
    const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    setCookie("access_token", accessToken, accessExpires);
    setCookie("refresh_token", refreshToken, refreshExpires);
  },

  clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_at");

    deleteCookie("access_token");
    deleteCookie("refresh_token");
  },

  isTokenExpired() {
    const expiresAt = localStorage.getItem("token_expires_at");
    if (!expiresAt) return true;
    return Date.now() >= parseInt(expiresAt) * 1000;
  },
};

// ========================
// Вспомогательные функции для cookies (оставляем как есть)
// ========================
function setCookie(name, value, expires) {
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)",
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ========================
// Interceptors
// ========================

// Request Interceptor — автоматически добавляем токен в заголовок
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response, // успешные ответы пропускаем без изменений

  async (error) => {
    console.log(error.response.data);
    const statusCode = error.response?.status || 500;
    let message = "Неизвестная ошибка сервера";

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.detail) {
      message = error.response.data.detail;
    } else if (error.message) {
      message = error.message;
    }

    // Специальная обработка 401
    if (statusCode === 401) {
      tokenStorage.clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Показываем тост об ошибке
    if (window.showGlobalError) {
      window.showGlobalError({
        statusCode,
        message,
        variant: statusCode >= 500 ? "error" : "warning",
      });
    } else {
      console.warn(
        "window.showGlobalError не зарегистрирован. Ошибка:",
        statusCode,
        message,
      );
    }

    return Promise.reject(error);
  },
);

// ========================
// API методы (остаются почти без изменений)
// ========================
export const PromotionApi = {
  seo: async (url) => {
    const response = await apiClient.get(
      `/api/v1/seo?url=${encodeURIComponent(url)}`,
    );
    return response.data;
  },

  aio: async (url, generationId) => {
    const response = await apiClient.get(
      `/api/v1/aio/${generationId}?url=${url}`,
    );
    return response.data;
  },

  history: async (page = 1, limit = 10) => {
    const response = await apiClient.get(
      `/api/v1/results?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  chat: async (text, generationId) => {
    const response = await apiClient.post(`/api/v1/chat`, {
      generation_id: generationId,
      role: "user",
      text: text,
    });
    return response.data;
  },
};
