#!/bin/sh

set -e  # Exit if any command fails

poetry shell
poetry install
poetry run python manage.py migrate
if [ "$ENVIRONMENT" = "production" ]; then
    echo "Running in production mode"
    exec daphne root.asgi:application -p 8000 -b 0.0.0.0

elif [ "$ENVIRONMENT" = "development" ]; then
    echo "Running in development mode"
    exec poetry run python manage.py runserver 0.0.0.0:8000  

else
    echo "ERROR: ENVIRONMENT variable not set. Exiting."
    exit 1
fi
