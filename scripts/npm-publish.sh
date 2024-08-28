#!/bin/bash

# Use image file from remote URL source since NPM does not allow displaying images by relative path
sed "s|/docs/diagrams/ph-municipalities-arch-90.png|${IMAGE_URL}|g" README.md > app/README.md
