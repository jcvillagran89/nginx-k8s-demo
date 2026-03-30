# syntax=docker/dockerfile:1.7
## PHP 8.2 FPM + Nginx + Supervisord

# Stage 1: build frontend
FROM node:18 AS node_builder
WORKDIR /app

ARG VITE_REVERB_APP_KEY=docker-app-key
ARG VITE_REVERB_HOST=laboratoriotextilqa.agarcia.com.mx
ARG VITE_REVERB_PORT=443
ARG VITE_REVERB_SCHEME=https
ARG VITE_REVERB_CLUSTER=mt1

ENV VITE_REVERB_APP_KEY=${VITE_REVERB_APP_KEY}
ENV VITE_REVERB_HOST=${VITE_REVERB_HOST}
ENV VITE_REVERB_PORT=${VITE_REVERB_PORT}
ENV VITE_REVERB_SCHEME=${VITE_REVERB_SCHEME}
ENV VITE_REVERB_CLUSTER=${VITE_REVERB_CLUSTER}

COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN rm -rf public/build
RUN npm run build

# Stage 2: composer dependencies
FROM php:8.2-cli AS composer_builder
WORKDIR /app
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
    git \
    unzip \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev; \
    docker-php-ext-configure gd --with-jpeg --with-freetype; \
    docker-php-ext-install gd zip; \
    rm -rf /var/lib/apt/lists/*
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --ignore-platform-req=ext-oci8 --no-scripts

# Stage 3: final image
FROM php:8.2-fpm

ENV COMPOSER_ALLOW_SUPERUSER=1

ARG TARGETARCH
ARG APP_BUILD_REF=unknown
ARG LARAVEL_ENV_SHA=unknown

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
    autoconf \
    build-essential \
    git \
    curl \
    unzip \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    nginx \
    supervisor \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    pkg-config \
    redis-server \
    zip; \
    if ! apt-get install -y --no-install-recommends libaio1; then \
    apt-get install -y --no-install-recommends libaio1t64; \
    fi; \
    docker-php-ext-configure gd --with-jpeg --with-freetype; \
    docker-php-ext-install pdo pdo_mysql zip exif pcntl bcmath intl gd; \
    for libdir in /usr/lib/x86_64-linux-gnu /usr/lib/aarch64-linux-gnu; do \
    if [ -f "$libdir/libaio.so.1t64" ] && [ ! -e "$libdir/libaio.so.1" ]; then \
    ln -s libaio.so.1t64 "$libdir/libaio.so.1"; \
    fi; \
    done; \
    printf "\n" | pecl install redis; \
    docker-php-ext-enable redis; \
    rm -f /etc/nginx/conf.d/default.conf /etc/nginx/sites-enabled/default; \
    rm -rf /var/lib/apt/lists/*

COPY docker/instantclient/ /tmp/instantclient/

RUN set -eux; \
    if ls /tmp/instantclient/*.zip >/dev/null 2>&1; then \
    case "${TARGETARCH:-}" in \
    amd64) ic_package_arch="x64" ;; \
    arm64) ic_package_arch="arm64" ;; \
    *) echo "Unsupported TARGETARCH '${TARGETARCH:-unknown}' for Oracle Instant Client." >&2; exit 1 ;; \
    esac; \
    ic_pattern="*linux.${ic_package_arch}*.zip"; \
    if ! ls /tmp/instantclient/${ic_pattern} >/dev/null 2>&1; then \
    echo "Missing Oracle Instant Client archives matching ${ic_pattern} for TARGETARCH=${TARGETARCH:-unknown}." >&2; \
    exit 1; \
    fi; \
    apt-get update && apt-get install -y --no-install-recommends libaio-dev libnsl-dev build-essential pkg-config unzip; \
    for f in /tmp/instantclient/${ic_pattern}; do unzip -qn "$f" -d /opt; done; \
    INSTDIR=$(ls -d /opt/instantclient_* | head -n1); \
    echo "$INSTDIR" > /etc/ld.so.conf.d/oracle-instantclient.conf; ldconfig; \
    printf "instantclient,%s\n" "$INSTDIR" | pecl install oci8-3.0.1; \
    docker-php-ext-enable oci8; \
    else \
    echo 'No Oracle Instant Client zip files found in docker/instantclient/' >&2; \
    exit 1; \
    fi; \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer_builder /app/vendor /var/www/html/vendor

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application files
WORKDIR /var/www/html
COPY . /var/www/html
RUN --mount=type=secret,id=laravel_env,target=/tmp/laravel.env \
    test -s /tmp/laravel.env || (echo "laravel_env build secret is empty or missing" >&2; exit 1); \
    tr -d '\r' < /tmp/laravel.env > /var/www/html/.env; \
    grep -qE '^APP_KEY=.+' /var/www/html/.env || (echo "APP_KEY missing in laravel_env build secret" >&2; exit 1); \
    grep -qE '^DB_CONNECTION=.+' /var/www/html/.env || (echo "DB_CONNECTION missing in laravel_env build secret" >&2; exit 1); \
    chown www-data:www-data /var/www/html/.env; \
    chmod 600 /var/www/html/.env
RUN rm -f bootstrap/cache/*.php

# Copy built frontend assets
COPY --from=node_builder /app/public /var/www/html/public

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/php/uploads.ini /usr/local/etc/php/conf.d/uploads.ini
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions and required storage directories
RUN set -eux; \
    mkdir -p storage/app storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache; \
    printf 'APP_BUILD_REF=%s\nLARAVEL_ENV_SHA=%s\n' "$APP_BUILD_REF" "$LARAVEL_ENV_SHA" > /var/www/html/.image-build-meta; \
    chown www-data:www-data /var/www/html/.image-build-meta; \
    chmod 600 /var/www/html/.image-build-meta; \
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/vendor || true;

EXPOSE 80 443 6001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -f http://localhost/ || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
