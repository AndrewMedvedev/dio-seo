from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class HeaderAnalysis(BaseModel):
    """Анализ одного заголовка (H1–H6) на странице."""

    tag: str = Field(
        ..., description="HTML-тег заголовка, например 'h1', 'h2', 'h3'. Всегда в нижнем регистре."
    )
    text: str = Field(
        ...,
        description="Текст заголовка в том виде, как он отображается на странице (включая пробелы, но без HTML-тегов).",
    )
    contains_keywords: bool = Field(
        ...,
        description="True, если текст заголовка содержит хотя бы одно целевое ключевое слово (из списка, переданного для анализа). False – в противном случае.",
    )
    issues: list[str] | None = Field(
        default=[],
        description="Список проблем, связанных с этим заголовком (например: 'Пустой H1', 'Слишком длинный (более 70 символов)', 'Дублируется с другим заголовком'). Если проблем нет – пустой список.",
    )


class KeywordAnalysis(BaseModel):
    """Анализ одного ключевого слова или фразы."""

    keyword: str = Field(
        ...,
        description="Ключевое слово или фраза в исходном виде (как передано в запросе). Например: 'купить диван'.",
    )
    count: int = Field(
        ...,
        description="Общее количество вхождений этого ключевого слова/фразы в текст (без учёта регистра, учитываются точные совпадения).",
    )
    density: float = Field(
        ...,
        description="Плотность ключевого слова в тексте в процентах, округлённая до 2 знаков. Рассчитывается как (count * длина_слова * 100) / общее_количество_символов_текста. Значение от 0 до 100.",
    )


class LinkAnalysis(BaseModel):
    """Анализ одной ссылки на странице."""

    url: str = Field(
        ...,
        description="Полный URL (абсолютный или относительный, но после нормализации – абсолютный), на который ведёт ссылка. Пример: 'https://example.com/catalog'.",
    )
    anchor_text: str = Field(
        ...,
        description="Видимый текст ссылки (анкор). Если ссылка состоит только из изображения, то берётся атрибут alt изображения или пустая строка.",
    )
    is_internal: bool = Field(
        ...,
        description="True, если ссылка ведёт на тот же домен (включая поддомены). False – для внешних ссылок.",
    )
    is_broken: bool | None = Field(
        default=None,
        description="Статус доступности ссылки: True – ссылка битая (HTTP статус 4xx/5xx или таймаут), False – ссылка работает (2xx/3xx). None – если проверка не выполнялась.",
    )


class ImageAnalysis(BaseModel):
    """Анализ одного изображения на странице."""

    src: str = Field(
        ...,
        description="URL (абсолютный или относительный) изображения. Пример: '/images/photo.jpg' или 'https://cdn.example.com/img.png'.",
    )
    alt_text: str | None = Field(
        default=None,
        description="Значение атрибута alt для изображения. Если alt отсутствует – None. Если alt присутствует, но пустой – пустая строка ''.",
    )
    has_keywords: bool = Field(
        ...,
        description="True, если alt_text содержит хотя бы одно целевое ключевое слово (без учёта регистра). False – если alt_text отсутствует, пуст или не содержит ключевых слов.",
    )
    issues: list[str] | None = Field(
        default=[],
        description="Список проблем с изображением (например: 'Отсутствует alt', 'Слишком длинный alt (>125 символов)', 'Изображение не загружается'). Если нет проблем – пустой список.",
    )


class ReadabilityAnalysis(BaseModel):
    """Анализ читаемости текстового контента страницы (без учёта заголовков и служебных элементов)."""

    word_count: int = Field(
        ...,
        description="Общее количество слов в тексте. Слово – последовательность букв/цифр, ограниченная пробелами или знаками препинания.",
    )
    sentence_count: int = Field(
        ...,
        description="Количество предложений. Предложение заканчивается на '.', '!', '?' или '…' (многоточие считается одним).",
    )
    paragraphs_count: int = Field(
        ...,
        description="Количество абзацев – блоков текста, разделённых двумя и более переводами строк или тегами <p>.",
    )
    readability_score: float = Field(
        ...,
        description="Оценка читаемости по шкале от 1 до 100. Чем выше значение, тем легче читать текст. 90–100 – очень лёгкий (младшие классы), 60–70 – средний, 0–30 – очень сложный (научный). Используется формула Flesch-Kincaid или аналогичная.",
    )
    issues: list[str] | None = Field(
        default=[],
        description="Список проблем читаемости (например: 'Слишком длинные предложения (>25 слов)', 'Мало абзацев', 'Сложные слова без пояснений'). Если проблем нет – пустой список.",
    )


