FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    curl \
    unzip \
    libaio1t64 \
    build-essential \
    autoconf \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# 🔥 ORACLE INSTANT CLIENT
WORKDIR /opt/oracle

RUN curl -L -o instantclient.zip \
    https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
    -H "Cookie: oraclelicense=accept-securebackup-cookie" && \
    unzip instantclient.zip && \
    rm instantclient.zip && \
    ln -s /opt/oracle/instantclient_* /opt/oracle/instantclient

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV PATH=$PATH:/opt/oracle/instantclient

# 🔥 INSTALAR OCI8
RUN echo "instantclient,/opt/oracle/instantclient" | pecl install oci8 \
    && docker-php-ext-enable oci8

# App
COPY . /var/www/html

# Limpiar configs nginx
RUN rm -rf /etc/nginx/sites-enabled/* \
    /etc/nginx/sites-available/* \
    /etc/nginx/conf.d/*

# Config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Config supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord"]
CMD ["/usr/bin/supervisord"]
