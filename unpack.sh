#!/bin/bash

# this is to be run on the server it will:
# - unpack the tarball into temp directory
# - copy the files to the site directory using rsync to only copy changed files
# - remove the temp directory

# create site directory if it doesn't exist
echo "Checking for site directory"
mkdir -p site || exit 1

# unpack the tarball and name it temp 
echo "Unpacking tarball..."
tar -xzf build.tar.gz || exit 1

# copy the files to the site directory using rsync to only copy changed files
echo "Copying files..."
rsync -rva temp/ site || exit 1

# remove the temp directory
echo "Removing temp directory..."
rm -rf temp

# remove the tarball
echo "Removing tarball..."
rm -f build.tar.gz

# remove unpack.sh
echo "Removing unpack.sh..."
rm -f unpack.sh

# go into site and run npm install -s --production
echo "Installing npm packages..."
cd site || exit 1
npm install -s --production || exit 1
