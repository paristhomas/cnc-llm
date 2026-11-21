#!/usr/bin/env bash
# Trusted final evaluation of a run from a CLEAN checkout of the frozen harness commit (ACCEPTANCE_REFINE I2).
#   tools/frozen_eval.sh <run_dir> [frozen_commit]
# The frozen commit defaults to the one recorded in harness_frozen.json. The run directory is evaluated in place
# (final/ is rewritten); the harness code that runs is the checkout's, never the working tree's.
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN="$(cd "$1" && pwd)"
# default: the commit that last changed harness_frozen.json (= the freeze commit)
COMMIT="${2:-$(git -C "$REPO" log -1 --format=%H -- harness_frozen.json)}"
WT="$(mktemp -d /tmp/cncllm-frozen-XXXXXX)"
git -C "$REPO" worktree add --detach "$WT" "$COMMIT" >/dev/null
trap 'git -C "$REPO" worktree remove --force "$WT" >/dev/null 2>&1 || true' EXIT
echo "frozen checkout $COMMIT at $WT"
cd "$WT"
PY="${PYTHON:-$REPO/.venv/bin/python}"
PYTHONPATH="$WT" MILLBILL_DIR="${MILLBILL_DIR:-$HOME/millbill}" "$PY" -c "
import sys; sys.path.insert(0, '$WT')
import cncllm, os
assert os.path.realpath(cncllm.__file__).startswith(os.path.realpath('$WT')), cncllm.__file__
from cncllm import x5
x5.main(['evaluate', '$RUN'] + sys.argv[1:])
" "${@:3}"
python3 - "$RUN" "$COMMIT" <<'EOF'
import json, sys
ev = json.load(open(sys.argv[1] + "/final/evaluation.json"))
ev.setdefault("integrity", {})["frozen_checkout_commit"] = sys.argv[2]
json.dump(ev, open(sys.argv[1] + "/final/evaluation.json", "w"), indent=1, default=float)
m = ev["metrics"]
print(f"trusted (clean checkout {sys.argv[2][:10]}): whole surface {m['whole_surface_in_tol_pct']}%, valid={m['valid']}, "
      f"integrity ok={ev['integrity'].get('ok')}, MillBill {ev.get('crosscheck_millbill', {}).get('agreement_pct')}")
EOF
