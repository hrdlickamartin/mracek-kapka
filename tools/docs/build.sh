#!/bin/sh
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for name in game-art-bible ui-style-guide rozsireni vydani; do
  [ -f "$name.html" ] || continue
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=10000 --print-to-pdf="../../docs/$name.pdf" "file://$PWD/$name.html" >/dev/null 2>&1
  echo "docs/$name.pdf"
done
