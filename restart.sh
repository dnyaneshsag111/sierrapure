#!/usr/bin/env bash
# =============================================================================
#  Sierra Pure — Restart Script
#  Stops all running services, rebuilds the backend, and starts everything.
#
#  Usage:
#    ./restart.sh              # full stop → build → start
#    ./restart.sh --skip-build # stop → start with existing JAR
#    ./restart.sh --test-mail  # start with email test mode ON
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }

echo ""
echo -e "${BOLD}${CYAN}============================================================${RESET}"
echo -e "${BOLD}${CYAN}  Sierra Pure — Restarting${RESET}"
echo -e "${BOLD}${CYAN}============================================================${RESET}"
echo ""

# ── Step 1: Stop existing services (force-kill so nothing lingers) ──────────
info "Step 1/3 — Stopping existing services..."
echo ""
"$ROOT_DIR/stop.sh" --force || true

# ── Step 2: Poll until ports 8080 and 5173 are actually free ───────────────
echo ""
info "Step 2/3 — Waiting for ports 8080 and 5173 to be free..."

MAX_WAIT=20
waited=0
while true; do
  BACKEND_PID=$(lsof -ti tcp:8080 2>/dev/null | head -1 || true)
  FRONTEND_PID=$(lsof -ti tcp:5173 2>/dev/null | head -1 || true)

  if [ -z "$BACKEND_PID" ] && [ -z "$FRONTEND_PID" ]; then
    success "All ports are free."
    break
  fi

  if [ "$waited" -ge "$MAX_WAIT" ]; then
    warn "Ports still occupied after ${MAX_WAIT}s — force-killing remaining processes..."
    [ -n "$BACKEND_PID" ]  && kill -9 "$BACKEND_PID"  2>/dev/null && info "Killed stale backend  (PID $BACKEND_PID)"  || true
    [ -n "$FRONTEND_PID" ] && kill -9 "$FRONTEND_PID" 2>/dev/null && info "Killed stale frontend (PID $FRONTEND_PID)" || true
    sleep 1
    break
  fi

  printf "  Waiting... (%ds / ${MAX_WAIT}s)\r" "$waited"
  sleep 1
  waited=$((waited + 1))
done

echo ""

# ── Step 3: Start services fresh ───────────────────────────────────────────
info "Step 3/3 — Starting services..."
echo ""

# Forward all original args to start.sh (e.g. --skip-build, --test-mail)
"$ROOT_DIR/start.sh" "$@"
