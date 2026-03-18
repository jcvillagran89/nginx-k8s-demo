FROM php:8.2-fpm-bookworm

# Instalar dependencias
RUN apt-get update && apt-get install -y \
    libaio-dev \
    unzip \
    nginx \
    supervisor \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

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

# PHP configs (para Laravel / apps reales)
RUN docker-php-ext-install pdo pdo_mysql

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# App
COPY . /var/www/html
# 🔥 Limpiar configs default de nginx
RUN rm -rf /etc/nginx/sites-enabled/*
RUN rm -rf /etc/nginx/sites-available/*
RUN rm -rf /etc/nginx/conf.d/*

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["/usr/bin/supervisord"]
