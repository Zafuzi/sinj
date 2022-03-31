#!/bin/bash

# config vars defines LOCAL and REMOTE
. ./.config

rm -rf dist;
mkdir dist;
cp -R static dist;
cp -R api dist;
cp index.js dist;
cp package.json dist;

echo "files copied";
echo "running npm install";
cd dist;
npm i --silent;

echo "";
echo "deploying";
echo "LOCAL:" $PWD;
echo "REMOTE: $REMOTE";
echo "";

if rsync -a --info=progress2 --info=name0 . "$REMOTE"; then
  echo ""
  echo "OKAY!"
  echo "app deployed to https://$HOSTNAME";
else
  echo ""
  echo "FAIL!"
fi
