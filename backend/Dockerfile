FROM python:3.13-slim AS base

ENV POETRY_HOME=/opt/poetry
ENV PATH=${POETRY_HOME}/bin:${PATH}

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
    curl dos2unix \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

FROM base AS builder

WORKDIR /app
COPY poetry.lock pyproject.toml ./
COPY .env ./

RUN poetry config virtualenvs.in-project true \
    && poetry install --only main --no-interaction

FROM base AS production

WORKDIR /app

COPY --from=builder /app/.venv/ /app/.venv/
COPY --from=builder /app/.env ./

COPY . .

RUN dos2unix /app/scripts/server.sh \
    && chmod +x /app/scripts/server.sh

RUN mkdir -p /app/logs

ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app/root

EXPOSE 8000

ENTRYPOINT ["/bin/sh", "-c", "exec /app/scripts/server.sh 2>&1 | tee /app/logs/server.log"]
