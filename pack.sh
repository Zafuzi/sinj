#!/bin/bash

# remove temp and build.tar.gz if they exist
rm -rf temp
rm build.tar.gz

# build the client
cd client
npm run build
cd ..

# make temp directory
mkdir -p temp/build

# rsync the client build to the temp directory
rsync -a client/build/ temp/build/ | sed '0,/^$/d'

# copy the server files to the temp directory
rsync -a server/ temp/ --exclude=*.db --exclude=node_modules

# pack the temp directory into a compressed tarball
tar -czf build.tar.gz temp/

# remove the temp directory
rm -rf temp
