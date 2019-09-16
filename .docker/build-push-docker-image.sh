#!/usr/bin/env bash
AWS_REPOSITORY_URL=332197038802.dkr.ecr.eu-central-1.amazonaws.com

IMAGE="${AWS_REPOSITORY_URL}/peof-mongodb-dev"
DOCKER_FILE_LOCATION=mongoDb/Dockerfile
cd mongoDb

echo "logging into AWS Container repository"
$(aws ecr get-login --region eu-central-1 --no-include-email)

echo "building image ${IMAGE}"
docker build -t ${IMAGE} .

echo "pushing image ${IMAGE}"
docker push ${IMAGE}