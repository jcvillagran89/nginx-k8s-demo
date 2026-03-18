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

# 🔥 Extensiones PHP para Laravel
RUN docker-php-ext-install pdo pdo_mysql zip

# 🔥 Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 🔥 ORACLE INSTANT CLIENT
# Oracle Instant Client
WORKDIR /opt/oracle

RUN curl -L -o instantclient.zip \
    https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
    -H "Cookie: oraclelicense=accept-securebackup-cookie" && \
    unzip instantclient.zip && \
    rm instantclient.zip && \
    ln -s /opt/oracle/instantclient_* /opt/oracle/instantclient

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV PATH=$PATH:/opt/oracle/instantclient

# 🔥 OCI8
RUN pecl channel-update pecl.php.net && \
    echo "instantclient,/opt/oracle/instantclient" | pecl install oci8-3.2.1 && \
    docker-php-ext-enable oci8

# 🔥 App
COPY . /var/www/html

# 🔥 Permisos (Laravel los necesita)
RUN chown -R www-data:www-data /var/www/html

# 🔥 Limpiar nginx default
RUN rm -rf /etc/nginx/sites-enabled/* \
    /etc/nginx/sites-available/* \
    /etc/nginx/conf.d/*

# 🔥 Config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 🔥 Mantener tu arranque funcional
CMD service nginx start && php-fpm
CMD ["/usr/bin/supervisord"]
