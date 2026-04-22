import { useEffect, useState } from "react";

const MiniErrorToast = ({
  statusCode = 500,
  message = "Ошибка при запросе к API",
  onClose,
  autoClose = 6000,
  variant = "error", // "error" | "warning"
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const isError = variant === "error";
  const color = isError ? "red" : "orange";

  // Анимация прогресс-бара
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
    <div className="fixed top-6 right-6 z-50 w-80">
      <div
        className={`
          bg-[#161616] border border-${color}-600/40 rounded-2xl 
          shadow-2xl overflow-hidden backdrop-blur-xl
          transition-all duration-300 
          ${visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-95"}
        `}
      >
        {/* Тонкая цветная полоска сверху с прогрессом */}
        <div className={`h-0.5 bg-${color}-500 relative`}>
          <div
            className="absolute top-0 left-0 h-full bg-linear-to-r from-white/30 to-transparent transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-5 py-4 flex items-center gap-4">
          {/* Иконка */}
          <div
            className={`w-9 h-9 rounded-2xl bg-${color}-600/10 flex items-center justify-center shrink-0 border border-${color}-500/30`}
          >
            {isError ? (
              <span className="text-2xl">⚠️</span>
            ) : (
              <span className="text-2xl">⚠</span>
            )}
          </div>

          {/* Текст */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`font-medium text-${color}-400 text-[15px]`}>
                {statusCode ? `${statusCode} — ` : ""}
                {message}
              </p>

              <button
                onClick={() => {
                  setVisible(false);
                  setTimeout(onClose, 250);
                }}
                className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            {statusCode && (
              <p className="text-[13px] text-gray-500 font-mono mt-0.5">
                API Error
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniErrorToast;
