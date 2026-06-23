#!/usr/bin/env bash
# 安装原版 UI 所需依赖到项目 .venv（环境隔离，不装系统 Python）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VENV_DIR="$ROOT/.venv"
PYTHON="${PYTHON:-python3}"

if [[ ! -d "$VENV_DIR" ]]; then
  echo "==> 创建虚拟环境: $VENV_DIR"
  "$PYTHON" -m venv "$VENV_DIR"
fi

PIP="$VENV_DIR/bin/pip"
echo "==> 项目: $ROOT"
echo "==> 安装原版 UI 依赖（首次较慢，请耐心等待）..."

"$PIP" install --upgrade pip
"$PIP" install -r "$ROOT/requirements-ui-original.txt"

echo ""
echo "✅ 原版 UI 依赖已安装到 $VENV_DIR"
echo "启动: bash scripts/run_original_ui.sh"
