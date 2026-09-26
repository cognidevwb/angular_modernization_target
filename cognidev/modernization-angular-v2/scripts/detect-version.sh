#!/usr/bin/env sh
# Deterministic Angular generation detection (NO LLM). Wraps detect-version.py.
set -u
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec python3 "$DIR/detect-version.py" "${CW_WORKDIR:-$PWD}"