class MetadataAnalysis(BaseModel):
    """Анализ мета-тегов страницы: title и meta description."""

    title: str = Field(
        ..., description="Содержимое тега <title>. Если тег отсутствует – пустая строка ''."
    )
    description: str = Field(
        ...,
        description="Содержимое мета-тега name='description'. Если тег отсутствует – пустая строка ''.",
    )
    issues: list[str] = Field(
        default=[],
        description="Проблемы с мета-данными, например: 'Title отсутствует', 'Description длиннее 160 символов', 'Title короче 30 символов', 'Дублирование мета-тегов'. Если проблем нет – пустой список.",
    )


class StrongSentenceStructureAnalysis(BaseModel):
    """Анализ риторических приёмов и стиля текста для оценки вовлекающей силы контента."""

    strong_constructions: list[str] = Field(
        ...,
        description="Список названий сильных риторических конструкций, обнаруженных в тексте. Допустимые значения: 'parallelism' (параллелизм), 'triad' (триада), 'rhetorical_question' (риторический вопрос), 'anaphora' (анафора), 'epiphora' (эпифора), 'antithesis' (антитеза), 'metaphor' (метафора), 'hyperbole' (гипербола), 'climax' (климакс). Пример: ['triad', 'rhetorical_question'].",
    )
    writing_style: str = Field(
        ...,
        description="Преобладающий стиль письма. Одно из значений: 'selling' (продающий), 'expert' (экспертный), 'emotional' (эмоциональный), 'conversational' (разговорный), 'narrative' (повествовательный), 'academic' (академический).",
    )
    influence_on_reader: str = Field(
        ...,
        description="Описание эмоционального и когнитивного влияния конструкций на читателя (1–2 предложения). Например: 'Анафоры создают ритм и удерживают внимание, риторические вопросы заставляют задуматься, триады усиливают запоминаемость.'",
    )
    influence_on_seo: str = Field(
        ...,
        description="Как используемые конструкции и стиль влияют на SEO-метрики, не связанные напрямую с техническими факторами. Например: 'Параллелизм улучшает читаемость → увеличивает время на странице → положительно влияет на ранжирование.'",
    )
    influence_on_conversion: str = Field(
        ...,
        description="Влияние стиля и конструкций на конверсию (покупки, подписки, заявки). Пример: 'Триада преимуществ повышает доверие и подталкивает к действию, риторические вопросы снижают возражения.'",
    )
    examples: list[str] = Field(
        ...,
        description="Конкретные предложения (или их части) из анализируемого текста, которые демонстрируют найденные сильные конструкции. Пример: ['Вы хотите сэкономить?', 'Быстро, удобно, надёжно.']",
    )
    recommendations: list[str] = Field(
        ...,
        description="Практические рекомендации по усилению или добавлению риторических приёмов. Например: 'Добавьте триаду в первый абзац', 'Используйте риторический вопрос перед призывом к действию.'",
    )


