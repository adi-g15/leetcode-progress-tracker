#!/bin/bash
# cd to directory containing this file
cd "$(dirname "$0")"

# if .nvm/nvm.sh exists, source it
if [ -f $HOME/.nvm/nvm.sh ]; then
  source $HOME/.nvm/nvm.sh
fi

cp records.json records.json.bak || true
npm run start
