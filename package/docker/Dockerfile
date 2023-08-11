FROM httpd:2.4-alpine
RUN apk update && apk add --no-cache tzdata
COPY dist/. /usr/local/apache2/htdocs/appointments/