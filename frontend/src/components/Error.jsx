// MiniErrorToast.jsx
import { useEffect, useState } from "react";

const MiniErrorToast = ({
  message = "Произошла ошибка",
  statusCode,
  onClose,
  autoClose = 6000,
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  // Определение текста по статус-коду
  const getStatusMessage = (code) => {
    if (!code) return message;

    const statusMessages = {
      400: "Неверный запрос",
      401: "Вы не авторизованный",
      403: "Доступ запрещён",
      404: "Ресурс не найден",
      409: "Конфликт данных",
      422: "Ошибка валидации",
      429: "Слишком много запросов",
      500: "Внутренняя ошибка сервера",
      502: "Не получилось проанализировать страницу",
      503: "Сервис недоступен",
      504: "Таймаут сервера",
    };

    return statusMessages[code] || message;
  };

  const displayMessage = getStatusMessage(statusCode);

  // Автозакрытие с прогресс-баром
  useEffect(() => {
    if (!autoClose) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setVisible(false);
          setTimeout(onClose, 300);
          return 0;
        }
        return prev - 100 / (autoClose / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [autoClose, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-5 right-5 z-50 w-80">
      <div
        className={`
          relative backdrop-blur-2xl bg-zinc-950/90 border border-red-500/30
          rounded-2xl shadow-2xl shadow-black/50 overflow-hidden
          transition-all duration-300 ease-out
          ${visible ? "translate-x-0 opacity-100 scale-100" : "translate-x-4 opacity-0 scale-95"}
        `}
      >
        {/* Прогресс-бар */}
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-zinc-800">
          <div
            className="h-full bg-red-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-5 py-4 flex items-start gap-3.5">
          {/* Текст сообщения */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-400 leading-relaxed pr-2">
              {displayMessage}
            </p>
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 250);
            }}
            className="text-zinc-400 hover:text-white text-2xl leading-none transition-colors mt-px"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniErrorToast;
