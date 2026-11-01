#!/usr/bin/env bash
# Writes pages/index.json: the list of .html and .jpg files directly inside each
# project folder (pages/<project>/...). The landing page reads this list.
# Run by .github/workflows/build-index.yml, and can be run locally too.
set -euo pipefail
cd "$(dirname "$0")/.."

find pages -mindepth 2 -maxdepth 2 -type f \( -name '*.html' -o -name '*.jpg' \) \
  | LC_ALL=C sort \
  | python3 -c 'import json, sys; print(json.dumps([line.strip() for line in sys.stdin], indent=2))' \
  > pages/index.json
