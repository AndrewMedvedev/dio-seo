import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("intro");

  const sections = [
    { id: "intro", title: "О сервисе", icon: "✦" },
    { id: "main", title: "Анализ сайта", icon: "📊" },
    { id: "content", title: "AIO-контент", icon: "📝" },
    { id: "howto", title: "Как работать", icon: "⚡" },
    { id: "tips", title: "Советы", icon: "💡" },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden py-16">
      <div className="fixed inset-0 bg-linear-to-br from-red-950/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-16 relative">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tighter leading-none mb-3 bg-linear-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            AI SEO Анализатор
          </h1>
          <p className="text-2xl text-zinc-400">Генератор умного контента</p>
        </div>

        {/* Навигация */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`group flex items-center gap-3 px-8 py-4 rounded-3xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                activeSection === section.id
                  ? "bg-linear-to-r from-red-600 to-pink-600 text-white shadow-xl shadow-red-500/50"
                  : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white"
              }`}
            >
              <span className="text-xl group-hover:rotate-12 transition-transform">
                {section.icon}
              </span>
              {section.title}
            </button>
          ))}
        </div>

        {/* Контент */}
        <div className="min-h-125 transition-all duration-500">
          {activeSection === "intro" && (
            <div className="space-y-8">
              <div className="bg-linear-to-br from-zinc-950 to-black border border-zinc-800 rounded-3xl p-12">
                <h2 className="text-4xl font-semibold mb-6">
                  Интеллектуальный SEO-помощник
                </h2>
                <p className="text-xl text-zinc-300 leading-relaxed">
                  AI SEO Анализатор анализирует ваш сайт, выявляет проблемы и
                  мгновенно создаёт оптимизированный коммерческий контент.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  "Глубокий SEO-аудит сайта",
                  "Анализ скорости и Core Web Vitals",
                  "Генерация готового AIO-контента",
                  "Персональные рекомендации",
                  "Умный AI-помощник",
                  "История всех анализов",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500/40 rounded-3xl p-8 transition-all flex gap-5"
                  >
                    <div className="text-red-400 text-2xl">✦</div>
                    <div className="text-lg text-zinc-200">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "main" && (
            <div className="space-y-8">
              <h2 className="text-4xl font-semibold text-center mb-10">
                Анализ сайта
              </h2>
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-12 text-center">
                <div className="flex justify-center gap-16 mb-12">
                  <div>
                    <div className="text-8xl font-bold text-emerald-400">
                      93
                    </div>
                    <div className="mt-2 text-emerald-500 font-medium">
                      SEO Score
                    </div>
                  </div>
                  <div>
                    <div className="text-8xl font-bold text-emerald-400">
                      100
                    </div>
                    <div className="mt-2 text-emerald-500 font-medium">
                      Performance
                    </div>
                  </div>
                </div>
                <p className="text-zinc-400 max-w-lg mx-auto">
                  Получите полную картину состояния сайта и понятные
                  рекомендации от ИИ
                </p>
              </div>
            </div>
          )}

          {activeSection === "content" && (
            <div className="space-y-8">
              <h2 className="text-4xl font-semibold text-center mb-10">
                Сгенерированный AIO-контент
              </h2>

              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="p-10 border-b border-zinc-800 bg-black/60">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="uppercase text-red-400 text-xs tracking-widest font-medium">
                        Готовый контент
                      </div>
                      <div className="text-2xl font-semibold mt-3">
                        Коммерческая страница под ваш сайт
                      </div>
                    </div>
                    <div className="px-7 py-3 bg-red-600 rounded-2xl text-sm font-medium">
                      Скопировать
                    </div>
                  </div>
                </div>

                <div className="p-10 text-zinc-300 leading-relaxed">
                  Здесь будет полностью готовый SEO-оптимизированный текст для
                  страницы:
                  <ul className="mt-6 space-y-3 pl-5 list-disc marker:text-red-400">
                    <li>Правильная структура заголовков (H1, H2)</li>
                    <li>Коммерческие блоки и выгоды</li>
                    <li>Семантически насыщенный текст</li>
                    <li>Учёт всех ошибок, найденных при анализе</li>
                  </ul>
                  <div className="mt-8 pt-8 border-t border-zinc-800 text-sm text-zinc-400">
                    Ниже — подробные рекомендации, где именно и как лучше
                    разместить этот контент на вашем сайте.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "howto" && (
            <div className="space-y-8">
              <h2 className="text-4xl font-semibold text-center mb-12">
                Как работать с сервисом
              </h2>

              <div className="max-w-2xl mx-auto space-y-6">
                {[
                  "1. Вставьте URL вашего сайта",
                  "2. Нажмите кнопку «Анализировать»",
                  "3. Прочитайте рекомендации и обзор",
                  "4. Нажмите кнопку «Сгенерировать AIO-контент»",
                  "5. Скопируйте готовый текст",
                  "6. При необходимости задайте вопросы в чате AI Помощник",
                ].map((step, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-6 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-3xl p-7 transition-all duration-300 hover:bg-zinc-900"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-red-500 to-pink-600 flex items-center justify-center text-xl font-bold shrink-0 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <div className="text-xl text-zinc-200">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "tips" && (
            <div className="space-y-6">
              <h2 className="text-4xl font-semibold text-center mb-10">
                Полезные советы
              </h2>
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-linear-to-br from-zinc-950 to-black border border-red-900/30 rounded-3xl p-10 hover:border-red-500/40 transition-all">
                  <div className="text-3xl mb-4">💬</div>
                  <p className="text-lg text-zinc-300">
                    Активно общайтесь с{" "}
                    <span className="text-red-400">AI Помощником</span> — он
                    знает контекст вашего сайта и даёт точные советы.
                  </p>
                </div>

                <div className="bg-linear-to-br from-zinc-950 to-black border border-red-900/30 rounded-3xl p-10 hover:border-red-500/40 transition-all">
                  <div className="text-3xl mb-4">✍️</div>
                  <p className="text-lg text-zinc-300">
                    Контент уже оптимизирован с учётом всех найденных ошибок
                    анализа.
                  </p>
                </div>

                <div className="bg-linear-to-br from-zinc-950 to-black border border-red-900/30 rounded-3xl p-10 hover:border-red-500/40 transition-all">
                  <div className="text-3xl mb-4">🎯</div>
                  <p className="text-lg text-zinc-300">
                    Обязательно следуйте рекомендациям по размещению — это
                    значительно повышает эффективность контента.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Призыв к действию */}
        <div className="mt-20 text-center">
          <Link
            to="/seo"
            className="inline-block bg-linear-to-r from-red-600 via-pink-600 to-purple-600 text-white px-12 py-6 rounded-3xl text-xl font-semibold shadow-2xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Начать анализ сайта прямо сейчас →
          </Link>

          <p className="mt-6 text-zinc-500">
            Просто вставьте URL и получите результат
          </p>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
