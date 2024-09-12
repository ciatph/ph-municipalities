#!/bin/bash

# This script builds the class docs for GH Pages deployment, run from the repo root directory.
# NOTE: It requires JSDoc and theme dependencies.
# Run docs-install first before running this script.

# Copy picture files
mkdir app/docs
cp docs/diagrams/ph-municipalities-arch-90.png app/docs/diagram.png

# Copy README file
sed "s|/docs/diagrams/ph-municipalities-arch-90.png|/ph-municipalities/diagram.png|g" README.md > app/README.md
cd app

# Generate the documentation
npm run generate-docs

# Log directories
ls -l -a

cd docs
ls -l -a

# Return to the root directory
cd ..

# Find and export the active version no.
# filePath="package.json"
# version=$(grep -oP '"version":\s*"\K[^"]+' "$filePath")

# Export the version as a GitHub Actions output variable
# Accessible in the GH Actions steps as: ${{ env.version }}

# echo "$version" >> $GITHUB_ENV
# echo version: "$version"
