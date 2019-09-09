#!/usr/bin/env bash
$(aws ecr get-login --region eu-central-1 --no-include-email)
docker build -t 332197038802.dkr.ecr.eu-central-1.amazonaws.com/peof-framework-ui-dev .
docker push 332197038802.dkr.ecr.eu-central-1.amazonaws.com/peof-framework-ui-dev