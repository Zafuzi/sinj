#!/bin/bash

# config vars defines LOCAL and REMOTE
. ./.config || exit;

npm run clean
mkdir dist || exit;
npm run pack
cp -R api/ dist;
cp index.js dist;

echo "files copied";

cd dist || exit;

echo -e "\n--- deploying";
echo -e "--- LOCAL: $PWD";
echo -e "--- REMOTE: $REMOTE\n";

if rsync -a --info=progress2 --info=name0 . "$REMOTE"; then
  echo -e "\n--- OKAY!"
  echo -e "app deployed to https://$HOSTNAME\n";
else
  echo -e "\n--- FAIL!"
fi
