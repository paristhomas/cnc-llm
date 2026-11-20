#!/usr/bin/env bash
# Rebuild the committed viewer bundles (cncllm/viewer/dist/viewer.js, 3+2: dist/viewer5.js) from src/.
# three.js and esbuild are installed into a cache dir OUTSIDE the package (the package's .js files are part of the
# harness fingerprint, node_modules must not be):  VIEWER_BUILD_DIR (default ~/.cache/cncllm-viewer-build).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK="${VIEWER_BUILD_DIR:-${XDG_CACHE_HOME:-$HOME/.cache}/cncllm-viewer-build}"
mkdir -p "$WORK"
if [ ! -x "$WORK/node_modules/.bin/esbuild" ] || [ ! -d "$WORK/node_modules/three" ]; then
  (cd "$WORK" && { [ -f package.json ] || npm init -y >/dev/null; } && npm install --no-audit --no-fund three@0.170.0 esbuild@0.24.2)
fi
export NODE_PATH="$WORK/node_modules"
ESB="$WORK/node_modules/.bin/esbuild"
# 1) worker (self-contained, started from a Blob URL so it works from file://)
"$ESB" "$HERE/src/worker.js" --bundle --format=iife --minify --target=es2020 --outfile="$HERE/dist/worker.txt" --log-level=warning
# 2) page bundle: three + OrbitControls + RoomEnvironment + viewer, one classic script
"$ESB" "$HERE/src/main.js" --bundle --format=iife --minify --target=es2020 --loader:.txt=text \
  --legal-comments=eof --outfile="$HERE/dist/viewer.js" --log-level=warning
# 3) 3+2 report: its own worker + page bundle (dist/worker5.txt, dist/viewer5.js)
"$ESB" "$HERE/src/worker5.js" --bundle --format=iife --minify --target=es2020 --outfile="$HERE/dist/worker5.txt" --log-level=warning
"$ESB" "$HERE/src/main5.js" --bundle --format=iife --minify --target=es2020 --loader:.txt=text \
  --legal-comments=eof --outfile="$HERE/dist/viewer5.js" --log-level=warning
cp "$WORK/node_modules/three/LICENSE" "$HERE/dist/THREE_LICENSE"
ls -l "$HERE/dist"
