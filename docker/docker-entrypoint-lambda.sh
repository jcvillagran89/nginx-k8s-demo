#!/usr/bin/env sh
set -e

mkdir -p \
  /tmp/cache \
  /tmp/storage/app \
  /tmp/storage/framework/cache \
  /tmp/storage/framework/sessions \
  /tmp/storage/framework/views \
  /tmp/storage/logs

exec php -S "0.0.0.0:${PORT:-8080}" -t public
