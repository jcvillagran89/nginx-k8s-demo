FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    curl \
    unzip \
    libaio1t64 \
    && rm -rf /var/lib/apt/lists/*

# Copia archivos (ajusta si tienes app real)
COPY . /var/www/html

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
