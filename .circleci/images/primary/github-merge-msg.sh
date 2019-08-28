#!/usr/bin/env bash

GITHUB_PR_USERNAME=$(git log -1 --pretty=%B | grep -Po '([a-z]|\d|-)*\/' | sed "s,/$,," | awk 'NR==1')
GITHUB_PR_SOURCE_ROOT=$(git log -1 --pretty=%B | grep -Po '([a-z]|\d|-)*\/' | sed "s,/$,," | awk 'NR==2')
GITHUB_PR_ISSUE=$(git log -1 --pretty=%B | grep -Po '([a-z]|\d|-)*\/' | sed "s,/$,," | awk 'NR==3')

# TODO do some validation and exit 1 if the GITHUB_PR_SOURCE_ROOT is not expected value. Something like:
#if [[ `cat /tmp/workspace/echo-output` == "Hello, world!" ]]; then
#    echo "It worked!";
#else
#    echo "Nope!"; exit 1
#fi

echo "Pull request was for '${GITHUB_PR_ISSUE}' for sub source directory '${GITHUB_PR_SOURCE_ROOT}' merged by '${GITHUB_PR_USERNAME}'."

echo $GITHUB_PR_SOURCE_ROOT > /tmp/workspace/github_pr_source_root.txt

# we may not need to export
export GITHUB_PR_SOURCE_ROOT=$GITHUB_PR_SOURCE_ROOT
export GITHUB_PR_USERNAME=$GITHUB_PR_USERNAME
export GITHUB_PR_ISSUE=$GITHUB_PR_ISSUE