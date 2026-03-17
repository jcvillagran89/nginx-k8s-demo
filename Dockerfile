FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    curl \
    unzip \
    libaio1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

RUN echo "<?php phpinfo(); ?>" > /var/www/html/index.php

COPY nginx.conf /etc/nginx/sites-enabled/default
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://localhost || exit 1

CMD ["/usr/bin/supervisord"]
