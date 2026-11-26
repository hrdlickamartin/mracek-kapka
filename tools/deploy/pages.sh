#!/bin/sh
set -e
cd "$(dirname "$0")/../.."
ROOT=$(pwd)
REMOTE=$(git remote get-url origin)
URL="https://hrdlickamartin.github.io/mracek-kapka/"
WORK=$(mktemp -d)
BACKUP="$WORK/app.json"

if [ -n "$(git status --porcelain)" ]; then
  echo "Pracovní strom není čistý. Nejdřív commitni změny, nasazuje se jen commitnutý stav." >&2
  exit 1
fi

cp app.json "$BACKUP"
restore() { cp "$BACKUP" "$ROOT/app.json"; }
trap restore EXIT

node -e "const f='app.json';const d=JSON.parse(require('fs').readFileSync(f));d.expo.experiments={...(d.expo.experiments||{}),baseUrl:'/mracek-kapka'};require('fs').writeFileSync(f,JSON.stringify(d,null,2)+'\n')"
npx expo export --platform web --output-dir "$WORK/web" > "$WORK/export.log" 2>&1 || { tail -20 "$WORK/export.log"; exit 1; }
restore

HASH=$(grep -o 'index-[a-f0-9]*\.js' "$WORK/web/index.html" | head -1)
SOURCE=$(git rev-parse --short HEAD)

git clone --quiet --branch gh-pages --single-branch "$REMOTE" "$WORK/pages"
cd "$WORK/pages"
git rm -rq --ignore-unmatch .
cp -R "$WORK/web/." .
touch .nojekyll
git add -A
git -c user.name="$(git -C "$ROOT" config user.name)" -c user.email="$(git -C "$ROOT" config user.email)" commit -q -m "Web build z $SOURCE" || echo "Build se nezměnil."
git push -q origin gh-pages
cd "$ROOT"

echo "Nasazeno $HASH, čekám, až ho Pages začnou servírovat…"
i=0
while [ $i -lt 60 ]; do
  if curl -s "$URL?deploy=$i" | grep -q "$HASH"; then
    echo "Živě: $URL ($HASH)"
    trap - EXIT
    rm -rf "$WORK"
    exit 0
  fi
  i=$((i + 1))
  sleep 10
done
echo "Pages zatím servírují starou verzi. Zkontroluj $URL za pár minut (cache až 10 min)." >&2
exit 1
