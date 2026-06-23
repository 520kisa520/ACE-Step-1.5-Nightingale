#!/usr/bin/env bash
# 启动完整疗愈 UI（需 Python 3.11+ 且已安装完整依赖，一般在云端 GPU 使用）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VENV_DIR="$ROOT/.venv"
PY="$VENV_DIR/bin/python"

if [[ ! -x "$PY" ]]; then
  echo "未找到 $VENV_DIR，请先安装完整环境（见 UI_GUIDE.md）"
  exit 1
fi

export PYTHONPATH="$ROOT${PYTHONPATH:+:$PYTHONPATH}"

exec "$PY" -m acestep.ui.gradio_healing.launch \
  --language zh \
  --config_path acestep-v15-xl-sft \
  "$@"
