#!/usr/bin/env bash
docker build --no-cache -t product-engineering/organization/latest .
docker run -i --rm -p 3001:3001 --name organization product-engineering/organization/latest