class SEOAnalysisReport(BaseModel):
    """Полный SEO-отчёт по одной странице: структура, ключевые слова, ссылки, изображения, читаемость, мета-теги, риторика и общая оценка."""

    headers: list[HeaderAnalysis] = Field(
        ...,
        description="Список всех заголовков от H1 до H6 в порядке их появления на странице. Если заголовок отсутствует – не включается в список.",
    )
    keywords: list[KeywordAnalysis] = Field(
        ...,
        description="Список анализируемых ключевых слов (все, что были переданы для этого отчёта). Для каждого – количество и плотность.",
    )
    links: list[LinkAnalysis] = Field(
        ...,
        description="Список всех уникальных ссылок на странице (внутренних и внешних). Дубликаты ссылок не удаляются, каждая ссылка анализируется отдельно.",
    )
    images: list[ImageAnalysis] = Field(
        ...,
        description="Список всех изображений на странице (теги <img>). Каждое изображение – отдельный элемент.",
    )
    readability: ReadabilityAnalysis = Field(
        ...,
        description="Детальный анализ читаемости текстового контента (без учёта заголовков и служебных элементов).",
    )
    metadata: MetadataAnalysis = Field(
        ..., description="Анализ мета-тегов title и description, а также список проблем с ними."
    )
    strong_structures: StrongSentenceStructureAnalysis = Field(
        ..., description="Анализ риторических приёмов, стиля и влияния на читателя/SEO/конверсию."
    )
    overall_score: float = Field(
        ...,
        description="Итоговая SEO-оценка страницы от 0 до 100. Вычисляется как взвешенная сумма: 30% мета-теги и заголовки, 20% ключевые слова, 20% читаемость, 15% ссылки, 10% изображения, 5% риторика.",
    )
    recommendations: list[str] = Field(
        ...,
        description="Общие рекомендации по улучшению страницы, сформулированные в виде чётких действий. Примеры: 'Добавьте H1 длиной от 30 до 60 символов', 'Исправьте битые ссылки', 'Увеличьте плотность ключевого слова \"купить\" до 1.5%'.",
    )


class CWVMetricSummary(BaseModel):
    """Сводка по одной метрике Core Web Vitals (распределение пользователей и категория)."""

    category: str | None = Field(
        default=None,
        description="Категория метрики по данным Chrome User Experience Report. Одно из: 'Good', 'Needs Improvement', 'Poor' или None, если недостаточно данных.",
    )
    percentile: float | None = Field(
        default=None,
        description="75-й процентиль метрики (например, 2.5 секунды для LCP). Значение >=0. Если метрика не поддерживается – None.",
    )
    fast_percent: float | None = Field(
        default=None,
        description="Доля пользователей (в процентах от 0 до 100), для которых метрика находится в категории 'Good'. None – если нет данных.",
    )
    average_percent: float | None = Field(
        default=None,
        description="Доля пользователей (в процентах от 0 до 100), для которых метрика находится в категории 'Needs Improvement'. None – если нет данных.",
    )
    slow_percent: float | None = Field(
        default=None,
        description="Доля пользователей (в процентах от 0 до 100), для которых метрика находится в категории 'Poor'. None – если нет данных.",
    )

    @field_validator(
        "category",
        "percentile",
        "fast_percent",
        "average_percent",
        "slow_percent",
        mode="before",
    )
    @classmethod
    def parse_null_string(cls, v):
        """Преобразует строковое значение 'null' в None (для совместимости с API, которые возвращают 'null' вместо null)."""
        if v == "null":
            return None
        return v


