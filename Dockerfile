FROM php:8.2-fpm

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
    && rm -rf /var/lib/apt/lists/*

# 🔥 ORACLE INSTANT CLIENT (BASIC + SDK)
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

RUN ln -s /usr/lib/x86_64-linux-gnu/libaio.so.1t64 /usr/lib/x86_64-linux-gnu/libaio.so.1

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV PATH=$PATH:/opt/oracle/instantclient

# 🔥 OCI8 (forma estable)
RUN printf "instantclient,/opt/oracle/instantclient\n" | pecl install oci8 \
    && docker-php-ext-enable oci8

# 🔥 EXTENSIONES PARA LARAVEL
RUN docker-php-ext-install pdo pdo_mysql zip

# 🔥 COMPOSER
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia app (igual que ya lo tenías)
COPY . /var/www/html

# 🔥 Limpiar configs default de nginx
RUN rm -rf /etc/nginx/sites-enabled/* \
    /etc/nginx/sites-available/* \
    /etc/nginx/conf.d/*

# 🔥 Agregar tu config correcta
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 🔥 NO se toca (porque ya funciona)
CMD service nginx start && php-fpm


