# syntax = docker/dockerfile:1.9-labs
FROM python:3.13-slim AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

# Устанавливаем компиляторы и библиотеки для onnxruntime
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    libgomp1 \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml uv.lock requirements.txt* ./

RUN --mount=type=cache,target=/root/.cache/uv \
    pip install --no-cache-dir uv && \
    uv sync --frozen --no-install-project --no-dev

ENV PATH="/app/.venv/bin:$PATH"

# ------------------- финальный образ -------------------
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    FASTEMBED_CACHE_DIR=/app/cache/fastembed \
    FASTEMBED_CACHE_PATH=/app/cache/fastembed \
    HF_HOME=/app/cache/hf \
    TRANSFORMERS_CACHE=/app/cache/hf \
    HUGGINGFACE_HUB_CACHE=/app/cache/hf


WORKDIR /app

# Устанавливаем только runtime-библиотеки
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Создаём всю структуру кэша (без томов)
RUN mkdir -p /app/cache/fastembed /app/cache/hf && chmod -R 777 /app/cache

COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY . .


CMD ["python", "main.py"]