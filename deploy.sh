#!/bin/bash

# config vars defines LOCAL and REMOTE
. ./.config || exit;

npm run clean
npm run pack

echo "files copied";
echo -e "\n--- deploying";
echo -e "--- LOCAL: $PWD";
echo -e "--- REMOTE: $REMOTE\n";

if rsync -a --info=progress2 --info=name0 . "$REMOTE"; then
  echo -e "\n--- OKAY!"
  echo -e "app deployed to https://$HOSTNAME\n";
else
  echo -e "\n--- FAIL!"
fi
