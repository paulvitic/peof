#!/usr/bin/env bash

AWS_REPOSITORY_URL=332197038802.dkr.ecr.eu-central-1.amazonaws.com

# Read optional the stack 's' param
while getopts s: option
do
 case "${option}"
 in
 s) STACK=${OPTARG};;
 esac
done

# Test if STACK variable is null
if [ -z "$STACK" ]
then
      IMAGE="${AWS_REPOSITORY_URL}/peof-circleci"
      DOCKER_FILE_LOCATION="./Dockerfile"
else
      IMAGE="${AWS_REPOSITORY_URL}/peof-circleci-${STACK}"
      DOCKER_FILE_LOCATION="./${STACK}/Dockerfile"
fi

TAG="$(date +'%Y%m%d%H%M%S')"

echo "logging into AWS Container repository"
$(aws ecr get-login --region eu-central-1 --no-include-email)

echo "building image ${IMAGE}:${TAG}"
#docker build --no-cache -t ${IMAGE}:${TAG} -t ${IMAGE}:latest -f ${DOCKER_FILE_LOCATION} .
docker build -t ${IMAGE}:${TAG} -t ${IMAGE}:latest -f ${DOCKER_FILE_LOCATION} .

echo "pushing image ${IMAGE}:${TAG}"
docker push ${IMAGE}:${TAG}

echo "pushing image ${IMAGE}:latest"
docker push ${IMAGE}:latest