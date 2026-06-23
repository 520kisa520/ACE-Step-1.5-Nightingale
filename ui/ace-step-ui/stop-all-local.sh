#!/usr/bin/env bash
# 停止 start-all-local.sh 启动的服务
ROOT="$(cd "$(dirname "$0")" && pwd)"

for name in api backend frontend; do
  pidfile="$ROOT/logs/${name}.pid"
  if [[ -f "$pidfile" ]]; then
    pid="$(cat "$pidfile")"
    if kill -0 "$pid" 2>/dev/null; then
      echo "停止 $name (PID $pid)"
      kill "$pid" 2>/dev/null || true
    fi
    rm -f "$pidfile"
  fi
done

echo "已停止"