class CWVReport(BaseModel):
    """Отчёт по Core Web Vitals и связанным с ними SEO-метрикам."""

    overall_category: str | None = Field(
        default=None,
        description="Общая категория сайта по Web Vitals: 'Good' (все три метрики LCP, INP, CLS в зелёной зоне), 'Poor' (хотя бы одна в красной зоне), 'Average' / 'Needs Improvement' (остальные случаи). None – если недостаточно данных.",
    )
    performance_score: float | None = Field(
        default=None,
        description="Performance Score от 0 до 100 (аналог Lighthouse Performance). Чем выше, тем лучше. Вычисляется на основе значений LCP, INP, CLS и TTFB.",
    )
    seo_score: float | None = Field(
        default=None,
        description="SEO Score от 0 до 100, учитывающий Core Web Vitals (например, 80% веса – реальные метрики, 20% – оптимизация). None – если недостаточно данных.",
    )
    fcp: CWVMetricSummary | None = Field(
        default=None,
        description="Метрика First Contentful Paint – время от начала загрузки до отображения первого элемента (текст, изображение).",
    )
    lcp: CWVMetricSummary | None = Field(
        default=None,
        description="Метрика Largest Contentful Paint – время отрисовки самого большого видимого элемента (обычно изображение или блок текста).",
    )
    cls: CWVMetricSummary | None = Field(
        default=None,
        description="Метрика Cumulative Layout Shift – суммарный сдвиг макета (безразмерная величина, должна быть <0.1).",
    )
    ttfb: CWVMetricSummary | None = Field(
        default=None,
        description="Метрика Time to First Byte – задержка сервера до получения первого байта ответа.",
    )
    inp: CWVMetricSummary | None = Field(
        default=None,
        description="Метрика Interaction to Next Paint – задержка реакции на взаимодействие пользователя (клик, тап). Заменила FID.",
    )
    critical_seo_issues: list[dict] | None = Field(
        default=None,
        description="Список критических SEO-проблем, вызванных Core Web Vitals. Каждый элемент – словарь с ключами 'issue' (название), 'description' (подробно), 'severity' ('high'/'medium'). Пример: [{'issue': 'Slow LCP', 'severity': 'high', 'description': 'LCP >4s'}].",
    )
    conclusion: str = Field(
        ...,
        description="Краткий вывод (1–2 предложения) о состоянии Core Web Vitals. Пример: 'LCP находится в красной зоне, что может снижать позиции в поиске. Остальные метрики в норме.'",
    )
    recommendations: list[str] = Field(
        ...,
        description="Конкретные действия для улучшения Web Vitals. Например: ['Оптимизировать главное изображение (сжать, перевести в WebP)', 'Убрать нестабильные рекламные блоки для снижения CLS']. Список не пустой.",
    )


class GenerateAIOContent(BaseModel):
    """Результат генерации или оптимизации контента с помощью ИИ."""

    transformed_content: str = Field(
        ...,
        description="Переписанный / оптимизированный текст в формате, аналогичном исходному (сохраняет заголовки, списки, абзацы). Без лишних комментариев – только чистый контент.",
    )
    placement_recommendation: str = Field(
        ...,
        description="Рекомендация, куда разместить этот контент на текущей странице. Пример: 'Вставить после H2 «Преимущества», перед блоком с отзывами.' или 'Использовать как подзаголовок в первом экране.'",
    )


class Problem(BaseModel):
    """Одна проблема, выявленная на сайте (может быть технической, SEO, юзабилити и т.д.)."""

    title: str = Field(
        ...,
        description="Краткое название проблемы, не длиннее 10 слов. Пример: 'Отсутствует H1' или 'Медленная загрузка LCP'.",
    )
    description: str = Field(
        ...,
        description="Развёрнутое описание проблемы: почему она возникает, какие элементы затронуты, влияние на пользователей и поиск.",
    )
    severity: str = Field(
        ...,
        description="Критичность проблемы. Допустимые значения: 'low' (косметическая, почти не влияет), 'medium' (среднее влияние на SEO/пользователей), 'high' (существенное влияние, требуется исправление), 'critical' (блокирует индексацию или делает сайт непригодным).",
    )
    recommendation: str = Field(
        ...,
        description="Пошаговая или конкретная инструкция по исправлению проблемы (кому, что и как сделать). Пример: 'Добавьте тег <title> длиной 50–60 символов, включив ключевое слово в начало.'",
    )


class SEOScore(BaseModel):
    """SEO-оценка сайта в целом (агрегированная по всем страницам или главной)."""

    score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Число от 0 до 100, где 100 – идеальная SEO-оптимизация. Рассчитывается на основе мета-тегов, заголовков, контента, скорости, мобильной адаптации.",
    )
    summary: str = Field(
        ...,
        description="Словесное пояснение оценки в 1–2 предложениях. Например: 'Сайт имеет хорошую структуру, но не хватает мета-описаний и медленная загрузка.'",
    )


