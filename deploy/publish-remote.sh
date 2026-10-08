#!/bin/bash
set -euo pipefail

API=$(readlink -f /opt/developer-portfolio/current)
WEB=$(readlink -f /opt/developer-portfolio/frontend-current)
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/api" "$STAGE/web"
tar -xzf /tmp/portfolio-api.tgz -C "$STAGE/api"
tar -xzf /tmp/portfolio-web.tgz -C "$STAGE/web"
test -f "$STAGE/api/Portfolio.Api.dll"
test -f "$STAGE/web/index.html"

STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p /home/horatiu/deploy-backups
tar -czf "/home/horatiu/deploy-backups/${STAMP}-api-previous.tgz" -C "$API" .
tar -czf "/home/horatiu/deploy-backups/${STAMP}-frontend-previous.tgz" -C "$WEB" .

find "$API" -mindepth 1 -delete
find "$WEB" -mindepth 1 -delete
tar -C "$STAGE/api" -cf - . | tar -C "$API" -xf -
tar -C "$STAGE/web" -cf - . | tar -C "$WEB" -xf -
rm -f /tmp/portfolio-api.tgz /tmp/portfolio-web.tgz /tmp/publish-remote.sh

PID=$(ps -eo pid,args | awk '/Portfolio[.]Api[.]dll/ && !/awk/ {print $1; exit}')
if [ -n "${PID}" ]; then
  kill -KILL "$PID"
fi

ok=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
  sleep 2
  if curl -fsS http://127.0.0.1:5000/health; then
    echo
    ok=1
    break
  fi
done

test "$ok" = 1
echo "PUBLISH_OK ${STAMP}"
