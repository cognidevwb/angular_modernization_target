#!/usr/bin/env sh
# The CLI workspace pointed at real files, so `ng update` and its migrations see the code. Wraps repair-workspace.py.
set -u
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
WS="${CW_WORKDIR:-$PWD}"
# The app is not always the repository — one resolver answers this for every
# script in this playbook (scripts/app-root.sh), from what detect-version
# recorded. Looking only at the workspace root made this step report a repo
# whose app is `Web/` as having no package.json / no CLI workspace at all.
APP_REL=$(sh "$DIR/app-root.sh" "$WS")
APP="$WS"; [ "$APP_REL" = "." ] || APP="$WS/$APP_REL"
# The app to repair, then the workspace the record belongs to.
exec python3 "$DIR/repair-workspace.py" "$APP" "$WS"
