#!/usr/bin/env bash

target_dir=/opt/bahmni-web/etc/bahmniapps/appointments
if [ -d "$target_dir" ]; then
    rm -rf "$target_dir"
fi
