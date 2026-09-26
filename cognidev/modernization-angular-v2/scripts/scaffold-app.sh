#!/usr/bin/env sh
# Deterministic modern Angular target skeleton (NO LLM). Wraps scaffold-app.py.
set -u
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec python3 "$DIR/scaffold-app.py" "${CW_WORKDIR:-$PWD}"
