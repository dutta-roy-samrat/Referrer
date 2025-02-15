FROM python:3.13-slim AS base

ENV POETRY_HOME=/opt/poetry
ENV PATH=${POETRY_HOME}/bin:${PATH}

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
    curl \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

FROM base AS builder

WORKDIR /app
COPY poetry.lock pyproject.toml ./

RUN poetry config virtualenvs.in-project true \
    && poetry install --only main --no-interaction

FROM base AS production

WORKDIR /app

COPY --from=builder /app/.venv/ /app/.venv/

COPY . .

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

RUN chmod +x /app/scripts/server.sh
RUN useradd -m nonRootUser
USER nonRootUser

WORKDIR /app/root

ENTRYPOINT [ "/app/scripts/server.sh" ]