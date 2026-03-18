FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    curl \
    unzip \
    libaio1t64 \
    && rm -rf /var/lib/apt/lists/*



RUN curl -L -o instantclient.zip \
    https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
    -H "Cookie: oraclelicense=accept-securebackup-cookie" && \
    unzip instantclient.zip && \
    rm instantclient.zip && \
    ln -s /opt/oracle/instantclient_* /opt/oracle/instantclient

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV PATH=$PATH:/opt/oracle/instantclient
# Copia app
COPY . /var/www/html

# 🔥 Limpiar configs default de nginx
RUN rm -rf /etc/nginx/sites-enabled/*
RUN rm -rf /etc/nginx/sites-available/*
RUN rm -rf /etc/nginx/conf.d/*

# 🔥 Agregar tu config correcta
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 🔥 Levantar servicios
CMD service nginx start && php-fpm


