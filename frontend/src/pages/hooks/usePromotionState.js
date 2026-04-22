import { useState, useEffect } from "react";

const PAGE_STORAGE_KEY = "promotion_page_state";

export function usePromotionState() {
  const [url, setUrl] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(`${PAGE_STORAGE_KEY}_url`) || "";
  });

  

  const [content, setContent] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(`${PAGE_STORAGE_KEY}_content`);
    return saved ? JSON.parse(saved) : null;
  });

  const [aiContent, setAiContent] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(`${PAGE_STORAGE_KEY}_aiContent`);
    return saved ? JSON.parse(saved) : null;
  });

  // === НОВОЕ СОСТОЯНИЕ ДЛЯ generationId ===
  const [generationId, setGenerationId] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(`${PAGE_STORAGE_KEY}_generationId`) || null;
  });

  const [showAiContent, setShowAiContent] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`${PAGE_STORAGE_KEY}_showAiContent`) === "true";
  });

  const [chatOpen, setChatOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`${PAGE_STORAGE_KEY}_chatOpen`) === "true";
  });

  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [urlError, setUrlError] = useState("");

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem(`${PAGE_STORAGE_KEY}_url`, url);
  }, [url]);

  useEffect(() => {
    if (content) {
      localStorage.setItem(
        `${PAGE_STORAGE_KEY}_content`,
        JSON.stringify(content),
      );
    }
  }, [content]);

  useEffect(() => {
    if (aiContent) {
      localStorage.setItem(
        `${PAGE_STORAGE_KEY}_aiContent`,
        JSON.stringify(aiContent),
      );
    }
  }, [aiContent]);

  // Сохранение generationId
  useEffect(() => {
    if (generationId) {
      localStorage.setItem(`${PAGE_STORAGE_KEY}_generationId`, generationId);
    } else {
      localStorage.removeItem(`${PAGE_STORAGE_KEY}_generationId`);
    }
  }, [generationId]);

  useEffect(() => {
    localStorage.setItem(
      `${PAGE_STORAGE_KEY}_showAiContent`,
      showAiContent.toString(),
    );
  }, [showAiContent]);

  useEffect(() => {
    localStorage.setItem(`${PAGE_STORAGE_KEY}_chatOpen`, chatOpen.toString());
  }, [chatOpen]);

  const validateUrl = (value) => {
    if (!value) {
      setUrlError("");
      return;
    }
    try {
      const urlToCheck = value.startsWith("http") ? value : `https://${value}`;
      new URL(urlToCheck);
      setUrlError("");
    } catch {
      setUrlError("Введите корректный URL (например: https://example.com)");
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    validateUrl(value);
  };

  return {
    url,
    setUrl,
    content,
    setContent,
    aiContent,
    setAiContent,
    generationId, // ← добавлено
    setGenerationId, // ← добавлено (это и вызывало ошибку)
    showAiContent,
    setShowAiContent,
    chatOpen,
    setChatOpen,
    loading,
    setLoading,
    aiGenerating,
    setAiGenerating,
    urlError,
    handleUrlChange,
  };
}
