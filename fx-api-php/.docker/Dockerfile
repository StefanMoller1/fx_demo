FROM php:7.4.26-apache

COPY . /app

COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf

# Install Composer [https://getcomposer.org/]
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && apt-get update \
    && apt-get install zip unzip

RUN apt-get install -y sqlite3 libsqlite3-dev

WORKDIR /app

RUN php /usr/local/bin/composer update \
    && php /usr/local/bin/composer dump-autoload

RUN chown -R www-data:www-data /app && a2enmod rewrite