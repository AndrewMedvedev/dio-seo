import axios from "axios";

const API_URL = "http://localhost:8001";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const GenerationApi = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/api/v1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  listFiles: async () => {
    const response = await apiClient.get("/api/v1/knowledge-base/files");
    return response.data;
  },

  chat: async (message) => {
    const response = await apiClient.post("/api/v1/chat", {
      role: "user",
      content: message,
    });

    return response.data;
  },

  resetChat: async () => {
    const response = await apiClient.post("/api/v1/chat/reset");
    return response.data;
  },
};
