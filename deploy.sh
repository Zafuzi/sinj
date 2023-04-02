#!/bin/bash

# check that build.tar.gz exists
test -f build.tar.gz || exit 1

# get server and path from deploy.env
source deploy.env

# make sure UPLOAD_SERVER and UPLOAD_PATH are set
test -n "$UPLOAD_SERVER" || exit 1
test -n "$UPLOAD_PATH" || exit 1

# print the size of build.tar.gz
echo "build.tar.gz is $(du -h build.tar.gz | cut -f1)"
echo "Ready to upload build.tar.gz to $UPLOAD_SERVER:$UPLOAD_PATH"

# if this is a dry run then exit
if [ "$1" = "--dry" ]; then
    echo "Dry run, exiting"
    exit 0
fi

echo "Uploading build.tar.gz to $UPLOAD_SERVER:$UPLOAD_PATH"
# upload build.tar.gz to the server
scp build.tar.gz "$UPLOAD_SERVER":"$UPLOAD_PATH" || exit 1

# upload unpack.sh to the server
scp unpack.sh "$UPLOAD_SERVER":"$UPLOAD_PATH" || exit 1

echo "Unpacking build.tar.gz on $UPLOAD_SERVER:$UPLOAD_PATH"
# login to the server and run unpack.sh
ssh "$UPLOAD_SERVER" "cd $UPLOAD_PATH && ./unpack.sh" || exit 1

# remove build.tar.gz
rm -f build.tar.gz