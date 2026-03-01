#!/usr/bin/env bash
# =============================================================================
#  Sierra Pure — Stop Script
#  Gracefully stops the Spring Boot backend and Vite frontend.
#
#  Usage:
#    ./stop.sh           # stop both services
#    ./stop.sh --force   # SIGKILL instead of graceful SIGTERM
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT_DIR/.pids"

# ── Colours ────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*"; }

# ── Parse args ─────────────────────────────────────────────────────────────
FORCE=false
for arg in "$@"; do
  case $arg in
    --force|-f) FORCE=true ;;
    --help|-h)
      echo -e "${BOLD}Sierra Pure — Stop Script${RESET}"
      echo ""
      echo "  Usage: ./stop.sh [--force]"
      echo ""
      echo "  --force   Use SIGKILL instead of graceful SIGTERM"
      exit 0
      ;;
    *) error "Unknown option: $arg"; exit 1 ;;
  esac
done

echo ""
echo -e "${BOLD}${CYAN}============================================================${RESET}"
echo -e "${BOLD}${CYAN}  Sierra Pure — Stopping Services${RESET}"
echo -e "${BOLD}${CYAN}============================================================${RESET}"
echo ""

# ── Helper: kill a single PID ──────────────────────────────────────────────
kill_pid() {
  local pid="$1"
  local name="$2"
  local timeout=10

  if ! kill -0 "$pid" 2>/dev/null; then
    return 0  # already gone
  fi

  info "Stopping $name (PID $pid)..."

  if [ "$FORCE" = true ]; then
    kill -9 "$pid" 2>/dev/null || true
    success "$name (PID $pid) force-killed."
    return
  fi

  # Graceful SIGTERM → wait → fallback SIGKILL
  kill -15 "$pid" 2>/dev/null || true
  local waited=0
  while kill -0 "$pid" 2>/dev/null; do
    sleep 1
    waited=$((waited + 1))
    if [ "$waited" -ge "$timeout" ]; then
      warn "$name (PID $pid) did not stop within ${timeout}s — sending SIGKILL..."
      kill -9 "$pid" 2>/dev/null || true
      break
    fi
    printf "."
  done
  echo ""
  success "$name (PID $pid) stopped."
}

# ── Helper: kill ALL processes listening on a port ─────────────────────────
kill_port() {
  local port="$1"
  local name="$2"
  # lsof may return multiple PIDs (parent + child); kill them all
  local pids
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [ -z "$pids" ]; then
    return 0
  fi
  for pid in $pids; do
    kill_pid "$pid" "$name (port $port)"
  done
}

# ── Remove PID file early so start.sh is never blocked by a stale file ─────
if [ -f "$PID_FILE" ]; then
  # shellcheck disable=SC1090
  source "$PID_FILE"
  BACKEND_PID="${BACKEND_PID:-}"
  FRONTEND_PID="${FRONTEND_PID:-}"
  STARTED_AT="${STARTED_AT:-unknown}"
  info "Services were started at: $STARTED_AT"
  echo ""
  rm -f "$PID_FILE"   # remove NOW before any kill attempt
fi

# ── Kill by PID from file (most reliable when available) ───────────────────
if [ -n "${FRONTEND_PID:-}" ]; then
  kill_pid "$FRONTEND_PID" "Frontend (Vite)"
fi
if [ -n "${BACKEND_PID:-}" ]; then
  kill_pid "$BACKEND_PID" "Backend (Spring Boot)"
fi

# ── Always sweep ports — catches child processes & orphans ─────────────────
info "Sweeping ports 8080 and 5173 for any remaining processes..."
kill_port 8080 "Backend"
kill_port 5173 "Frontend"

# ── Final safety net: kill by process name ─────────────────────────────────
# Catches cases where the PID file pointed to a wrapper shell, not the real process
JAVA_PIDS=$(pgrep -f "sierrapure.*\.jar" 2>/dev/null || true)
VITE_PIDS=$(pgrep -f "vite" 2>/dev/null || true)

for pid in $JAVA_PIDS; do
  kill_pid "$pid" "Backend (java sierrapure)"
done
for pid in $VITE_PIDS; do
  kill_pid "$pid" "Frontend (vite)"
done

echo ""
echo -e "${BOLD}${GREEN}============================================================${RESET}"
echo -e "${BOLD}${GREEN}  Sierra Pure stopped successfully.${RESET}"
echo -e "${BOLD}${GREEN}============================================================${RESET}"
echo ""
echo -e "  Run ${BOLD}./start.sh${RESET} to start again."
echo ""
