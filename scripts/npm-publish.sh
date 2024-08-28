#!/bin/bash

sed "s|/docs/diagrams||g" README.md > app/README.md
cp docs/diagrams/ph-municipalities-arch-90.png app/
