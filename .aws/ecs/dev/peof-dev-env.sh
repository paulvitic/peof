#!/usr/bin/env bash

DIR=$(pwd)
TEMPLATE=peof-dev-env.yml
TEMPLATE_PATH=$DIR/peof-dev-env.yml
S3_URL=s3://peof-bucket/aws/ecs/
BUCKET_URL=${S3_URL}${TEMPLATE}
TEMPLATE_URL=https://peof-bucket.s3.eu-central-1.amazonaws.com/aws/ecs/${TEMPLATE}
STACK_NAME=peof-dev-env

deploy(){
	aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation deploy \
      --stack-name $STACK_NAME \
      --template $TEMPLATE_PATH \
      --capabilities CAPABILITY_IAM
}

delete(){
	aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation delete-stack \
      --stack-name $STACK_NAME
}

update(){
    # upload updated template to s3
    aws --profile pvitic-administrator \
        --debug s3 cp \
        $TEMPLATE_PATH \
        $BUCKET_URL

    # update cloudformation stack with newly uploaded template
    aws --profile pvitic-administrator \
	    --region eu-central-1 \
	    --debug cloudformation update-stack \
      --stack-name $STACK_NAME \
      --template-url $TEMPLATE_URL \
      --capabilities CAPABILITY_NAMED_IAM
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