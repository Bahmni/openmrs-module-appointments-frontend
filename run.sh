#!/bin/sh
chmod -R a+rwx $HOME/.npm
docker run --rm -ti -v $PWD:/app -v $HOME/.npm:/root/.npm -w /app  nikolaik/python-nodejs:python3.9-nodejs14 $@
