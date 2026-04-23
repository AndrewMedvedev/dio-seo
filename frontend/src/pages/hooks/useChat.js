import { useState, useEffect } from "react";
import { PromotionApi } from "../../api/Promotion";

const CHAT_STORAGE_KEY = "promotion_chat_history";

const WELCOME_MESSAGE = {
  id: 1,
  type: "ai",
  text: `Привет! 👋
Добро пожаловать в чат с ИИ-помощником!
Я создан специально, чтобы подробно и понятным языком разбирать сгенерированный отчёт сайта.

Здесь вы можете узнать:
• Что означают все метрики и оценки (SEO score, Performance, Core Web Vitals и др.)
• Почему выявлены конкретные ошибки (отсутствие meta-description, слишком короткий title, несколько H1, изображение без alt и т.д.)
• Насколько критична каждая проблема
• Как правильно и эффективно их исправить

Мы занимаемся полным SEO-анализом сайтов и даём точные рекомендации по исправлениям, чтобы ваш сайт лучше ранжировался в поисковиках и приносил больше трафика.

Задайте любой вопрос по вашему SEO-отчёту и я сразу всё разберу по полочкам.
С чего начнём? 😊`,
};

export function useChat(url, generationId) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState({});
  const [isSending, setIsSending] = useState(false);

  // Загрузка истории чата из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Ошибка загрузки истории чата:", e);
      }
    }
  }, []);

  // Сохранение истории чата в localStorage
  useEffect(() => {
    if (Object.keys(chatHistory).length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Загрузка сообщений при смене url или generationId
  useEffect(() => {
    if (!url?.trim() || !generationId) {
      setMessages([]);
      return;
    }

    const key = `${url}_${generationId}`;
    const savedMessages = chatHistory[key];

    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      // Если чат пустой или очищен — показываем приветственное сообщение
      setMessages([WELCOME_MESSAGE]);
    }
  }, [url, generationId, chatHistory]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !url || !generationId || isSending) return;

    const userText = inputMessage.trim();
    const userMsg = { id: Date.now(), type: "user", text: userText };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage("");
    setIsSending(true);

    try {
      const response = await PromotionApi.chat(userText, generationId);

      const aiMsg = {
        id: Date.now() + 1,
        type: "ai",
        text:
          response.response ||
          response.text ||
          response.message ||
          response.answer ||
          "Извините, я не смог обработать запрос.",
      };

      const updatedMessages = [...newMessages, aiMsg];
      setMessages(updatedMessages);

      const historyKey = `${url}_${generationId}`;
      setChatHistory((prev) => ({
        ...prev,
        [historyKey]: updatedMessages,
      }));
    } catch (error) {
      console.error("Ошибка отправки сообщения в чат:", error);

      const errorMsg = {
        id: Date.now() + 1,
        type: "ai",
        text: "⚠️ Произошла ошибка при обработке вашего запроса. Попробуйте ещё раз.",
      };

      const updatedMessages = [...newMessages, errorMsg];
      setMessages(updatedMessages);

      const historyKey = `${url}_${generationId}`;
      setChatHistory((prev) => ({
        ...prev,
        [historyKey]: updatedMessages,
      }));
    } finally {
      setIsSending(false);
    }
  };

  // Полная очистка всей истории чатов
  const clearCurrentChat = () => {
    // 1. Очищаем состояние
    setChatHistory({});
    setMessages([WELCOME_MESSAGE]);

    // 2. Полностью удаляем весь ключ из localStorage
    localStorage.removeItem(CHAT_STORAGE_KEY);

    console.log("✅ Вся история чата очищена");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isSending,
    sendMessage,
    clearCurrentChat,
    handleKeyPress,
  };
}
