#!/bin/bash
# Sync the lib's built dist into node_modules — replacing the file:..
# symlink (which Turbopack/Next 16 cannot follow outside the app root)
# with real files. Run from examples/.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$DIR")"
DEST="$DIR/node_modules/@hieupth/nextstatic"
STAMP=".synced-by-sync-lib"

# Skip only when a TARBALL install is present (e.g. a preview job): real files
# that sync-lib did NOT put there (no stamp). A previous sync-lib run
# leaves the stamp, so it refreshes its own copy instead of freezing it.
if [ -d "$DEST" ] && [ ! -L "$DEST" ] && [ ! -f "$DEST/$STAMP" ]; then
  echo "tarball install detected (real files, no sync-lib stamp) — skipping sync-lib"
  exit 0
fi

if [ ! -f "$ROOT/dist/index.js" ]; then
  echo "lib not built — building..."
  (cd "$ROOT" && npm run build)
fi

rm -rf "$DEST"
mkdir -p "$DEST"
cp -r "$ROOT/dist" "$DEST/"
cp "$ROOT/package.json" "$DEST/"
touch "$DEST/$STAMP"
echo "synced @hieupth/nextstatic → node_modules (real files, no symlink)"
