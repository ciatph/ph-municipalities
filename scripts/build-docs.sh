#!/bin/bash

# Copy files
cp -r docs/ app/
sed "s|/docs/diagrams|/diagrams|g" README.md > app/README.md

cd app

# Install jsdoc and theme
npm install --save-dev jsdoc@4.0.3 minami@1.2.3 taffydb@2.7.3

# Generate the documentation
npm run generate-docs

# Log directories
ls -l -a

cd docs
ls -l -a

# Find and export the active version no.
# filePath="package.json"
# version=$(grep -oP '"version":\s*"\K[^"]+' "$filePath")

# Export the version as a GitHub Actions output variable
# Accessible in the GH Actions steps as: ${{ env.version }}

# echo "$version" >> $GITHUB_ENV
# echo version: "$version"