class PerformanceScore(BaseModel):
    """Оценка производительности сайта с ключевыми метриками."""

    score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Общая производительность (0–100) – усреднённая по лабораторным или полевым данным. Чем выше, тем быстрее сайт.",
    )
    lcp: float = Field(
        ...,
        description="Largest Contentful Paint в миллисекундах (целое или число с плавающей точкой). Хорошее значение – ≤2500 мс.",
    )
    fid: float = Field(
        ...,
        description="First Input Delay в миллисекундах. Хорошее значение – ≤100 мс. (Для современных отчётов рекомендуется INP, но FID оставлен для совместимости.)",
    )
    cls: float = Field(
        ..., description="Cumulative Layout Shift (без единиц). Хорошее значение – ≤0.1."
    )
    summary: str = Field(
        ...,
        description="Краткое текстовое пояснение (1 предложение). Например: 'Скорость загрузки средняя, но LCP завышен из-за неоптимизированных изображений.'",
    )


class SiteAnalysisReport(BaseModel):
    """Итоговый отчёт по сайту: общие выводы, контент, метрики, список проблем, оценки."""

    overall_summary: str = Field(
        ...,
        description="Общее резюме состояния сайта из 1–3 абзацев. Содержит сильные стороны, главные слабые места и общую рекомендацию. Пример: 'Сайт хорошо структурирован, но имеет критические проблемы с Core Web Vitals. Рекомендуем оптимизировать изображения и уменьшить размер JavaScript.'",
    )
    content_analysis: str = Field(
        ...,
        description="Анализ структуры контента в markdown-подобном или HTML-формате. Показывает иерархию заголовков, наличие ключевых разделов, список проблем с контентом.",
    )
    core_web_vitals_analysis: str = Field(
        ...,
        description="Простыми словами (для неспециалиста) – анализ Core Web Vitals: какие метрики в норме, какие нет, как это влияет на посетителей.",
    )
    issues: list[Problem] = Field(
        default_factory=list,
        description="Список всех выявленных проблем на сайте (технических, SEO, юзабилити, производительности). Сортировка по severity (critical → high → medium → low).",
    )
    recommendations: list[str] = Field(
        default_factory=list,
        description="Общие рекомендации по улучшению сайта (5–10 пунктов). Формулировка: 'Сделать...' или 'Исправить...'. Не дублируют конкретные решения из issues, а дают стратегические советы.",
    )
    seo: SEOScore = Field(..., description="SEO-оценка сайта (число и краткий комментарий).")
    performance: PerformanceScore = Field(
        ..., description="Оценка производительности сайта (число и детали по LCP, FID, CLS)."
    )

    @property
    def to_dict(self) -> dict:
        """Служебное свойство для сериализации отчёта в обычный словарь."""
        return {
            "overall_summary": self.overall_summary,
            "content_analysis": self.content_analysis,
            "core_web_vitals_analysis": self.core_web_vitals_analysis,
            "issues": [i.model_dump() for i in self.issues],
            "recommendations": self.recommendations,
            "seo": self.seo.model_dump(),
            "performance": self.performance.model_dump(),
        }


class SpecializationSite(BaseModel):
    """Определение основной специализации/ниши сайта."""

    specialization: str = Field(
        ...,
        description="Основная специализация сайта в свободной форме, но желательно в виде категории из реального бизнеса. Примеры: 'юридические услуги', 'интернет-магазин сантехники', 'медицинский блог'. Без лишних деталей.",
    )


class ExpertiseSite(BaseModel):
    """Экспертиза компании: в чём главная компетенция, какую проблему решает и какую пользу приносит."""

    main_area: str = Field(
        ...,
        description="Главная область экспертизы компании (не шире 3-5 слов). Пример: 'Семейное право', 'Продажа коммерческой недвижимости', 'Разработка мобильных приложений'.",
    )
    key_user_problem: str = Field(
        ...,
        description="Ключевая проблема, которую решает компания для пользователя. Сформулирована как боль клиента. Пример: 'Не знают, как легально оформить наследство' или 'Тратят часы на ручную проверку отчётов'.",
    )
    benefit_to_the_user: str = Field(
        ...,
        description="Главное преимущество / польза для пользователя – что он получает, обратившись к компании. Пример: 'Бесплатная первичная консультация и гарантия результата', 'Сокращение времени на отчётность в 10 раз'.",
    )


