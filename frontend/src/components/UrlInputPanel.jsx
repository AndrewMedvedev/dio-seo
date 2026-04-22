import { useState } from "react";
import { History } from "lucide-react";

export default function UrlInputPanel({
  url,
  setUrl,
  loading,
  onAnalyze,
  showHistory,
  onToggleHistory,
}) {
  const [error, setError] = useState("");

  const validateUrl = (value) => {
    if (!value) {
      setError("");
      return;
    }

    try {
      // Добавляем протокол, если его нет
      const urlToCheck = value.startsWith("http") ? value : `https://${value}`;
      new URL(urlToCheck);
      setError("");
    } catch {
      setError("Введите корректный URL (например: https://example.com)");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    validateUrl(value);
  };

  return (
    <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 shrink-0">
      {!showHistory ? (
        <>
          <p className="text-neutral-400 text-sm mb-4">
            Введите URL сайта для анализа
          </p>

          <div className="flex gap-4 max-[1024px]:flex-wrap">
            <input
              type="url"
              value={url}
              onChange={handleChange}
              placeholder="https://example.com"
              className={`flex-1 min-w-0 bg-dark-800 border rounded-2xl px-6 py-4 text-white placeholder:text-neutral-500 focus:outline-none transition-all max-[1024px]:basis-full 
                ${error ? "border-red-500" : "border-neutral-700 focus:border-red-500"}`}
            />

            <button
              onClick={onAnalyze}
              disabled={!url.trim() || loading}
              className="bg-red-600 hover:bg-red-500 disabled:bg-neutral-700 disabled:cursor-not-allowed px-10 py-4 rounded-2xl font-medium transition-colors whitespace-nowrap max-[1024px]:w-full"
            >
              {loading ? "Анализируем..." : "Анализировать"}
            </button>

            <button
              onClick={onToggleHistory}
              className="px-6 py-4 rounded-2xl font-medium border border-neutral-700 hover:border-red-500/50 hover:text-white text-neutral-200 transition-colors whitespace-nowrap flex items-center justify-center gap-2 max-[1024px]:w-full"
            >
              <History className="w-4 h-4" />
              Посмотреть историю
            </button>
          </div>

          {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        </>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <p className="text-neutral-400 text-sm">
            В режиме истории доступны прошлые генерации контента
          </p>
          <button
            onClick={onToggleHistory}
            className="px-6 py-3 rounded-2xl font-medium border border-neutral-700 hover:border-red-500/50 hover:text-white text-neutral-200 transition-colors whitespace-nowrap"
          >
            Вернуться к анализу
          </button>
        </div>
      )}
    </div>
  );
}
