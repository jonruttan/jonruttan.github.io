#!/bin/sh
# logo-bc.sh — run a Logo program and print its turtle bytecode as a JSON array.
#
# Usage:
#   sh _tools/logo-bc.sh program.logo                 # JSON array on stdout
#   sh _tools/logo-bc.sh program.logo out/fig.json    # or write to a file
#
# Paste the array into a post as the `bc` parameter of
# _includes/turtle-geometry/turtle.html, or save it under
# assets/turtle-geometry/bc/ and reference it with `src`.
#
# Requires an x-lang checkout; set X_LANG_DIR if it isn't ~/Workspace/x.
set -e

X_LANG_DIR="${X_LANG_DIR:-$HOME/Workspace/x}"
BC_FILE=/tmp/turtle.bc

if [ -z "$1" ] || [ ! -f "$1" ]; then
  echo "usage: $0 program.logo [out.json]" >&2
  exit 1
fi

prog=$(cd "$(dirname "$1")" && pwd)/$(basename "$1")

# Batch mode writes the bytecode stream to /tmp/turtle.bc and exits.
(cd "$X_LANG_DIR" && sh x.sh -l logo -f "$prog" >/dev/null)

# The stream is comma-terminated entries, one line each; wrap as a JSON array.
json="[$(tr -d '\n' < "$BC_FILE" | sed 's/,$//')]"

if [ -n "$2" ]; then
  printf '%s\n' "$json" > "$2"
  echo "wrote $2" >&2
else
  printf '%s\n' "$json"
fi