class SemanticCore(BaseModel):
    """Кластеризованное семантическое ядро: высоко-, средне- и низкочастотные запросы."""

    high_frequency: list[str] = Field(
        ...,
        description="Высокочастотные запросы (ВЧ) – обычно широкая тема с большим объёмом поиска (например, 'купить ноутбук', 'ремонт квартир'). Список строк.",
    )
    medium_frequency: list[str] = Field(
        ...,
        description="Среднечастотные запросы (СЧ) – более конкретные (например, 'купить игровой ноутбук acer', 'ремонт однушки под ключ').",
    )
    low_frequency: list[str] = Field(
        ...,
        description="Низкочастотные запросы (НЧ) – длинные хвосты, высокая конкретика (например, 'купить игровой ноутбук acer nitro 5 отзывы 2025', 'ремонт однокомнатной квартиры с дизайн-проектом').",
    )


class Role(StrEnum):
    """Роль автора в диалоге с ИИ."""

    AI = "assistant"  # Ответ ассистента
    USER = "user"  # Сообщение пользователя


class Chat(BaseModel):
    """Одно сообщение в диалоге с ИИ (для истории или генерации)."""

    generation_id: str = Field(
        ...,
        description="Уникальный идентификатор генерации (один и тот же ID может быть у нескольких сообщений одного диалога). Формат: UUID или строка из 16-32 символов.",
    )
    role: Role = Field(
        default=Role.USER,
        description="Роль автора сообщения: 'assistant' для ответа нейросети, 'user' для запроса пользователя.",
    )
    text: str = Field(
        ..., description="Текст сообщения в кодировке UTF-8. Может быть многострочным."
    )


class QueueData(BaseModel):
    """Внутренняя структура для управления очередью обхода URL (краулинг)."""

    urls: list = Field(
        ...,
        description="Список URL-адресов, ожидающих обработки. Каждый элемент – строка. В процессе обхода список динамически изменяется.",
    )
    start_url: str = Field(
        ...,
        description="Начальный (корневой) URL сканирования, с которого начинается обход. Пример: 'https://example.com'.",
    )
    base_url: str = Field(
        ...,
        description="Базовый домен сайта (нормализованный, без www, без конечного слеша). Используется для определения внутренних ссылок.",
    )
    passed_urls: set = Field(
        ...,
        description="Множество URL, которые уже были обработаны (чтобы избежать повторного обхода). Каждый элемент – строка.",
    )
    found: bool = Field(
        ...,
        description="Флаг: True – что-то найдено (например, целевая страница), False – ничего не найдено.",
    )
    result: list[dict] = Field(
        ...,
        description="Результаты обработки – список словарей, каждый словарь содержит данные об одной странице или найденном элементе.",
    )


class GeneratedAlt(BaseModel):
    """Сгенерированный alt-текст для одного изображения."""

    alt: str = Field(
        ...,
        description="Сгенерированный атрибут alt: осмысленное описание изображения на том же языке, что и контент страницы, с включением ключевых слов (если уместно). Длина – от 10 до 125 символов.",
    )
    url: str = Field(
        ..., description="Абсолютный URL изображения, для которого был сгенерирован alt."
    )


class ListGeneratedAlt(BaseModel):
    """Список сгенерированных alt-текстов для множества изображений."""

    result: list[GeneratedAlt] = Field(
        ...,
        description="Список объектов GeneratedAlt, по одному на каждое обработанное изображение.",
    )


class SEOResult(BaseModel):
    """Модель для хранения результата SEO-анализа в базе данных (ORM)."""

    model_config = {"from_attributes": True}

    user_id: UUID = Field(
        ..., description="Идентификатор пользователя (UUID v4), для которого был выполнен анализ."
    )
    result: dict = Field(
        ...,
        description="Полный результат SEO-анализа в виде словаря (соответствует структуре SEOAnalysisReport или SiteAnalysisReport). Ключи – названия полей модели.",
    )
    created_at: datetime = Field(
        default_factory=datetime.now,
        description="Дата и время создания записи в UTC (формат ISO 8601). Автоматически проставляется при вставке.",
    )
