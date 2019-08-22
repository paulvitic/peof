#!/usr/bin/env bash


#aws --debug cloudformation deploy  \
#    --template ./cluster/cluster-ec2-private-vpc.yml \
#    --stack-name peof-cluster \
#    --capabilities CAPABILITY_IAM \
#    --parameter-overrides EnvironmentName=peof-prod

aws --debug cloudformation delete-stack \
    --stack-name peof-network