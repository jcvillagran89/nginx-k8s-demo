FROM php:8.2-fpm

# Paquetes base + dependencias Laravel + OCI8
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    curl \
    unzip \
    git \
    libaio1t64 \
    libaio-dev \
    build-essential \
    autoconf \
    pkg-config \
    libzip-dev \
    zip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    && rm -rf /var/lib/apt/lists/*

# Extensiones PHP necesarias para Laravel
RUN docker-php-ext-configure gd --with-jpeg --with-freetype && \
    docker-php-ext-install \
    pdo \
    pdo_mysql \
    zip \
    exif \
    pcntl \
    bcmath \
    intl \
    gd

# ORACLE INSTANT CLIENT (BASIC + SDK)
WORKDIR /opt/oracle

RUN curl -L -o basic.zip \
    https://download.oracle.com/otn_software/linux/instantclient/219000/instantclient-basic-linux.x64-21.9.0.0.0dbru.zip \
    -H "Cookie: oraclelicense=accept-securebackup-cookie" && \
    curl -L -o sdk.zip \
    https://download.oracle.com/otn_software/linux/instantclient/219000/instantclient-sdk-linux.x64-21.9.0.0.0dbru.zip \
    -H "Cookie: oraclelicense=accept-securebackup-cookie" && \
    unzip basic.zip && \
    unzip sdk.zip && \
    rm basic.zip sdk.zip && \
    ln -s /opt/oracle/instantclient_21_9 /opt/oracle/instantclient

# Fix libaio (crítico para OCI8)
RUN ln -sf /usr/lib/x86_64-linux-gnu/libaio.so.1t64 /usr/lib/x86_64-linux-gnu/libaio.so.1

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV PATH=$PATH:/opt/oracle/instantclient

# OCI8
RUN printf "instantclient,/opt/oracle/instantclient\n" | pecl install oci8 \
    && docker-php-ext-enable oci8

#  Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

#  App
WORKDIR /var/www/html
COPY . /var/www/html

#  Laravel: directorios necesarios
RUN mkdir -p \
    storage/app \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data /var/www/html

# Limpiar configs default de nginx
RUN rm -rf /etc/nginx/sites-enabled/* \
    /etc/nginx/sites-available/* \
    /etc/nginx/conf.d/*

#  Config nginx
#COPY nginx.conf /etc/nginx/conf.d/default.conf

#  Healthcheck básico
HEALTHCHECK CMD curl -f http://localhost/ || exit 1


CMD service nginx start && php-fpm

