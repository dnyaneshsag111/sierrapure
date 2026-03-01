#!/usr/bin/env bash
# =============================================================================
#  Sierra Pure — Start Script
#  Builds the Spring Boot backend (if needed) and starts both services.
#
#  Usage:
#    ./start.sh              # build JAR then start backend + frontend
#    ./start.sh --skip-build # start with existing JAR (faster)
#    ./start.sh --test-mail  # start with MAIL_TEST_MODE=true (console email)
#    ./start.sh --help
# =============================================================================

set -euo pipefail

# ── Paths ──────────────────────────────────────────────────────────────────
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UI_DIR="$ROOT_DIR/ui"
LOG_DIR="$ROOT_DIR/logs"
PID_FILE="$ROOT_DIR/.pids"
JAR_PATTERN="$ROOT_DIR/target/sierrapure-*.jar"

# ── Defaults ───────────────────────────────────────────────────────────────
SKIP_BUILD=false
MAIL_TEST_MODE=false
BACKEND_PORT=8080
FRONTEND_PORT=5173

# ── Colours ────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

# ── Helpers ────────────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*"; }
header()  { echo -e "\n${BOLD}${CYAN}$*${RESET}"; }

usage() {
  echo -e "${BOLD}Sierra Pure — Start Script${RESET}"
  echo ""
  echo "  Usage: ./start.sh [options]"
  echo ""
  echo "  Options:"
  echo "    --skip-build    Skip Maven build (use existing JAR)"
  echo "    --test-mail     Enable email test mode (prints emails to console)"
  echo "    --help          Show this help"
  echo ""
  echo "  Logs written to: ./logs/"
  echo "  PIDs stored in:  ./.pids"
  exit 0
}

# ── Parse args ─────────────────────────────────────────────────────────────
for arg in "$@"; do
  case $arg in
    --skip-build) SKIP_BUILD=true ;;
    --test-mail)  MAIL_TEST_MODE=true ;;
    --help|-h)    usage ;;
    *) error "Unknown option: $arg"; usage ;;
  esac
done

# ── Guard: already running? ────────────────────────────────────────────────
if [ -f "$PID_FILE" ]; then
  # shellcheck disable=SC1090
  source "$PID_FILE"
  _BP="${BACKEND_PID:-}"
  _FP="${FRONTEND_PID:-}"
  _BACKEND_ALIVE=false
  _FRONTEND_ALIVE=false
  [ -n "$_BP" ] && kill -0 "$_BP" 2>/dev/null && _BACKEND_ALIVE=true || true
  [ -n "$_FP" ] && kill -0 "$_FP" 2>/dev/null && _FRONTEND_ALIVE=true || true

  if [ "$_BACKEND_ALIVE" = true ] || [ "$_FRONTEND_ALIVE" = true ]; then
    error "Sierra Pure is already running (backend PID=${_BP}, frontend PID=${_FP})."
    error "Run ./stop.sh first."
    exit 1
  else
    warn "Stale .pids file found (processes are gone) — cleaning up and continuing."
    rm -f "$PID_FILE"
  fi
fi

# ── Setup ──────────────────────────────────────────────────────────────────
mkdir -p "$LOG_DIR"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"

header "============================================================"
header "  Sierra Pure — Starting Services"
header "============================================================"
echo ""

# ── Check prerequisites ────────────────────────────────────────────────────
info "Checking prerequisites..."

if ! command -v java &>/dev/null; then
  error "Java not found. Install Java 21+."
  exit 1
fi

JAVA_VER=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$JAVA_VER" -lt 21 ] 2>/dev/null; then
  error "Java 21+ required. Found: Java $JAVA_VER"
  exit 1
fi
success "Java $JAVA_VER found"

if ! command -v node &>/dev/null; then
  error "Node.js not found. Install Node 18+."
  exit 1
fi
success "Node $(node --version) found"

# Check MongoDB is reachable
if command -v mongosh &>/dev/null; then
  if mongosh --quiet --eval "db.runCommand({ping:1})" mongodb://localhost:27017 &>/dev/null; then
    success "MongoDB reachable at localhost:27017"
  else
    warn "MongoDB not reachable at localhost:27017 — backend may fail to start."
  fi
elif command -v mongo &>/dev/null; then
  if mongo --quiet --eval "db.runCommand({ping:1})" mongodb://localhost:27017 &>/dev/null; then
    success "MongoDB reachable at localhost:27017"
  else
    warn "MongoDB not reachable at localhost:27017 — backend may fail to start."
  fi
else
  warn "mongosh not found — skipping MongoDB connectivity check."
fi

