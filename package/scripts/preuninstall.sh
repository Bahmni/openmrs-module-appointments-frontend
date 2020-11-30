#!/bin/bash
if [ $1 -eq 0 ]; then
    rm -rf /var/www/appointments
    rm -rf /etc/httpd/conf.d/appointments_ssl.conf
fi
