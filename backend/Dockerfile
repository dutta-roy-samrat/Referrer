FROM python:3.13-slim AS base

# Set up Poetry
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

RUN poetry config virtualenvs.in-project true \
    && poetry install --only main --no-interaction

FROM base AS production

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /app/.venv/ /app/.venv/

# Copy application files
COPY . .

# Ensure script has correct format and permissions
RUN dos2unix /app/scripts/server.sh \
    && chmod +x /app/scripts/server.sh

# Create log directory
RUN mkdir -p /app/logs

# Set the path to include the virtual environment
ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app/root

# Expose port 8000
EXPOSE 8000

# Capture logs and store them
ENTRYPOINT ["/bin/sh", "-c", "exec /app/scripts/server.sh 2>&1 | tee /app/logs/server.log"]
