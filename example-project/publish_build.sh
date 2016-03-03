#!/usr/bin/env bash

# Make sure you have the following environment
# variables defined so `steamy` can contact the api
# STEAMY_URL = http://localhost:9484/
# STEAMY_VERSION = v1
# STEAMY_TOKEN = ...

# This the name of the project you created in steamy
STEAMY_PROJECT=example-project

# Gather build info
DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
DIRNAME=$(basename "$DIR")
BUILD_DATE=$(date +"%Y-%m-%d-%H%M%S")
BUILDNAME="$DIRNAME.$BUILD_DATE.tar.gz"

# Gather git info
REPO_USER=$(git config user.email)
REPO_USER=${REPO_USER:-unknown}
REPO_URL=$(git config --get remote.origin.url)
REPO_URL=${REPO_URL:-unknown}
REPO_NAME="$DIRNAME"
REPO_COMMIT=$(git rev-parse HEAD)
REPO_BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
REPO_COMMIT_7=${REPO_COMMIT:0:7}

# Create a build artifact
mkdir -p build
tar --exclude-vcs-ignores --exclude-vcs --create --gzip --file "build/$BUILDNAME" "$DIR"

# Publish it
steamy -publish \
  -token "$STEAMY_API_TOKEN" \
  -version "$STEAMY_PROJECT.$BUILD_DATE.$REPO_COMMIT_7"
  -artifact "build/$BUILDNAME" \
  -project "$STEAMY_PROJECT" \
  -repo-url "$REPO_URL" \
  -repo-name "$REPO_NAME" \
  -repo-branch "$REPO_BRANCH" \
  -repo-commit "$REPO_COMMIT" \
  -publisher "$REPO_USER"
