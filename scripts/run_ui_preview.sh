#!/usr/bin/env bash
# 启动疗愈 UI 本地预览（仅布局，无需 GPU / 模型）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VENV_DIR="$ROOT/.venv"
PY="$VENV_DIR/bin/python"

if [[ ! -x "$PY" ]]; then
  echo "未找到 $VENV_DIR，请先运行:"
  echo "  bash scripts/setup_ui_env.sh"
  exit 1
fi

export PYTHONPATH="$ROOT${PYTHONPATH:+:$PYTHONPATH}"

echo "==> 启动 UI 预览: http://127.0.0.1:7861"
echo "==> Python: $("$PY" --version)"
echo "==> 按 Ctrl+C 停止"
echo ""

exec "$PY" "$ROOT/acestep/ui/gradio_healing/preview.py"
