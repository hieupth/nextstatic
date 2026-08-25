#!/bin/bash
# Sync the lib's built dist into node_modules — replacing the file:..
# symlink (which Turbopack/Next 16 cannot follow outside the app root)
# with real files. Run from examples/.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$DIR")"
DEST="$DIR/node_modules/@hieupth/nextstatic"

# Skip when the tarball install is present (preview job) — real files,
# not a symlink to the source repo. sync-lib would overwrite the
# tarball-validated build with a source build, defeating the preview's
# purpose.
if [ -d "$DEST" ] && [ ! -L "$DEST" ]; then
  echo "tarball install detected (real files, not symlink) — skipping sync-lib"
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
echo "synced @hieupth/nextstatic → node_modules (real files, no symlink)"
