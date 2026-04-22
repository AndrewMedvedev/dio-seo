# syntax = docker/dockerfile:1.9-labs

# ────────────────────────────────────────────────
# Стадия 1 — сборка зависимостей (builder)
# ────────────────────────────────────────────────
FROM python:3.13-slim AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

# Устанавливаем компилятор C, linker и базовые инструменты сборки
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Копируем только lock-файлы / requirements
COPY pyproject.toml uv.lock requirements.txt* ./

# Устанавливаем uv и синхронизируем зависимости
RUN --mount=type=cache,target=/root/.cache/uv \
    pip install --no-cache-dir uv && \
    uv sync --frozen --no-install-project --no-dev

ENV PATH="/app/.venv/bin:$PATH"

# ────────────────────────────────────────────────
# Стадия 2 — финальный образ (runtime)
# ────────────────────────────────────────────────
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    FASTEMBED_CACHE_DIR=/app/cache/fastembed \
    FASTEMBED_CACHE_PATH=/app/cache/fastembed


WORKDIR /app

# Создаём директорию для кэша моделей и даём права на запись
RUN mkdir -p /app/cache/fastembed && \
    chmod -R 777 /app/cache

# Копируем виртуальное окружение из builder
COPY --from=builder /app/.venv /app/.venv

ENV PATH="/app/.venv/bin:$PATH"

# Копируем код приложения
COPY . .

# Опционально: предзагрузить модель во время сборки (раскомментируйте, если нужно)
# RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

CMD ["python", "main.py"]