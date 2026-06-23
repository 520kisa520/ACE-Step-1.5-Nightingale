#!/usr/bin/env bash
# 在项目目录内创建隔离虚拟环境 .venv（UI 预览用）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VENV_DIR="$ROOT/.venv"
PYTHON="${PYTHON:-python3}"

echo "==> 项目目录: $ROOT"
echo "==> 使用解释器: $("$PYTHON" --version 2>&1)"

if [[ ! -d "$VENV_DIR" ]]; then
  echo "==> 创建虚拟环境: $VENV_DIR"
  "$PYTHON" -m venv "$VENV_DIR"
else
  echo "==> 虚拟环境已存在: $VENV_DIR"
fi

PIP="$VENV_DIR/bin/pip"
PY="$VENV_DIR/bin/python"

"$PIP" install --upgrade pip
"$PIP" install -r "$ROOT/requirements-ui-preview.txt"

echo ""
echo "✅ UI 预览环境就绪（全部安装在 $VENV_DIR）"
echo ""
echo "启动预览:"
echo "  bash scripts/run_ui_preview.sh"
