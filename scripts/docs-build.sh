# This script builds the class documentation from a Docker environment.
# NOTE: It requires assets from the root directory mounted as volumes.
# Run docs-install first before running this script.

# Copy picture files
mkdir docs
cp diagrams/ph-municipalities-arch-90.png docs/diagram.png

# Copy README file
sed "s|/docs/diagrams/ph-municipalities-arch-90.png|diagram.png|g" README.tmp > README.md

# Generate the documentation
npm run generate-docs
