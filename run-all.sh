#!/bin/sh

echo "npm install in ui folder"
sh run.sh npm run preinstall
echo "npm install in root folder"
sh run.sh npm install
echo "npm run build in root folder"
sh run.sh npm run build
