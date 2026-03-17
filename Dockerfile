FROM php:8.2-fpm

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    libaio-dev \
    unzip \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Crear carpeta de Oracle
WORKDIR /opt/oracle

# Descargar Oracle Instant Client (Basic Lite)
RUN curl -o instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip && \
    unzip instantclient.zip && \
    rm instantclient.zip

# Crear symlink estándar
RUN ln -s /opt/oracle/instantclient_* /opt/oracle/instantclient

# Variables de entorno necesarias
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV PATH=$PATH:/opt/oracle/instantclient

# Configurar Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar app
COPY . /var/www/html

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html

# Copiar supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Exponer puerto
EXPOSE 80

# Ejecutar nginx + php-fpm
CMD ["/usr/bin/supervisord"]
