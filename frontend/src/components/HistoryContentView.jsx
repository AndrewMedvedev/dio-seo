import { useState } from "react";
import SeoReport from "./SeoReport";
import AioContentView from "./AioContentView";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function HistoryContentView({ seoData, aioData, generationId }) {
  const [showAio, setShowAio] = useState(false);
  const hasAio = !!aioData && aioData.generation_id === generationId;

  // Кнопка будет показана только если есть AIO
  const renderActionButton = () => {
    if (!hasAio) return null;

    return (
      <button
        onClick={() => setShowAio(!showAio)}
        className="flex items-center gap-3 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium transition-all active:scale-[0.98]"
      >
        {showAio ? (
          <>
            <ArrowLeft className="w-5 h-5" />
            Вернуться к SEO-отчёту
          </>
        ) : (
          <>
            Показать AIO-контент
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Заголовок + кнопка (всегда в правом верхнем углу) */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          {showAio ? "AIO-контент" : "SEO-отчёт"}
        </h2>

        {renderActionButton()}
      </div>

      {/* Основной контент */}
      {showAio ? (
        <AioContentView aiContent={aioData} />
      ) : (
        <SeoReport content={seoData} />
      )}
    </div>
  );
}
