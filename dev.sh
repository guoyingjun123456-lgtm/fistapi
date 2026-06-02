#!/usr/bin/env bash
# web/default 前端开发热更新便捷脚本
# 用法:
#   ./dev.sh start    启动热更新 dev server (后台, 端口 3001)
#   ./dev.sh stop     停止
#   ./dev.sh log      实时日志
#   ./dev.sh status   查看状态
set -e
export PATH="$HOME/.bun/bin:$PATH"
DIR="$(cd "$(dirname "$0")/web/default" && pwd)"
LOG=/tmp/rsbuild-dev.log
PORT=3001

case "$1" in
  start)
    pkill -f "rsbuild dev" 2>/dev/null || true
    cd "$DIR"
    nohup bun run dev --host 0.0.0.0 --port "$PORT" > "$LOG" 2>&1 &
    echo "dev server 启动中 (pid=$!), 端口 $PORT"
    sleep 5; tail -6 "$LOG"
    ;;
  stop)
    pkill -f "rsbuild dev" && echo "已停止" || echo "未在运行"
    ;;
  log)    tail -f "$LOG" ;;
  status) pgrep -af "rsbuild dev" || echo "未运行" ;;
  *) echo "用法: ./dev.sh {start|stop|log|status}" ;;
esac
