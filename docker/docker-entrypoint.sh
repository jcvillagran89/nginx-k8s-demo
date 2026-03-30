#!/usr/bin/env bash
set -euo pipefail

echo "[entrypoint] setting permissions"
mkdir -p /var/www/html/storage/app \
         /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/vendor || true

if [ -f /var/www/html/.env ]; then
  echo "[entrypoint] .env found in image"
else
  echo "[entrypoint] .env missing from image"
fi

if [ -f /var/www/html/.image-build-meta ]; then
  echo "[entrypoint] build metadata:"
  sed 's/^/[entrypoint] /' /var/www/html/.image-build-meta
fi

if [ -f /var/www/html/.env ]; then
  actual_env_sha="$(sha256sum /var/www/html/.env | awk '{print $1}')"
  echo "[entrypoint] runtime .env sha=${actual_env_sha}"
fi

if [ -n "${APP_KEY:-}" ]; then
  echo "[entrypoint] APP_KEY exported in process env"
elif [ -f /var/www/html/.env ] && grep -qE '^APP_KEY=.+' /var/www/html/.env; then
  echo "[entrypoint] APP_KEY found in .env"
else
  echo "[entrypoint] APP_KEY missing from process env and .env"
fi

if [ -f /var/www/html/.env ] && grep -qE '^DB_CONNECTION=.+' /var/www/html/.env; then
  echo "[entrypoint] DB_CONNECTION found in .env"
else
  echo "[entrypoint] DB_CONNECTION missing in .env"
fi

if [ "${MIGRATE:-false}" = "true" ]; then
  echo "[entrypoint] running migrations"
  php artisan migrate --force || true
fi

exec "$@"
