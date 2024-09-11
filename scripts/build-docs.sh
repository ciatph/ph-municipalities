#!/bin/bash

cd app

# Install jsdoc and theme
npm install --save-dev jsdoc minami taffydb

# Generate the documentation
npm run generate-docs

# Find and export the active version no.
filePath="package.json"
version=$(grep -oP '"version":\s*"\K[^"]+' "$filePath")

# Output the version as a GitHub Actions output variable
echo "$version" >> $GITHUB_ENV
echo version: "$version"

# Log directories
ls -l -a

cd docs
ls -l -a

cd ph-municipalities
ls -l -a
