#!/usr/bin/env bash

export GITHUB_PR_USERNAME=$(git log -1 --pretty=%B | grep -Po '([a-z]|\d|-)*\/' | sed "s,/$,," | awk 'NR==1')
export GITHUB_PR_SOURCE_ROOT=$(git log -1 --pretty=%B | grep -Po '([a-z]|\d|-)*\/' | sed "s,/$,," | awk 'NR==2')
export GITHUB_PR_ISSUE=$(git log -1 --pretty=%B | grep -Po '([a-z]|\d|-)*\/' | sed "s,/$,," | awk 'NR==3')

echo "Pull request was for '${GITHUB_PR_ISSUE}' for sub source directory '${GITHUB_PR_SOURCE_ROOT}' merged by '${GITHUB_PR_USERNAME}'."