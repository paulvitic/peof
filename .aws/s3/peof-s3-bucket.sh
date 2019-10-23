#!/usr/bin/env bash

DIR=$(pwd)
CLOUDFORMATION_TEMPLATE=$DIR/peof-s3-bucket.yml
STACK_NAME=peof-s3-bucket

deploy(){
	aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation deploy \
        --stack-name $STACK_NAME \
        --template $CLOUDFORMATION_TEMPLATE
}

delete(){
	aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation delete-stack \
        --stack-name $STACK_NAME
}

upload(){
    aws --profile pvitic-administrator \
    s3 cp ecr s3://peof-bucket/aws/ecr \
    --recursive
}

OPTION=$1

case $OPTION in
deploy)
  echo "Deploying ${STACK_NAME} stack"
  deploy
  ;;
delete)
  echo "Deleting ${STACK_NAME} stack"
  delete
  ;;
*)
    echo "Did you forget something!! [ deploy | delete ]"
    echo "-- Options --"
    echo "deploy : Deploys stack"
    echo "delete : Deletes stack"
esac