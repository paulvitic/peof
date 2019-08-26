#!/usr/bin/env bash


#aws --debug cloudformation deploy  \
#    --template ./cluster/cluster-ec2-public-vpc.yml \
#    --stack-name peof-public-cluster \
#    --capabilities CAPABILITY_IAM \
#    --parameter-overrides EnvironmentName=peof-public-prod

#aws --debug cloudformation deploy  \
#    --template ./ingress/alb-external.yml \
#    --stack-name peof-ext-ingress \
#    --capabilities CAPABILITY_IAM \
#    --parameter-overrides EnvironmentName=peof-public-prod

aws --debug cloudformation deploy  \
    --template ./service/portainer-ec2-public-lb.yml \
    --stack-name peof-portainer \
    --parameter-overrides EnvironmentName=peof-public-prod

#aws --debug cloudformation delete-stack \
#    --stack-name peof-portainer

#aws --debug cloudformation delete-stack \
#    --stack-name peof-network