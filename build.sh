#!/bin/bash

set -e

rm -f Code.js

tsc --noImplicitUseStrict --outDir . src/Code.ts

sed -i '1s/^/const exports = {};\n/' Code.js
