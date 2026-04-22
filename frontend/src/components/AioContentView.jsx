import { useState } from "react";
import { CheckCircle, Copy, Check } from "lucide-react";

export default function AioContentView({ aiContent }) {
  const [copied, setCopied] = useState(null); // "main" | "placement" | "json" | "robots" | "llms"

  const copyToClipboard = async (text, type) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);

      setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch (err) {
      console.error("Ошибка копирования:", err);
      alert("Не удалось скопировать текст");
    }
  };

  // Извлекаем данные с учётом возможной вложенности
  const mainContent =
    aiContent?.new_content?.transformed_content ||
    aiContent?.transformed_content ||
    "";
  const placementRec =
    aiContent?.new_content?.placement_recommendation ||
    aiContent?.placement_recommendation ||
    "";
  const jsonLd = aiContent?.json_ld || "";
  const robotsTxt = aiContent?.robots_txt || "";
  const llmsTxt = aiContent?.llms_txt || "";

  return (
    <div className="space-y-12">
      {/* ==================== Сгенерированный AI-контент ==================== */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <CheckCircle className="text-emerald-400" />
            Сгенерированный AIO-контент
          </h2>
          <button
            onClick={() => copyToClipboard(mainContent, "main")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition-colors border border-neutral-700"
          >
            {copied === "main" ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Скопировано!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Скопировать
              </>
            )}
          </button>
        </div>
        <pre className="text-xs text-neutral-400 bg-black/50 p-5 rounded-2xl max-h-96 overflow-auto whitespace-pre-wrap wrap-break-word">
          {mainContent || "Нет сгенерированного контента"}
        </pre>
      </div>

      {/* ==================== Рекомендации по размещению ==================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Рекомендации по размещению</h3>
          <button
            onClick={() => copyToClipboard(placementRec, "placement")}
            className="flex items-center gap-2 px-5 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition-colors border border-neutral-700"
          >
            {copied === "placement" ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Скопировано!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Скопировать
              </>
            )}
          </button>
        </div>

        <pre className="text-xs text-neutral-400 bg-black/50 p-5 rounded-2xl max-h-96 overflow-auto whitespace-pre-wrap wrap-break-word">
          {placementRec || "Нет рекомендаций"}
        </pre>
      </div>

      {/* ==================== Технические файлы ==================== */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-6">Технические файлы</h3>

        {/* JSON-LD */}
        <div className="bg-dark-800border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="uppercase text-xs tracking-widest text-neutral-500">
              JSON-LD
            </div>
            <button
              onClick={() => copyToClipboard(jsonLd, "json")}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition-colors border border-neutral-700"
            >
              {copied === "json" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Скопировать
                </>
              )}
            </button>
          </div>
          <pre className="text-xs text-neutral-400 bg-black/50 p-5 rounded-2xl max-h-96 overflow-auto whitespace-pre-wrap wrap-break-word">
            {jsonLd || "Нет данных"}
          </pre>
        </div>

        {/* robots.txt */}
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="uppercase text-xs tracking-widest text-neutral-500">
              robots.txt
            </div>
            <button
              onClick={() => copyToClipboard(robotsTxt, "robots")}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition-colors border border-neutral-700"
            >
              {copied === "robots" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Скопировать
                </>
              )}
            </button>
          </div>
          <pre className="text-xs text-neutral-400 bg-black/50 p-5 rounded-2xl max-h-96 overflow-auto whitespace-pre-wrap wrap-break-word">
            {robotsTxt || "Нет данных"}
          </pre>
        </div>

        {/* llms.txt */}
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="uppercase text-xs tracking-widest text-neutral-500">
              llms.txt
            </div>
            <button
              onClick={() => copyToClipboard(llmsTxt, "llms")}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition-colors border border-neutral-700"
            >
              {copied === "llms" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Скопировать
                </>
              )}
            </button>
          </div>
          <pre className="text-xs text-neutral-400 bg-black/50 p-5 rounded-2xl max-h-96 overflow-auto whitespace-pre-wrap wrap-break-word">
            {llmsTxt || "Нет данных"}
          </pre>
        </div>
      </div>

      {/* Стоимость генерации */}
      <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 flex justify-between items-center">
        <div>
          <div className="text-sm text-neutral-400">Стоимость генерации</div>
          <div className="text-3xl font-bold text-emerald-400">
            {aiContent?.total_money ? aiContent.total_money.toFixed(2) : "0.00"}{" "}
            ₽
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-400">Использовано токенов</div>
          <div className="text-3xl font-bold">
            {aiContent?.total_tokens
              ? aiContent.total_tokens.toLocaleString("ru-RU")
              : "0"}
          </div>
        </div>
      </div>
    </div>
  );
}
