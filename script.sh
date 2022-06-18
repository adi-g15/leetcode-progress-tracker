#!/bin/bash
# cd to directory containing this file
cd "$(dirname "$0")"

# if .nvm/nvm.sh exists, source it
if [ -f $HOME/.nvm/nvm.sh ]; then
  source $HOME/.nvm/nvm.sh
fi

cp records.json records.json.bak || true
npm run start

### AFTER THIS LINE, IT'S RELEVANT FOR GITHUB ACTION ###

: ${REPO_DIR:="/tmp/repo"}

: ${GIT_REMOTE:=""}
: ${GIT_BRANCH:="records"}

: ${GITHUB_ACTOR:=""}
GITHUB_REPO_OWNER=${GITHUB_REPOSITORY%/*}
GITHUB_REPO_NAME=${GITHUB_REPOSITORY#*/}

ensure_env() {
	: ${!1:?"env \$${1} is not set"}
}

githubaction() {
    ensure_env GIT_REMOTE
    ensure_env GIT_BRANCH
    ensure_env GITHUB_ACTOR

    ## Step 1: Update the records, assuming currently in the cloned directory
    cp records.json records.json.bak || true
    npm run start

    mkdir -p ${REPO_DIR}
    cp records.json records.json.bak ${REPO_DIR}/

    ## Step 2: Create a branch, and commit the files
    cd ${REPO_DIR}
    git init
    git checkout --orphan "${GIT_BRANCH}"
    git add --all
    git config user.email "bot.noreply@github.com"
    git config user.name "AdiG Bot"

    git commit -m "Updated at $(date +'%Y/%m/%d %H:%M:%S')"

    ## Step 3: Push
    git remote add origin "${GIT_REMOTE}"
    git push --force --set-upstream origin "${GIT_BRANCH}"
}

set -xe
"$@"

