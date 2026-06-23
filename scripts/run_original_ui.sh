#!/usr/bin/env bash
# 启动 ACE-Step 原版 Gradio UI（不加载模型，只看界面）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VENV_DIR="$ROOT/.venv"
PY="$VENV_DIR/bin/python"

if [[ ! -x "$PY" ]]; then
  echo "请先运行: bash scripts/setup_original_ui_env.sh"
  exit 1
fi

export PYTHONPATH="$ROOT${PYTHONPATH:+:$PYTHONPATH}"

PORT="${PORT:-7862}"

echo "==> 原版 ACE-Step UI: http://127.0.0.1:${PORT}"
echo "==> Python: $("$PY" --version)"
echo "==> 未初始化模型（仅浏览界面）；按 Ctrl+C 停止"
echo ""

export PORT="$PORT"
exec "$PY" "$ROOT/acestep/ui/gradio_healing/run_original_preview.py"
