#!/usr/bin/env bash

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
      IMAGE="paulvitic/peof-circleci"
      DOCKER_FILE_LOCATION="./Dockerfile"
else
      IMAGE="paulvitic/peof-circleci-${STACK}"
      DOCKER_FILE_LOCATION="./${STACK}/Dockerfile"
fi

TAG="$(date +'%Y%m%d%H%M%S')"

echo "building image ${IMAGE}:${TAG}"
#docker build --no-cache -t ${IMAGE}:${TAG} -t ${IMAGE}:latest -f ${DOCKER_FILE_LOCATION} .
docker build -t ${IMAGE}:${TAG} -t ${IMAGE}:latest -f ${DOCKER_FILE_LOCATION} .

echo "pushing image ${IMAGE}:${TAG}"
docker push ${IMAGE}:${TAG}
docker push ${IMAGE}:latest