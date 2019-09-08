#!/usr/bin/env bash

DIR=$(pwd)
CLOUDFORMATION_TEMPLATE=$DIR/peof-circleci-user.yml
STACK_NAME=peof-circleci-user

deploy(){
	aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation deploy \
        --stack-name $STACK_NAME \
        --template $CLOUDFORMATION_TEMPLATE \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides PEOFContainerRepositoriesRootArn=arn:aws:ecr:eu-central-1:332197038802:repository/peof-*
}

delete(){
	aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation delete-stack \
        --stack-name $STACK_NAME
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