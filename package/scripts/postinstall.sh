#!/bin/bash

if [ -f /etc/bahmni-installer/bahmni.conf ]; then
. /etc/bahmni-installer/bahmni.conf
fi

#create bahmni user and group if doesn't exist
USERID=bahmni
GROUPID=bahmni
/bin/id -g $GROUPID 2>/dev/null
[ $? -eq 1 ]
groupadd bahmni

/bin/id $USERID 2>/dev/null
[ $? -eq 1 ]
useradd -g bahmni bahmni


setupApps(){
    ln -s /opt/bahmni-appointments-frontend/etc/appointments/ /var/www/appointments
}

setupConfFiles() {
    cp -f /opt/bahmni-appointments-frontend/etc/appointments_ssl.conf /etc/httpd/conf.d/appointments_ssl.conf
}

manage_permissions(){
    # permissions
    chown -R bahmni:bahmni /opt/bahmni-appointments-frontend
    chown -R bahmni:bahmni /var/www/appointments
    chown -R bahmni:bahmni /etc/httpd/conf.d/appointments_ssl.conf
}

setupApps
setupConfFiles
manage_permissions

service httpd reload || true
