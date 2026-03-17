FROM php:8.2-fpm

# Instalar paquetes
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    curl \
    unzip \
    libaio1 \
    && rm -rf /var/lib/apt/lists/*

# Simulación Oracle client (sin conexión real)
RUN mkdir -p /opt/oracle
ENV LD_LIBRARY_PATH=/opt/oracle

# Configurar Nginx
COPY nginx.conf /etc/nginx/sites-available/default

# Configurar Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Código de prueba
COPY index.php /var/www/html/index.php

# Permisos
RUN chmod -R 755 /var/www/html

# Logs a stdout (IMPORTANTE para K8s)
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log

# Puerto
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://localhost || exit 1

# Start
CMD ["/usr/bin/supervisord"]
