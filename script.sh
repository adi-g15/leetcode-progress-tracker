#!/bin/bash
# cd to directory containing this file
cd "$(dirname "$0")"
cp records.json records.json.bak || true
npm run start
