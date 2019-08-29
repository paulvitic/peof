#!/usr/bin/env bash
docker build --no-cache -t peof/organization/latest .
docker run -i --rm -p 3001:3001 --name organization peof/organization/latest

