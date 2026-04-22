import { useState, useEffect } from "react";
import { History, Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { PromotionApi } from "../api/Promotion";

export default function HistoryView({ userId, onSelect }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Загрузка истории
  const fetchHistory = async (currentPage = 1) => {
    try {
      setLoading(true);
      const data = await PromotionApi.history(userId, currentPage, 10);

      if (data.results && Array.isArray(data.results)) {
        if (currentPage === 1) {
          setHistory(data.results);
        } else {
          setHistory((prev) => [...prev, ...data.results]);
        }

        setHasMore(data.results.length === 10); // если пришло меньше 10 — значит последняя страница
      }
    } catch (err) {
      console.error("Ошибка загрузки истории:", err);
      setError("Не удалось загрузить историю генераций");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchHistory(1);
    }
  }, [userId]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistory(nextPage);
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Загружаем историю генераций...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-400">
        <p>{error}</p>
        <button
          onClick={() => fetchHistory(1)}
          className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-xl"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <History className="w-16 h-16 mb-4 opacity-40" />
        <p className="text-lg">История генераций пока пуста</p>
        <p className="text-sm mt-2">
          Здесь будут отображаться все ваши анализы и генерации
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-2xl flex items-center justify-center">
            <History className="w-6 h-6 text-red-400" />
          </div>
          История генераций
        </h2>
        <div className="text-sm text-neutral-500">
          Всего записей: {history.length}
        </div>
      </div>

      <div className="grid gap-6">
        {history.map((item, index) => {
          const date = new Date(item.created_at);
          const seoScore = item.result?.seo_result?.seo?.score ?? null;

          let h1 = "Анализ сайта";
          if (item.result?.content_generation_result?.h1) {
            h1 = item.result.content_generation_result.h1;
          } else if (item.result?.new_content?.transformed_content) {
            const match =
              item.result.new_content.transformed_content.match(/^#\s(.+)$/m);
            if (match) h1 = match[1];
          }

          const summary =
            item.result?.seo_result?.overall_summary ||
            (item.result?.new_content?.transformed_content
              ? item.result.new_content.transformed_content.slice(0, 260) +
                "..."
              : "Генерация SEO и AIO контента");

          return (
            <div
              key={item.id || index}
              onClick={() => onSelect && onSelect(item)}
              className="group bg-neutral-900/70 border border-neutral-800 hover:border-red-500/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 text-xs font-medium bg-neutral-800 rounded-full text-neutral-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(date, "dd MMMM yyyy", { locale: ru })}
                    </div>
                    <div className="px-3 py-1 text-xs font-medium bg-neutral-800 rounded-full text-neutral-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {format(date, "HH:mm")}
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold leading-tight mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {h1}
                  </h3>

                  <p className="text-neutral-400 line-clamp-3 text-[15px] leading-relaxed">
                    {summary}
                  </p>

                  {seoScore !== null && (
                    <div className="mt-5 flex items-center gap-2">
                      <span className="text-sm text-neutral-500">
                        SEO-оценка:
                      </span>
                      <span
                        className={`text-lg font-semibold ${
                          seoScore >= 70
                            ? "text-emerald-400"
                            : seoScore >= 50
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {seoScore}/100
                      </span>
                    </div>
                  )}
                </div>

                <div className="lg:w-80 shrink-0 flex flex-col">
                  <div className="bg-dark-800 rounded-2xl p-5 text-sm border border-neutral-800 mb-6">
                    <div className="font-medium mb-2 text-neutral-300">
                      Основные проблемы:
                    </div>
                    <ul className="space-y-1.5 text-neutral-400 text-[14px]">
                      {item.result?.seo_result?.issues
                        ?.slice(0, 3)
                        .map((issue, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span className="line-clamp-1">{issue.title}</span>
                          </li>
                        )) || (
                        <li className="text-neutral-500">
                          Нет критических проблем
                        </li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect && onSelect(item);
                    }}
                    className="mt-auto w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    Открыть результат
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-neutral-800 text-xs text-neutral-500 font-mono truncate">
                {item.result?.url}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-2xl flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Загрузка...
              </>
            ) : (
              "Загрузить ещё"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
