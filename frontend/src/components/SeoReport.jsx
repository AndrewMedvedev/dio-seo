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
} from "lucide-react";

import ScoreCircle from "./ScoreCircle";

export default function SeoReport({ content }) {
  const data = content || {};

  // Основные данные
  const seoResult = data.seo_result || {};
  const analystResult = data.analyst_result || {};
  const contentGen = data.content_generation_result || {};
  const performance = seoResult.performance || {};
  const seo = seoResult.seo || {};
  const seoScore = seo.score || 0;
  const performanceScore = performance.score || 0;

  const getSeverityStyle = (severity) => {
    if (severity === "critical") return "bg-red-600 text-white border-red-600";
    if (severity === "high")
      return "bg-orange-600 text-white border-orange-600";
    return "bg-yellow-600 text-white border-yellow-600";
  };

  // Цвета для Core Web Vitals
  const getLcpColor = (lcp) => {
    if (lcp == null) return "text-neutral-400";
    if (lcp <= 2.5) return "text-emerald-400";
    if (lcp <= 4) return "text-yellow-400";
    return "text-red-400";
  };

  const getInpColor = (inp) => {
    if (inp == null) return "text-neutral-400";
    if (inp <= 200) return "text-emerald-400";
    if (inp <= 500) return "text-yellow-400";
    return "text-red-400";
  };

  const getClsColor = (cls) => {
    if (cls == null) return "text-neutral-400";
    if (cls <= 0.1) return "text-emerald-400";
    if (cls <= 0.25) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-16">
      {/* Общие оценки */}
      <div>
        <h3 className="text-xl font-semibold mb-8 flex items-center gap-3">
          <BarChart3 className="text-violet-400" /> Общие оценки сайта
        </h3>
        <div className="grid grid-cols-2 gap-10">
          <ScoreCircle score={seoScore} label="SEO Score" />
          <ScoreCircle score={performanceScore} label="Performance Score" />
        </div>
      </div>

      {/* Общий обзор */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
          <FileText className="text-neutral-400" /> Общий обзор
        </h3>
        <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-neutral-300 leading-relaxed">
          <p className="text-lg text-neutral-300 leading-relaxed">
            {seoResult.overall_summary || "Обзор отсутствует"}
          </p>
        </div>
      </div>

      {/* Анализ контента */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
          <FileText className="text-amber-400" /> Анализ контента
        </h3>
        <div className="text-lg bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-neutral-300 leading-relaxed">
          {seoResult.content_analysis || "Анализ контента отсутствует"}
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
          <Zap className="text-orange-400" /> Core Web Vitals
        </h3>
        <div className="text-lg bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-neutral-300 leading-relaxed">
          {seoResult.core_web_vitals_analysis ||
            "Данные Core Web Vitals отсутствуют"}
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* LCP */}
          <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-6 text-center">
            <div className="text-neutral-400 text-sm">LCP</div>
            <div
              className={`text-4xl font-semibold mt-2 ${getLcpColor(
                performance.lcp,
              )}`}
            >
              {performance.lcp ? `${performance.lcp}с` : "—"}
            </div>
          </div>
          {/* CLS */}
          <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-6 text-center">
            <div className="text-neutral-400 text-sm">CLS</div>
            <div
              className={`text-4xl font-semibold mt-2 ${getClsColor(
                performance.cls,
              )}`}
            >
              {performance.cls ?? "—"}
            </div>
          </div>
          {/* FID / INP */}
          <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-6 text-center">
            <div className="text-neutral-400 text-sm">FID / INP</div>
            <div
              className={`text-4xl font-semibold mt-2 ${getInpColor(
                performance.fid,
              )}`}
            >
              {performance.fid ? `${performance.fid} мс` : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Специализация компании */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
          <Target className="text-blue-400" /> Специализация компании
        </h3>
        <div className="text-lg bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-neutral-200 leading-relaxed">
          {analystResult.specialization?.specialization || "Не указано"}
        </div>
      </div>

      {/* Основная область экспертизы */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
          <Award className="text-emerald-400" /> Основная область экспертизы
        </h3>
        <div className="text-lg bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-neutral-200 leading-relaxed">
          {analystResult.expertise?.main_area || "Данные отсутствуют"}
        </div>
      </div>

      {/* Ключевые проблемы клиентов */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
          <Users className="text-rose-400" /> Ключевые проблемы клиентов
        </h3>
        <div className="text-lg bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-neutral-300 leading-relaxed">
          {analystResult.expertise?.key_user_problem || "Не указано"}
        </div>
      </div>

      {/* Преимущества для клиента */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
          <Lightbulb className="text-yellow-400" /> Преимущества для клиента
        </h3>
        <div className="text-lg bg-dark-800 border border-neutral-800 rounded-3xl p-8 text-neutral-300 leading-relaxed">
          {analystResult.expertise?.benefit_to_the_user || "Не указано"}
        </div>
      </div>

      {/* Семантическое ядро */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Семантическое ядро</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-emerald-400 font-medium mb-3">
              Высокая частота
            </div>
            <div className="text-lg flex flex-wrap gap-2">
              {data.analyst_result?.semantic_core?.high_frequency?.map(
                (kw, i) => (
                  <span
                    key={i}
                    className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-3xl text-sm"
                  >
                    {kw}
                  </span>
                ),
              )}
            </div>
          </div>
          <div>
            <div className="text-lg text-yellow-400 font-medium mb-3">
              Средняя частота
            </div>
            <div className="flex flex-wrap gap-2">
              {data.analyst_result?.semantic_core?.medium_frequency?.map(
                (kw, i) => (
                  <span
                    key={i}
                    className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-3xl text-sm"
                  >
                    {kw}
                  </span>
                ),
              )}
            </div>
          </div>
          <div>
            <div className="text-lg text-orange-400 font-medium mb-3">
              Низкая частота
            </div>
            <div className="text-lg flex flex-wrap gap-2">
              {data.analyst_result?.semantic_core?.low_frequency?.map(
                (kw, i) => (
                  <span
                    key={i}
                    className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-3xl text-sm"
                  >
                    {kw}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Найденные проблемы */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
          <AlertTriangle className="text-red-400" /> Найденные проблемы
        </h3>
        <div className="space-y-6">
          {seoResult.issues?.length > 0 ? (
            seoResult.issues.map((issue, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-neutral-800 rounded-3xl p-8"
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`px-6 py-1.5 text-xs font-semibold rounded-2xl border uppercase tracking-wider self-start ${getSeverityStyle(
                      issue.severity,
                    )}`}
                  >
                    {issue.severity?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-3">
                      {issue.title}
                    </div>
                    <p className="text-neutral-400 leading-relaxed mb-5">
                      {issue.description}
                    </p>
                    <div className="text-emerald-400 text-sm leading-relaxed">
                      <span className="font-medium">Рекомендация: </span>
                      {issue.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500">Проблемы не обнаружены</p>
          )}
        </div>
      </div>

      {/* Рекомендации */}
      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
          <CheckCircle className="text-emerald-400" /> Рекомендации
        </h3>
        <div className="text-lg grid grid-cols-1 md:grid-cols-2 gap-5">
          {seoResult.recommendations?.length > 0 ? (
            seoResult.recommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-dark-800 border border-neutral-800/70 rounded-3xl p-6 flex gap-4"
              >
                <div className="w-6 h-6 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-neutral-200">{rec}</p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500">Рекомендации отсутствуют</p>
          )}
        </div>
      </div>

      {/* Сгенерированный SEO-контент */}
      <div className="border border-neutral-800 rounded-3xl p-8 bg-dark-900">
        <h3 className="text-xl font-semibold mb-8 flex items-center gap-3">
          <Sparkles className="text-purple-400" /> Сгенерированный SEO-контент
        </h3>
        <div className="space-y-10">
          <div>
            <div className="uppercase text-xs tracking-widest text-neutral-500 mb-3">
              H1 заголовок
            </div>
            <p className="text-lg">{contentGen.h1 || "—"}</p>
          </div>
          <div>
            <div className="uppercase text-xs tracking-widest text-neutral-500 mb-3">
              Title
            </div>
            <p className="text-lg">{contentGen.title || "—"}</p>
          </div>
          <div>
            <div className="uppercase text-xs tracking-widest text-neutral-500 mb-3">
              Description
            </div>
            <p className="text-lg text-neutral-300 leading-relaxed">
              {contentGen.description || "—"}
            </p>
          </div>
          <div>
            <div className="uppercase text-xs tracking-widest text-neutral-500 mb-4">
              Alt-тексты изображений
            </div>
            <div className="space-y-4">
              {Array.isArray(contentGen.alt_tags) &&
              contentGen.alt_tags.length > 0 ? (
                contentGen.alt_tags.flat().map((item, i) => (
                  <div
                    key={i}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
                  >
                    <div className="font-medium mb-2 wrap-break-word">
                      {item?.alt ? item.alt : "Alt-текст отсутствует"}
                    </div>
                    {item?.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neutral-400 hover:text-white break-all"
                      >
                        {item.url}
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-neutral-500">Alt-тексты не сгенерированы</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Стоимость анализа */}
      <div className="bg-dark-800 border border-neutral-800 rounded-3xl p-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-sm text-neutral-200">Стоимость анализа</div>
            <div className="text-3xl font-bold text-emerald-400">
              {data.total_money ? data.total_money.toFixed(2) : "0.00"} ₽
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-200">Использовано токенов</div>
          <div className="text-3xl font-bold">
            {data.total_tokens
              ? data.total_tokens.toLocaleString("ru-RU")
              : "0"}
          </div>
        </div>
      </div>
    </div>
  );
}
