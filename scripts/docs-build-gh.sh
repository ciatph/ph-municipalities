#!/bin/bash

# This script builds the class docs for GH Pages deployment, run from the repo root directory.
# NOTE: It requires JSDoc and theme dependencies.
# Run docs-install first before running this script.

# Copy build files
mkdir app/docs
cp docs/diagrams/ph-municipalities-arch-90.png app/docs/diagram.png

chmod u+x scripts/docs-install.sh
cp scripts/docs-install.sh app/

# Copy README file
sed "s|/docs/diagrams/ph-municipalities-arch-90.png|/ph-municipalities/diagram.png|g" README.md > app/README.md
cd app

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
