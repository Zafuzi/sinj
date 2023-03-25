#!/bin/bash
# This script will copy ./client into ./dist and then minimize the files

# Copy ./client into ./dist
cp -rL ./client ./dist
NODE_ENV=production node minify.js