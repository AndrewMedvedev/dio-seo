import { apiClient, tokenStorage } from "./base";
// ========================
// Auth API — функции для авторизации
// ========================
export const authApi = {
  // Логин
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", email);
    formData.append("password", password);
    formData.append("scope", "");
    formData.append("client_id", "string");
    formData.append("client_secret", "string");

    const response = await apiClient.post("/api/v1/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // После успешного логина сохраняем токены
    const { access_token, refresh_token, expires_at } = response.data;
    tokenStorage.setTokens(access_token, refresh_token, expires_at);

    return response.data;
  },

  async register(userData, token) {
    const response = await apiClient.post(
      `/api/v1/auth/register/${token}`,
      userData,
    );
    // После успешного логина сохраняем токены
    const { access_token, refresh_token, expires_at } = response.data;
    tokenStorage.setTokens(access_token, refresh_token, expires_at);

    return response.data;
  },

  async invitation(email) {
    const response = await apiClient.post(`/api/v1/invitations`, {
      email: email,
    });
    return response.data;
  },
};

export const saveTokens = (tokens) => {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);

  // Также в куки
  const accessMaxAge = tokens.expires_at - Math.floor(Date.now() / 1000);
  document.cookie = `access_token=${tokens.access_token}; path=/; max-age=${accessMaxAge}`;
  document.cookie = `refresh_token=${tokens.refresh_token}; path=/; max-age=2592000`; // 30 дней
};

// Проверить авторизацию
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

export default apiClient;
