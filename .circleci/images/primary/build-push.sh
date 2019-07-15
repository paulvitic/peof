#!/usr/bin/env bash

image="paulvitic/peof-circleci"
tag="$(date +'%Y%m%d%H%M%S')"

echo "building image ${image}:${tag}"
docker build -t ${image}:${tag} -t ${image}:latest .

echo "pushing image ${image}:${tag}"
docker push ${image}:${tag}
docker push ${image}:latest