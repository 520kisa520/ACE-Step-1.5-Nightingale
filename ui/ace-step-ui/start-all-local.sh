#!/usr/bin/env bash
# 本地一键启动（无需 uv，使用 ACE-Step 项目内 .venv）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
ACESTEP_PATH="${ACESTEP_PATH:-$ROOT/../ACE-Step 1.5 XL SFT}"
VENV_PY="$ACESTEP_PATH/.venv/bin/python"

if [[ ! -x "$VENV_PY" ]]; then
  echo "错误: 未找到 Python 虚拟环境"
  echo "  路径: $ACESTEP_PATH/.venv"
  echo "  请先运行: bash \"$ACESTEP_PATH/scripts/setup_original_ui_env.sh\""
  exit 1
fi

if [[ ! -d "$ROOT/node_modules" || ! -d "$ROOT/server/node_modules" ]]; then
  echo "错误: ace-step-ui 依赖未安装，请先 ./setup.sh"
  exit 1
fi

mkdir -p "$ROOT/logs"

# 停止已有进程（若存在）
if [[ -f "$ROOT/logs/api.pid" ]]; then kill "$(cat "$ROOT/logs/api.pid")" 2>/dev/null || true; fi
if [[ -f "$ROOT/logs/backend.pid" ]]; then kill "$(cat "$ROOT/logs/backend.pid")" 2>/dev/null || true; fi
if [[ -f "$ROOT/logs/frontend.pid" ]]; then kill "$(cat "$ROOT/logs/frontend.pid")" 2>/dev/null || true; fi

export PYTHONPATH="$ACESTEP_PATH${PYTHONPATH:+:$PYTHONPATH}"
export ACESTEP_NO_INIT="${ACESTEP_NO_INIT:-true}"

echo "=================================="
echo "  ACE-Step UI 本地启动"
echo "=================================="
echo "  ACE-Step: $ACESTEP_PATH"
echo "  Python:   $("$VENV_PY" --version)"
echo ""

echo "[1/3] 启动 ACE-Step API (port 8001, --no-init 快速预览)..."
cd "$ACESTEP_PATH"
nohup "$VENV_PY" -m acestep.api_server --port 8001 --host 127.0.0.1 --no-init \
  > "$ROOT/logs/api.log" 2>&1 &
echo $! > "$ROOT/logs/api.pid"
cd "$ROOT"
sleep 4

if ! kill -0 "$(cat "$ROOT/logs/api.pid")" 2>/dev/null; then
  echo "API 启动失败，查看 logs/api.log:"
  tail -20 "$ROOT/logs/api.log"
  exit 1
fi

echo "[2/3] 启动 UI 后端 (port 3001)..."
cd "$ROOT/server"
nohup npm run dev > "$ROOT/logs/backend.log" 2>&1 &
echo $! > "$ROOT/logs/backend.pid"
cd "$ROOT"
sleep 4

if ! kill -0 "$(cat "$ROOT/logs/backend.pid")" 2>/dev/null; then
  echo "后端启动失败，查看 logs/backend.log:"
  tail -20 "$ROOT/logs/backend.log"
  exit 1
fi

echo "[3/3] 启动 UI 前端 (port 3000)..."
nohup npm run dev > "$ROOT/logs/frontend.log" 2>&1 &
echo $! > "$ROOT/logs/frontend.pid"
sleep 3

echo ""
echo "=================================="
echo "  服务已启动"
echo "=================================="
echo "  前端 UI:  http://localhost:3000"
echo "  后端 API: http://localhost:3001"
echo "  ACE-Step: http://localhost:8001/health"
echo ""
echo "  日志目录: $ROOT/logs/"
echo "  停止服务: bash \"$ROOT/stop-all-local.sh\""
echo ""

if command -v open &>/dev/null; then
  sleep 2
  open "http://localhost:3000" || true
fi
