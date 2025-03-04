#!/bin/sh

set -e  # Exit if any command fails

poetry shell
poetry install
poetry run python manage.py migrate
