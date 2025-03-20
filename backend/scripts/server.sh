#!/bin/sh

set -e  

echo "Starting server..."

echo "Applying database migrations..."
poetry run python manage.py migrate 2>&1

if [ "$ENVIRONMENT" = "production" ]; then
    echo "Running in production mode"
    poetry run python manage.py collectstatic --noinput 2>&1
    exec daphne root.asgi:application -p 8000 -b 0.0.0.0 

elif [ "$ENVIRONMENT" = "development" ]; then
    echo "Running in development mode"
    exec poetry run python manage.py runserver 0.0.0.0:8000 

else
    echo "ERROR: ENVIRONMENT variable not set. Exiting."
    exit 1
fi
