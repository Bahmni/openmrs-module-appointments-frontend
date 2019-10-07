#!/bin/bash

export LANG=en_US.UTF-8
set -e

BASE_DIR=`dirname $0`
ROOT_DIR=$BASE_DIR/..

mkdir -p $ROOT_DIR/target

npm install
bower install
grunt bundle
grunt uglify-and-rename

cd $ROOT_DIR

if [ $(pgrep Xvfb) ]; then
    XVFB_PID=$(pgrep Xvfb)
    echo "Killing Xvfb process $XVFB_PID"
    /usr/bin/sudo kill $XVFB_PID
    /usr/bin/sudo rm -rf /tmp/.X99-lock
fi
export DISPLAY=:99
Xvfb :99 &
XVFB_PID=$!
echo "Starting Xvfb process $XVFB_PID"

grunt web


echo "Killing Xvfb process $XVFB_PID"
/usr/bin/sudo kill $XVFB_PID