# ── Build backend ──────────────────────────────────────────────────────────
if [ "$SKIP_BUILD" = true ]; then
  info "Skipping Maven build (--skip-build)."
  JAR_FILE=$(ls $JAR_PATTERN 2>/dev/null | grep -v original | head -1)
  if [ -z "$JAR_FILE" ]; then
    error "No JAR found at $JAR_PATTERN. Run without --skip-build first."
    exit 1
  fi
  success "Using existing JAR: $(basename "$JAR_FILE")"
else
  info "Building Spring Boot backend (skipping tests)..."
  echo ""
  cd "$ROOT_DIR"
  if ./mvnw package -DskipTests -q; then
    JAR_FILE=$(ls $JAR_PATTERN 2>/dev/null | grep -v original | head -1)
    success "Build successful → $(basename "$JAR_FILE")"
  else
    error "Maven build failed. Check the output above."
    exit 1
  fi
  echo ""
fi

# ── Install frontend dependencies if needed ────────────────────────────────
if [ ! -d "$UI_DIR/node_modules" ]; then
  info "Installing frontend dependencies (npm install)..."
  cd "$UI_DIR" && npm install --silent
  success "Frontend dependencies installed"
fi

# ── Start backend ──────────────────────────────────────────────────────────
header "Starting Backend (Spring Boot :$BACKEND_PORT)"

MAIL_TEST_FLAG=""
if [ "$MAIL_TEST_MODE" = true ]; then
  MAIL_TEST_FLAG="-DMAIL_TEST_MODE=true"
  warn "Email test mode ON — emails will be logged to console, not sent."
fi

cd "$ROOT_DIR"
# shellcheck disable=SC2086
java \
  -jar "$JAR_FILE" \
  -DMAIL_TEST_MODE="$MAIL_TEST_MODE" \
  --spring.profiles.active=default \
  > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!

info "Backend PID: $BACKEND_PID → logs: logs/backend.log"

# Wait up to 30s for backend to be ready
info "Waiting for backend to be ready..."
READY=false
for i in $(seq 1 30); do
  sleep 1
  if curl -sf "http://localhost:$BACKEND_PORT/api/v1/products" &>/dev/null; then
    READY=true
    break
  fi
  # Also check if process died
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    error "Backend process exited early. Check logs/backend.log for errors."
    rm -f "$PID_FILE"
    exit 1
  fi
  printf "."
done
echo ""

if [ "$READY" = false ]; then
  warn "Backend did not respond within 30s. It may still be starting."
  warn "Check logs/backend.log for details."
else
  success "Backend is UP at http://localhost:$BACKEND_PORT"
fi

# ── Start frontend ─────────────────────────────────────────────────────────
header "Starting Frontend (Vite :$FRONTEND_PORT)"

cd "$UI_DIR"
npm run dev \
  > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!

sleep 2
if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
  error "Frontend process exited early. Check logs/frontend.log for errors."
  kill "$BACKEND_PID" 2>/dev/null || true
  rm -f "$PID_FILE"
  exit 1
fi

success "Frontend is UP at http://localhost:$FRONTEND_PORT"

# ── Save PIDs ──────────────────────────────────────────────────────────────
{
  echo "BACKEND_PID=$BACKEND_PID"
  echo "FRONTEND_PID=$FRONTEND_PID"
  echo "STARTED_AT='$(date '+%Y-%m-%d %H:%M:%S')'"
  echo "JAR=$JAR_FILE"
} > "$PID_FILE"

# ── Summary ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}============================================================${RESET}"
echo -e "${BOLD}${GREEN}  Sierra Pure is running!${RESET}"
echo -e "${BOLD}${GREEN}============================================================${RESET}"
echo ""
echo -e "  ${BOLD}Frontend${RESET}   →  http://localhost:$FRONTEND_PORT"
echo -e "  ${BOLD}Backend${RESET}    →  http://localhost:$BACKEND_PORT/api/v1"
echo -e "  ${BOLD}Admin${RESET}      →  http://localhost:$FRONTEND_PORT/admin"
echo ""
echo -e "  ${BOLD}Logs${RESET}"
echo -e "    Backend  : tail -f logs/backend.log"
echo -e "    Frontend : tail -f logs/frontend.log"
echo ""
echo -e "  ${BOLD}Stop${RESET}       →  ./stop.sh"
echo -e "  ${BOLD}Restart${RESET}    →  ./restart.sh"
echo ""
if [ "$MAIL_TEST_MODE" = true ]; then
  echo -e "  ${YELLOW}Email test mode: emails logged to console (not sent)${RESET}"
  echo ""
fi
