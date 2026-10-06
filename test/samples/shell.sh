#!/usr/bin/env bash
set -euo pipefail

# Build and package the extension
VERSION="${1:-0.5.0}"
OUT_DIR=./dist
readonly NAME=true-godot

log() {
  local level=$1; shift
  echo "[$(date +%H:%M:%S)] [$level] $*" >&2
}

if [[ ! -d "$OUT_DIR" ]]; then
  mkdir -p "$OUT_DIR"
fi

for file in themes/*.json; do
  log INFO "Validating $file"
  node -e "JSON.parse(require('fs').readFileSync('$file'))" || exit 1
done

case "$VERSION" in
  *-beta) log WARN "Pre-release" ;;
  *) npx @vscode/vsce package -o "$OUT_DIR/$NAME-$VERSION.vsix" ;;
esac

cat <<EOT > "$OUT_DIR/README.txt"
Built $NAME $VERSION
EOT
echo "Done: $(ls "$OUT_DIR" | wc -l) files" | tee -a build.log
