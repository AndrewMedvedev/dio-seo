import { useState } from "react";
import {
  BarChart3,
  FileText,
  Zap,
  Target,
  Award,
  Users,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Heading1,
  Link as LinkIcon,
  Image as ImageIcon,
  BookOpen,
  Tag,
  Award as Trophy,
  ChevronDown,
  Database,
} from "lucide-react";
import ScoreCircle from "./ScoreCircle";

export default function SeoReport({ content }) {
  const data = content || {};

  // Основные данные
  const seoResult = data.seo_result || {};
  const analystResult = data.analyst_result || {};
  const contentGen = data.content_generation_result || {};
  const analyzeMd = seoResult.analyze_md || {};
  const performance = seoResult.performance || {};
  const seoScore = seoResult.seo?.score || 0;
  const performanceScore = performance.score || 0;

  // Состояния для сворачивания блоков
  const [headersOpen, setHeadersOpen] = useState(true);
  const [imagesOpen, setImagesOpen] = useState(true);

  const getSeverityStyle = (severity) => {
    if (severity === "critical") return "bg-red-600 text-white border-red-600";
    if (severity === "high")
      return "bg-orange-600 text-white border-orange-600";
    return "bg-yellow-600 text-white border-yellow-600";
  };

  const getDensityColor = (density) => {
    if (density == null) return "#64748b";
    if (density <= 2.0) return "#10b981";
    if (density <= 5.0) return "#f59e0b";
    return "#ef4444";
  };

  const normalizeToMs = (value) => {
    if (value == null) return null;
    if (value < 10) return Math.round(value * 1000);
    return Math.round(value);
  };

  const getLcpColor = (lcp) => {
    const ms = normalizeToMs(lcp);
    if (ms === null) return "text-neutral-400";
    if (ms <= 2500) return "text-emerald-400";
    if (ms <= 4000) return "text-yellow-400";
    return "text-red-400";
  };

  const getInpColor = (inp) => {
    const ms = normalizeToMs(inp);
    if (ms === null) return "text-neutral-400";
    if (ms <= 200) return "text-emerald-400";
    if (ms <= 500) return "text-yellow-400";
    return "text-red-400";
  };

  const getClsColor = (cls) => {
    if (cls == null) return "text-neutral-400";
    if (cls <= 0.1) return "text-emerald-400";
    if (cls <= 0.25) return "text-yellow-400";
    return "text-red-400";
  };

  const getReadabilityColor = (lcp) => {
    const ms = normalizeToMs(lcp);
    if (ms === null) return "text-neutral-400";
    if (ms >= 65) return "text-emerald-400";
    if (40 <= ms <= 64) return "text-yellow-400";
    return "text-red-400";
  };

  // Группировка заголовков по тегам
  const headersData = analyzeMd.headers || [];
  const groupedHeaders = headersData.reduce((acc, header) => {
    const tag = header.tag || "h?";
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(header);
    return acc;
  }, {});

  const sortedTags = Object.keys(groupedHeaders).sort((a, b) => {
    const numA = parseInt(a.replace("h", "")) || 0;
    const numB = parseInt(b.replace("h", "")) || 0;
    return numA - numB;
  });

  // === ДОПОЛНИТЕЛЬНЫЕ ПОЛЯ ДЛЯ ОТРИСОВКИ ===

  // 1. Metadata (title, description, issues)
  const metadata = analyzeMd.metadata || {};

  // 2. Readability issues
  const readabilityIssues = analyzeMd.readability?.issues || [];

  // 3. Strong structures — дополнительные поля (strong_constructions и т.д.)
  const strongStructures = analyzeMd.strong_structures || {};

  // 4. Performance summary
  const performanceSummary = performance.summary || "";

  // 5. SEO summary
  const seoSummary = seoResult.seo?.summary || "";

  // 6. Overall score из analyze_md (если есть)
  const overallScoreFromMd =
    analyzeMd.overall_score || seoResult.overall_score || null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-20">
      {/* Общие оценки */}
      <div>
        <h3 className="text-xl font-semibold mb-10 flex items-center gap-4">
          <BarChart3 className="w-7 h-7 text-violet-400" />
          Общие оценки сайта
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <ScoreCircle score={seoScore} label="SEO Score" />
          <ScoreCircle score={performanceScore} label="Performance Score" />
        </div>
      </div>

      {/* Общий обзор */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-4">
          <FileText className="w-7 h-7 text-neutral-400" />
          Общий обзор
        </h3>
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10">
          <p className="text-base leading-relaxed text-neutral-300 wrap-break-word">
            {seoResult.overall_summary || "Обзор отсутствует"}
          </p>
        </div>
      </div>

      {/* SEO Summary (добавлено) */}
      {seoSummary && (
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-4">
            <BarChart3 className="w-7 h-7 text-violet-400" />
            Краткое содержание
          </h3>
          <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10">
            <p className="text-base leading-relaxed text-neutral-300 wrap-break-word">
              {seoSummary}
            </p>
          </div>
        </div>
      )}

      {/* Анализ контента */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-4">
          <FileText className="w-7 h-7 text-amber-400" />
          Анализ контента
        </h3>
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 text-base leading-relaxed text-neutral-300 wrap-wrap-break-words">
          {seoResult.content_analysis || "Анализ контента отсутствует"}
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h3 className="text-xl font-semibold mb-8 flex items-center gap-4">
          <Zap className="w-7 h-7 text-orange-400" />
          Core Web Vitals
        </h3>
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 mb-8 text-base leading-relaxed text-neutral-300 wrap-break-words">
          {seoResult.core_web_vitals_analysis ||
            "Данные Core Web Vitals отсутствуют"}
        </div>

        {/* Performance Summary (добавлено) */}
        {performanceSummary && (
          <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 mb-8 text-base leading-relaxed text-neutral-300">
            {performanceSummary}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-center">
            <div className="text-neutral-400 text-xs uppercase tracking-widest mb-3">
              LCP
            </div>
            <div
              className={`text-4xl font-semibold ${getLcpColor(performance.lcp)}`}
            >
              {performance.lcp ? `${performance.lcp}мс` : "—"}
            </div>
          </div>
          <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-center">
            <div className="text-neutral-400 text-xs uppercase tracking-widest mb-3">
              CLS
            </div>
            <div
              className={`text-4xl font-semibold ${getClsColor(performance.cls)}`}
            >
              {performance.cls ?? "—"}
            </div>
          </div>
          <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-center">
            <div className="text-neutral-400 text-xs uppercase tracking-widest mb-3">
              FID / INP
            </div>
            <div
              className={`text-4xl font-semibold ${getInpColor(performance.fid)}`}
            >
              {performance.fid ? `${performance.fid}мс` : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Детальный анализ контента */}
      <div>
        <h3 className="text-xl font-semibold mb-10 flex items-center gap-4">
          <BookOpen className="w-7 h-7 text-sky-400" />
          Детальный анализ контента
        </h3>
        <div className="space-y-16">
          {/* Заголовки — существующий код без изменений */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Heading1 className="w-7 h-7 text-violet-400" />
                <div>
                  <div className="font-semibold text-xl">Заголовки</div>
                  <div className="text-neutral-500 text-sm">
                    Структура H1–H6 и SEO-релевантность
                  </div>
                </div>
              </div>
              <button
                onClick={() => setHeadersOpen(!headersOpen)}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 transition-all text-sm"
              >
                <span className="font-medium">
                  {headersOpen ? "Свернуть" : "Развернуть"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${headersOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            {headersOpen && (
              <div className="bg-dark-800 border border-neutral-800 rounded-3xl overflow-hidden">
                {headersData.length > 0 ? (
                  <div>
                    {sortedTags.map((tag) => {
                      const group = groupedHeaders[tag];
                      return (
                        <div
                          key={tag}
                          className="border-b border-neutral-800 last:border-b-0"
                        >
                          <div className="px-8 py-6 bg-neutral-950 flex items-center gap-4">
                            <div className="inline-block bg-violet-600 text-white text-xs font-mono px-5 py-2 rounded-2xl">
                              {tag.toUpperCase()}
                            </div>
                            <div className="text-neutral-400 text-sm">
                              {group.length} заголовков
                            </div>
                          </div>
                          <div className="divide-y divide-neutral-800">
                            {group.map((header, index) => (
                              <div
                                key={`${tag}-${index}`}
                                className="p-8 flex flex-col md:flex-row gap-8"
                              >
                                <div className="w-24 shrink-0">
                                  <div className="inline-block bg-neutral-900 text-neutral-400 text-xs font-mono px-4 py-2 rounded-2xl">
                                    {header.tag}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-lg text-neutral-100 leading-relaxed wrap-break-words">
                                    {header.text}
                                  </div>
                                  <div className="flex flex-wrap gap-3 mt-5">
                                    <div
                                      className={`text-xs px-4 py-2 rounded-2xl ${
                                        header.contains_keywords
                                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                          : "bg-neutral-800 text-neutral-500"
                                      }`}
                                    >
                                      {header.contains_keywords
                                        ? "✓ Содержит ключевые слова"
                                        : "Не содержит ключевые слова"}
                                    </div>
                                    {header.issues?.length > 0 && (
                                      <div className="text-xs px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl">
                                        {header.issues.join(", ")}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-16 text-center text-neutral-500 text-base">
                    Заголовки не обнаружены
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metadata (добавлено новое поле) */}
          {Object.keys(metadata).length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <FileText className="w-7 h-7 text-neutral-400" />
                <div>
                  <div className="font-semibold text-xl">Мета-теги</div>
                  <div className="text-neutral-500 text-sm">
                    Title, Description и проблемы
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 space-y-6">
                <div>
                  <div className="text-neutral-500 text-xs mb-1">TITLE</div>
                  <div className="text-neutral-100 text-base wrap-break-word">
                    {metadata.title || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500 text-xs mb-1">
                    DESCRIPTION
                  </div>
                  <div className="text-neutral-100 text-base wrap-break-word">
                    {metadata.description || "—"}
                  </div>
                </div>
                {metadata.issues && metadata.issues.length > 0 && (
                  <div>
                    <div className="text-red-400 text-base mb-3">
                      ПРОБЛЕМЫ МЕТА-ТЕГОВ
                    </div>
                    <div className="space-y-2">
                      {metadata.issues.map((issue, i) => (
                        <div
                          key={i}
                          className="text-red-400 text-sm flex gap-2"
                        >
                          <span>⚠</span> {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ключевые слова и плотность — существующий код без изменений */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Tag className="w-7 h-7 text-amber-400" />
              <div>
                <div className="font-semibold text-xl">
                  Ключевые слова и плотность
                </div>
                <div className="text-neutral-500 text-sm">
                  Частота и плотность употребления
                </div>
              </div>
            </div>
            <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 overflow-x-auto">
              {analyzeMd.keywords?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                  {analyzeMd.keywords.map((kw, i) => {
                    const densityColor = getDensityColor(kw.density);
                    return (
                      <div
                        key={i}
                        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0"
                      >
                        <div className="font-medium text-base text-neutral-100 wrap-break-words hyphens-auto min-w-0">
                          {kw.keyword}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-x-10 gap-y-2 text-xs flex-wrap">
                          <div>
                            <span className="text-neutral-500">Частота: </span>
                            <span className="font-semibold text-white">
                              {kw.count}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-500">
                              Плотность:{" "}
                            </span>
                            <span
                              className="font-semibold"
                              style={{ color: densityColor }}
                            >
                              {kw.density.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-neutral-500 text-center py-12 text-base">
                  Данные по ключевым словам отсутствуют
                </p>
              )}
            </div>
          </div>

          {/* Ссылки — существующий код без изменений */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <LinkIcon className="w-7 h-7 text-rose-400" />
              <div>
                <div className="font-semibold text-xl">Ссылки</div>
                <div className="text-neutral-500 text-sm">
                  Анализ внутренних и внешних ссылок
                </div>
              </div>
            </div>
            <div className="bg-dark-800 border border-neutral-800 rounded-3xl overflow-hidden">
              {analyzeMd.links?.length > 0 ? (
                <div className="divide-y divide-neutral-800">
                  {analyzeMd.links.map((link, i) => (
                    <div key={i} className="p-8">
                      <div className="break-all text-neutral-400 mb-3 text-xs leading-relaxed">
                        {link.url}
                      </div>
                      <div className="text-neutral-200 text-base mb-4 wrap-break-words">
                        Анкор:{" "}
                        <span className="font-medium">
                          "{link.anchor_text}"
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div
                          className={`px-5 py-2 text-xs font-medium rounded-2xl ${
                            link.is_internal
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          }`}
                        >
                          {link.is_internal ? "Внутренняя" : "Внешняя"}
                        </div>
                        {link.is_broken && (
                          <div className="px-5 py-2 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl">
                            Битая ссылка
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center text-neutral-500 text-base">
                  Ссылки не обнаружены
                </div>
              )}
            </div>
          </div>

          {/* Изображения — существующий код без изменений */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <ImageIcon className="w-7 h-7 text-cyan-400" />
                <div>
                  <div className="font-semibold text-xl">
                    Изображения и alt-тексты
                  </div>
                  <div className="text-neutral-500 text-sm">
                    SEO-оптимизация изображений
                  </div>
                </div>
              </div>
              <button
                onClick={() => setImagesOpen(!imagesOpen)}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 transition-all text-sm"
              >
                <span className="font-medium">
                  {imagesOpen ? "Свернуть" : "Развернуть"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${imagesOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            {imagesOpen && (
              <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10">
                {analyzeMd.images?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {analyzeMd.images.map((img, i) => (
                      <div
                        key={i}
                        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7"
                      >
                        <div className="text-xs text-neutral-400 mb-4 break-all leading-relaxed">
                          {img.src}
                        </div>
                        <div className="font-medium text-neutral-200 mb-4 text-base wrap-break-words">
                          Alt:{" "}
                          <span className="text-neutral-300 font-normal">
                            "{img.alt_text || "—"}"
                          </span>
                        </div>
                        <div
                          className={`inline-block px-5 py-2 text-xs rounded-2xl ${
                            img.has_keywords
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-neutral-800 text-neutral-500"
                          }`}
                        >
                          {img.has_keywords
                            ? "Содержит ключевые слова"
                            : "Не содержит ключевые слова"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-center py-12 text-base">
                    Изображения не обнаружены
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Читабельность — существующий код + добавлены issues */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <BookOpen className="w-7 h-7 text-lime-400" />
              <div className="font-semibold text-xl">Читабельность текста</div>
            </div>
            <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-neutral-500 text-xs">Слов</div>
                <div className="text-3xl font-semibold mt-3 text-neutral-100">
                  {analyzeMd.readability?.word_count || "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs">Предложений</div>
                <div className="text-3xl font-semibold mt-3 text-neutral-100">
                  {analyzeMd.readability?.sentence_count || "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs">Абзацев</div>
                <div className="text-3xl font-semibold mt-3 text-neutral-100">
                  {analyzeMd.readability?.paragraphs_count || "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs">
                  Индекс читабельности
                </div>
                <div
                  className={`text-3xl font-semibold mt-3 ${getReadabilityColor(analyzeMd.readability?.readability_score)}`}
                >
                  {analyzeMd.readability?.readability_score || "—"}
                </div>
              </div>
            </div>

            {/* Issues читабельности (добавлено) */}
            {readabilityIssues.length > 0 && (
              <div className="mt-6 bg-dark-800 border border-neutral-800 rounded-3xl p-8">
                <div className="text-red-400 text-base mb-4">
                  Проблемы читабельности:
                </div>
                <ul className="space-y-2 text-neutral-300">
                  {readabilityIssues.map((issue, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-red-400 mt-0.5">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Сильные структуры и стиль — существующий код без изменений */}
          {analyzeMd.strong_structures && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <Trophy className="w-7 h-7 text-purple-400" />
                <div>
                  <div className="font-semibold text-xl">
                    Сильные риторические конструкции
                  </div>
                  <div className="text-neutral-500 text-sm">
                    Стиль письма и влияние на читателя
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-10 space-y-12">
                <div>
                  <div className="uppercase text-xs tracking-widest text-neutral-500 mb-4">
                    Стиль текста
                  </div>
                  <div className="text-lg text-neutral-200 leading-relaxed wrap-break-words">
                    {strongStructures.writing_style}
                  </div>
                </div>
                <div>
                  <div className="uppercase text-xs tracking-widest text-neutral-500 mb-4">
                    Влияние на читателя
                  </div>
                  <div className="text-neutral-300 leading-relaxed text-base wrap-break-words">
                    {strongStructures.influence_on_reader}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <div className="uppercase text-xs tracking-widest text-neutral-500 mb-4">
                      Влияние на SEO
                    </div>
                    <div className="text-neutral-300 leading-relaxed text-base wrap-break-words">
                      {strongStructures.influence_on_seo}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase text-xs tracking-widest text-neutral-500 mb-4">
                      Влияние на конверсию
                    </div>
                    <div className="text-neutral-300 leading-relaxed text-base wrap-break-words">
                      {strongStructures.influence_on_conversion}
                    </div>
                  </div>
                </div>

                {strongStructures.strong_constructions?.length > 0 && (
                  <div>
                    <div className="uppercase text-xs tracking-widest text-neutral-500 mb-6">
                      Сильные конструкции
                    </div>
                    <div className="space-y-4">
                      {strongStructures.strong_constructions.map((ex, i) => (
                        <div
                          key={i}
                          className="bg-neutral-900 border-l-4 border-purple-500 pl-7 py-6 text-neutral-200 italic text-base leading-relaxed wrap-break-words"
                        >
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {strongStructures.examples?.length > 0 && (
                  <div>
                    <div className="uppercase text-xs tracking-widest text-neutral-500 mb-6">
                      Примеры сильных конструкций
                    </div>
                    <div className="space-y-5">
                      {strongStructures.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="bg-neutral-900 border-l-4 border-purple-500 pl-7 py-6 text-neutral-200 italic text-base leading-relaxed wrap-break-words"
                        >
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {strongStructures.recommendations?.length > 0 && (
                  <div>
                    <div className="uppercase text-xs tracking-widest text-neutral-500 mb-6">
                      Рекомендации по стилю
                    </div>
                    <div className="space-y-4 text-neutral-300 text-base">
                      {strongStructures.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="text-emerald-400 mt-1 text-base">
                            •
                          </span>
                          <span className="wrap-break-words">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Специализация компании — существующий код без изменений */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-4">
          <Target className="w-7 h-7 text-blue-400" />
          Специализация компании
        </h3>
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 text-base leading-relaxed text-neutral-200 wrap-break-words">
          {analystResult.specialization?.specialization || "Не указано"}
        </div>
      </div>

      {/* Основная область экспертизы — существующий код без изменений */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-4">
          <Award className="w-7 h-7 text-emerald-400" />
          Основная область экспертизы
        </h3>
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 text-base leading-relaxed text-neutral-200 wrap-break-words">
          {analystResult.expertise?.main_area || "Данные отсутствуют"}
        </div>
      </div>

      {/* Ключевые проблемы клиентов — существующий код без изменений */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-4">
          <Users className="w-7 h-7 text-rose-400" />
          Ключевые проблемы клиентов
        </h3>
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 text-base leading-relaxed text-neutral-300 wrap-break-words">
          {analystResult.expertise?.key_user_problem || "Не указано"}
        </div>
      </div>

      {/* Преимущества для клиента — существующий код без изменений */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-4">
          <Lightbulb className="w-7 h-7 text-yellow-400" />
          Преимущества для клиента
        </h3>
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10 text-base leading-relaxed text-neutral-300 wrap-break-words">
          {analystResult.expertise?.benefit_to_the_user || "Не указано"}
        </div>
      </div>

      {/* Семантическое ядро — существующий код без изменений */}
      <div>
        <h3 className="text-xl font-semibold mb-8 flex items-center gap-4">
          <Database className="w-7 h-7 text-indigo-400" />
          Семантическое ядро
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="text-emerald-400 font-semibold text-base">
              Высокая частота
            </div>
            <div className="flex flex-wrap gap-3">
              {data.analyst_result?.semantic_core?.high_frequency?.map(
                (kw, i) => (
                  <span
                    key={i}
                    className="bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-3xl text-xs border border-emerald-500/20 wrap-break-words"
                  >
                    {kw}
                  </span>
                ),
              ) || <span className="text-neutral-500 text-sm">—</span>}
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-yellow-400 font-semibold text-base">
              Средняя частота
            </div>
            <div className="flex flex-wrap gap-3">
              {data.analyst_result?.semantic_core?.medium_frequency?.map(
                (kw, i) => (
                  <span
                    key={i}
                    className="bg-yellow-500/10 text-yellow-400 px-5 py-2 rounded-3xl text-xs border border-yellow-500/20 wrap-break-words"
                  >
                    {kw}
                  </span>
                ),
              ) || <span className="text-neutral-500 text-sm">—</span>}
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-orange-400 font-semibold text-base">
              Низкая частота
            </div>
            <div className="flex flex-wrap gap-3">
              {data.analyst_result?.semantic_core?.low_frequency?.map(
                (kw, i) => (
                  <span
                    key={i}
                    className="bg-orange-500/10 text-orange-400 px-5 py-2 rounded-3xl text-xs border border-orange-500/20 wrap-break-words"
                  >
                    {kw}
                  </span>
                ),
              ) || <span className="text-neutral-500 text-sm">—</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Найденные проблемы — существующий код без изменений */}
      <div>
        <h3 className="text-xl font-semibold mb-8 flex items-center gap-4">
          <AlertTriangle className="w-7 h-7 text-red-400" />
          Найденные проблемы
        </h3>
        <div className="space-y-8">
          {seoResult.issues?.length > 0 ? (
            seoResult.issues.map((issue, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 md:p-10"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div
                    className={`px-7 py-2 text-xs font-semibold rounded-2xl border uppercase tracking-widest self-start shrink-0 ${getSeverityStyle(
                      issue.severity,
                    )}`}
                  >
                    {issue.severity?.toUpperCase() || "ISSUE"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg mb-5 leading-tight wrap-break-words">
                      {issue.title}
                    </div>
                    <p className="text-neutral-400 leading-relaxed mb-7 text-base wrap-break-words">
                      {issue.description}
                    </p>
                    <div className="text-emerald-400 text-base leading-relaxed wrap-break-words">
                      <span className="font-medium">Рекомендация: </span>
                      {issue.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-base">Проблемы не обнаружены</p>
          )}
        </div>
      </div>

      {/* Рекомендации — существующий код без изменений */}
      <div>
        <h3 className="text-xl font-semibold mb-8 flex items-center gap-4">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
          Рекомендации
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seoResult.recommendations?.length > 0 ? (
            seoResult.recommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 flex gap-6"
              >
                <div className="w-7 h-7 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-1 text-base">
                  ✓
                </div>
                <p className="text-neutral-200 text-base leading-relaxed wrap-break-words">
                  {rec}
                </p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-base">
              Рекомендации отсутствуют
            </p>
          )}
        </div>
      </div>

      {/* Сгенерированный SEO-контент — существующий код без изменений */}
      <div className="bg-dark-900 border border-neutral-800 rounded-3xl p-8 md:p-12">
        <h3 className="text-xl font-semibold mb-10 flex items-center gap-4">
          <Sparkles className="w-7 h-7 text-purple-400" />
          Сгенерированный SEO-контент
        </h3>
        <div className="space-y-12">
          <div>
            <div className="uppercase text-xs tracking-widest text-neutral-500 mb-4">
              H1 заголовок
            </div>
            <p className="text-xl text-neutral-100 wrap-break-words">
              {contentGen.h1 || "—"}
            </p>
          </div>
          <div>
            <div className="uppercase text-xs tracking-widest text-neutral-500 mb-4">
              Title
            </div>
            <p className="text-xl text-neutral-100 wrap-break-words">
              {contentGen.title || "—"}
            </p>
          </div>
          <div>
            <div className="uppercase text-xs tracking-widest text-neutral-500 mb-4">
              Description
            </div>
            <p className="text-xl text-neutral-100 wrap-break-words">
              {contentGen.description || "—"}
            </p>
          </div>
          <div>
            <div className="uppercase text-xs tracking-widest text-neutral-500 mb-6">
              Alt-тексты изображений
            </div>
            <div className="space-y-6">
              {Array.isArray(contentGen.alt_tags) &&
              contentGen.alt_tags.length > 0 ? (
                contentGen.alt_tags.flat().map((item, i) => (
                  <div
                    key={i}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
                  >
                    <div className="font-medium text-lg mb-4 wrap-break-words">
                      {item?.alt ? item.alt : "Alt-текст отсутствует"}
                    </div>
                    {item?.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neutral-400 hover:text-white break-all transition-colors"
                      >
                        {item.url}
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-base">
                  Alt-тексты не сгенерированы
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Стоимость анализа — существующий код без изменений */}
      <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <div className="text-neutral-300 text-base mb-1">
            Стоимость анализа
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            {data.total_money ? data.total_money.toFixed(2) : "0.00"} ₽
          </div>
        </div>
        <div className="text-right">
          <div className="text-neutral-300 text-base mb-1">
            Использовано токенов
          </div>
          <div className="text-3xl font-bold text-white">
            {data.total_tokens
              ? data.total_tokens.toLocaleString("ru-RU")
              : "0"}
          </div>
        </div>
      </div>
    </div>
  );
}
