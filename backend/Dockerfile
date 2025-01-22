# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.13.0
FROM python:${PYTHON_VERSION}-slim AS base

ENV PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app
RUN pip install --no-cache-dir poetry

FROM base AS deps

COPY ./poetry.lock ./pyproject.toml ./

RUN poetry install --no-root

FROM deps AS final

COPY . .

RUN adduser --disabled-password --gecos "" appuser
USER appuser

WORKDIR /app/root

EXPOSE 8000

CMD ["python","manage.py","runserver"]
