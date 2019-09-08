#!/usr/bin/env bash

DIR=$(pwd)
CLOUDFORMATION_TEMPLATE=$DIR/peof-circleci-user.yml
STACK_NAME=peof-circleci-user
TEMPLATE_URL=https://peof-bucket.s3.eu-central-1.amazonaws.com/aws/user/peof-circleci-user.yml
PEOF_CONTAINER_REPO_ARN=arn:aws:ecr:eu-central-1:332197038802:repository/peof-*

deploy(){
	aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation deploy \
        --stack-name $STACK_NAME \
        --template $CLOUDFORMATION_TEMPLATE \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides PEOFContainerRepositoriesRootArn=$PEOF_CONTAINER_REPO_ARN
}

delete(){
	aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation delete-stack \
        --stack-name $STACK_NAME
}

update(){
    aws --profile pvitic-administrator \
        --debug s3 cp \
        peof-circleci-user.yml \
        s3://peof-bucket/aws/user/peof-circleci-user.yml

    aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation update-stack \
        --stack-name $STACK_NAME \
        --template-url $TEMPLATE_URL \
        --capabilities CAPABILITY_NAMED_IAM \
        --parameters ParameterKey=PEOFContainerRepositoriesRootArn,UsePreviousValue=true
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
update)
  echo "Updating ${STACK_NAME} stack"
  update
  ;;
*)
    echo "Did you forget something!! [ deploy | delete | update ]"
    echo "-- Options --"
    echo "deploy : Deploys stack"
    echo "delete : Deletes stack"
    echo "update : Updates stack"
esac