import { useState } from "react"; // добавим useState
import {
  X,
  MessageCircle,
  Send,
  History,
  Loader2,
  Calendar,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react"; // добавим иконки для расширения/сворачивания
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import SeoReport from "../components/SeoReport";
import AioContentView from "../components/AioContentView";
import { usePromotionState } from "./hooks/usePromotionState";
import { useChat } from "./hooks/useChat";
import { useHistory } from "./hooks/useHistory";
import { usePromotionActions } from "./hooks/usePromotionActions";
import MarkdownMessage from "../components/Message";

export default function PromotionPage() {
  const state = usePromotionState();
  const history = useHistory();
  const chat = useChat(state.url, state.generationId);
  const actions = usePromotionActions(state.url, state.generationId);

  // Локальное состояние для расширения чата
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  const getMainButtonText = () => {
    if (state.aiGenerating)
      return "Генерируем AIO-контент. Примерное время – не более 3 минут. Спасибо за терпение.";
    if (!state.aiContent) return "Сгенерировать AIO контент";
    return state.showAiContent
      ? "← Вернуться к SEO отчёту"
      : "Посмотреть AIO контент";
  };

  const handleHistorySelect = (item) => {
    state.setContent(item.result);
    state.setAiContent(item.result);
    state.setShowAiContent(false);
    history.toggleHistory();
    if (item.result?.url) {
      state.setUrl(item.result.url);
    }
  };

  const onAnalyze = () => {
    actions.handleAnalyze(
      state.setContent,
      state.setAiContent,
      state.setShowAiContent,
      state.setLoading,
      state.setGenerationId,
    );
  };

  const onGenerateAIContent = () => {
    actions.generateAIContent(
      state.setAiContent,
      state.setShowAiContent,
      state.setAiGenerating,
      state.generationId,
    );
  };

  const showRightPanel = state.content && !history.showHistory;

  // Определяем классы для плавающего блока чата в зависимости от состояния expanded
  const chatContainerClasses = `fixed top-28 ${
    isChatExpanded
      ? "inset-4 right-4 w-auto h-auto" // расширенный режим: отступы со всех сторон
      : "right-21 w-110 h-[calc(100vh-7rem)]"
  } hidden lg:block z-50 transition-all duration-300`;

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col overflow-x-hidden">
      <div className="flex-1 flex pt-24 lg:pt-28 px-6 lg:px-12 max-w-screen-2xl mx-auto w-full">
        {/* Левая колонка без изменений */}
        <div
          className={`flex-1 flex flex-col gap-6 min-w-0 ${showRightPanel ? "lg:pr-104" : ""}`}
        >
          {/* Панель ввода URL и история — без изменений */}
          <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 shrink-0">
            {!history.showHistory ? (
              <>
                <p className="text-neutral-400 text-sm mb-4">
                  Введите URL сайта для анализа
                </p>
                <div className="flex gap-4 max-[1024px]:flex-wrap">
                  <input
                    type="url"
                    value={state.url}
                    onChange={state.handleUrlChange}
                    placeholder="https://example.com"
                    className={`flex-1 min-w-0 bg-dark-800 border rounded-2xl px-6 py-4 text-white placeholder:text-neutral-500 focus:outline-none transition-all
                      ${state.urlError ? "border-red-500" : "border-neutral-700 focus:border-red-500"}`}
                  />
                  <button
                    onClick={onAnalyze}
                    disabled={!state.url.trim() || state.loading}
                    className="bg-red-600 hover:bg-red-500 disabled:bg-neutral-700 disabled:cursor-not-allowed px-10 py-4 rounded-2xl font-medium transition-colors whitespace-nowrap"
                  >
                    {state.loading
                      ? "Выполняется анализ. Примерное время – не более 3 минут. Спасибо за терпение."
                      : "Анализировать"}
                  </button>
                  <button
                    onClick={history.toggleHistory}
                    className="px-6 py-4 rounded-2xl font-medium border border-neutral-700 hover:border-red-500/50 hover:text-white text-neutral-200 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    История
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="text-neutral-400 text-sm">
                  История предыдущих генераций
                </p>
                <button
                  onClick={history.toggleHistory}
                  className="px-6 py-3 rounded-2xl font-medium border border-neutral-700 hover:border-red-500/50 hover:text-white text-neutral-200 transition-colors"
                >
                  Вернуться к анализу
                </button>
              </div>
            )}
          </div>

          {/* Основной контент */}
          <div className="flex-1 bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 lg:p-10 overflow-auto">
            {history.showHistory ? (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-4">
                  <History className="text-red-400" /> История генераций
                </h2>
                {history.historyLoading && history.historyData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p>Загружаем историю...</p>
                  </div>
                ) : history.historyError ? (
                  <div className="text-red-400 text-center py-10">
                    {history.historyError}
                  </div>
                ) : history.historyData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                    <History className="w-16 h-16 mb-4 opacity-40" />
                    <p className="text-lg">История генераций пока пуста</p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6">
                      {history.historyData.map((item, index) => {
                        const date = new Date(item.created_at);
                        const seoScore =
                          item.result?.seo_result?.seo?.score ?? null;
                        let h1 = "Анализ сайта";
                        if (item.result?.content_generation_result?.h1) {
                          h1 = item.result.content_generation_result.h1;
                        } else if (
                          item.result?.new_content?.transformed_content
                        ) {
                          const match =
                            item.result.new_content.transformed_content.match(
                              /^#\s(.+)$/m,
                            );
                          if (match) h1 = match[1];
                        }
                        const summary =
                          item.result?.seo_result?.overall_summary ||
                          (item.result?.new_content?.transformed_content
                            ? item.result.new_content.transformed_content.slice(
                                0,
                                220,
                              ) + "..."
                            : "SEO анализ и генерация контента");
                        return (
                          <div
                            key={item.id || index}
                            onClick={() => handleHistorySelect(item)}
                            className="group bg-dark-800 border border-neutral-800 hover:border-red-500/50 rounded-3xl p-6 transition-all cursor-pointer hover:shadow-xl"
                          >
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="px-3 py-1 text-xs bg-neutral-700 rounded-full text-neutral-400 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {format(date, "dd MMMM yyyy", {
                                      locale: ru,
                                    })}
                                  </div>
                                  <div className="px-3 py-1 text-xs bg-neutral-700 rounded-full text-neutral-400 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {format(date, "HH:mm")}
                                  </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                                  {h1}
                                </h3>
                                <p className="text-neutral-400 text-sm line-clamp-3">
                                  {summary}
                                </p>
                                {seoScore && (
                                  <div className="mt-4 text-sm">
                                    SEO:{" "}
                                    <span
                                      className={`font-semibold ${
                                        seoScore >= 70
                                          ? "text-emerald-400"
                                          : "text-amber-400"
                                      }`}
                                    >
                                      {seoScore}/100
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="lg:w-40 flex items-end">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleHistorySelect(item);
                                  }}
                                  className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-2xl text-sm font-medium flex items-center justify-center gap-2"
                                >
                                  Открыть
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-neutral-700 text-xs text-neutral-500 truncate font-mono">
                              {item.result?.url}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {history.hasMore ? (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={history.loadMore}
                          disabled={history.loadingMore}
                          className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-2xl flex items-center gap-2 disabled:opacity-70 transition-colors"
                        >
                          {history.loadingMore ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Загрузка...
                            </>
                          ) : (
                            "Загрузить ещё"
                          )}
                        </button>
                      </div>
                    ) : (
                      history.historyData.length > 0 && (
                        <div className="text-center text-neutral-500 py-6 text-sm">
                          Это вся история генераций
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            ) : !state.content ? (
              <div className="h-full flex items-center justify-center text-neutral-500 text-center py-20">
                После анализа сайта здесь появится детальный отчёт
              </div>
            ) : state.showAiContent && state.aiContent ? (
              <AioContentView aiContent={state.aiContent} />
            ) : (
              <SeoReport content={state.content} />
            )}
          </div>
        </div>
      </div>

      {/* ==================== ПЛАВАЮЩИЙ БЛОК ЧАТА ==================== */}
      {showRightPanel && (
        <div className={chatContainerClasses}>
          <div className="flex flex-col gap-4 h-full">
            {/* Главная кнопка (генерация AIO) */}
            <button
              onClick={
                state.showAiContent
                  ? () => state.setShowAiContent(false)
                  : state.aiContent
                    ? () => state.setShowAiContent(true)
                    : onGenerateAIContent
              }
              disabled={state.aiGenerating}
              className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-neutral-700 rounded-3xl font-medium text-base transition-all active:scale-[0.985]"
            >
              {getMainButtonText()}
            </button>

            {/* Кнопка открытия чата (если чат закрыт) */}
            {!state.chatOpen && (
              <button
                onClick={() => state.setChatOpen(true)}
                className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-red-500/50 rounded-3xl font-medium flex items-center justify-center gap-3 transition-all group"
              >
                <div className="w-8 h-8 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:bg-red-500/20">
                  <MessageCircle className="w-5 h-5 text-red-400" />
                </div>
                <span>Задать вопрос AI помощнику</span>
              </button>
            )}

            {/* Компонент чата (если открыт) */}
            {state.chatOpen && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-3xl flex flex-col h-full overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-red-500/10 rounded-2xl flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <div className="font-semibold">AI Помощник</div>
                        <div className="text-xs text-neutral-500">
                          по сайту {state.url}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={chat.clearCurrentChat}
                        className="text-neutral-400 hover:text-red-400 px-3 py-1 text-xs hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        Очистить
                      </button>
                      {/* Кнопка развернуть/свернуть */}
                      <button
                        onClick={() => setIsChatExpanded(!isChatExpanded)}
                        className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-xl transition-colors"
                        title={isChatExpanded ? "Свернуть" : "Развернуть"}
                      >
                        {isChatExpanded ? (
                          <Minimize2 className="w-5 h-5" />
                        ) : (
                          <Maximize2 className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => state.setChatOpen(false)}
                        className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm custom-scroll">
                    {chat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-3xl px-5 py-3.5 ${
                            msg.type === "user"
                              ? "bg-red-600 text-white"
                              : "bg-neutral-800 text-neutral-200"
                          }`}
                        >
                          {msg.type === "user" ? (
                            <p className="whitespace-pre-wrap wrap-break-word">
                              {msg.text}
                            </p>
                          ) : (
                            <MarkdownMessage text={msg.text} />
                          )}
                        </div>
                      </div>
                    ))}
                    {chat.isSending && (
                      <div className="flex justify-start">
                        <div className="bg-neutral-800 rounded-3xl px-5 py-3 flex items-center gap-3">
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                          <span className="text-neutral-400 text-sm">
                            AI думает...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-neutral-800 shrink-0">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={chat.inputMessage}
                        onChange={(e) => chat.setInputMessage(e.target.value)}
                        onKeyPress={chat.handleKeyPress}
                        placeholder="Задайте вопрос по SEO, контенту или продвижению..."
                        disabled={chat.isSending}
                        className="flex-1 bg-dark-800 border border-neutral-700 focus:border-red-500 rounded-2xl px-5 py-3.5 text-white placeholder:text-neutral-500 focus:outline-none transition-all disabled:opacity-70"
                      />
                      <button
                        onClick={chat.sendMessage}
                        disabled={!chat.inputMessage.trim() || chat.isSending}
                        className="bg-red-600 hover:bg-red-500 disabled:bg-neutral-700 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0"
                      >
                        {chat.isSending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
