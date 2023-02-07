#!/bin/sh
NODE_VERSION=$(node -v)
MATCH="[[:digit:]]+"
if [[ $NODE_VERSION =~ $MATCH ]]; then
    echo "Running Node.js $NODE_VERSION."
    MAJOR_VERSION=${BASH_REMATCH[0]}
    MAX_VERSION=16
    if [ $MAJOR_VERSION -gt $MAX_VERSION ]
    then
      echo "Node.js v$MAX_VERSION LTS recommended. Setting --openssl-legacy-provider as a workaround."
      npm run support-node-17
    fi
    npm i
fi
