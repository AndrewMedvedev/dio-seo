import { apiClient } from "./base";
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
