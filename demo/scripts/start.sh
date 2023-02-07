#!/bin/sh
NODE_VERSION=$(node -v)
MATCH="[[:digit:]]+"
if [[ $NODE_VERSION =~ $MATCH ]]; then
  echo "Running Node.js $NODE_VERSION."
  MAJOR_VERSION=${BASH_REMATCH[0]}
  MAX_VERSION=16
  if [ $MAJOR_VERSION -gt $MAX_VERSION ]
  then
    echo "Node.js v$MAX_VERSION LTS recommended. Setting --openssl-legacy-provider to support Node.js v17+."
    NODE_OPTIONS=--openssl-legacy-provider npm run serve
  else
    npm run serve
  fi
fi
