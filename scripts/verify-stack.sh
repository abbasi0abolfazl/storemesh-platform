#!/usr/bin/env bash

URLS=(
  "http://localhost:3000/health"
  "http://localhost:4000/health"
  "http://localhost:8080"
  "http://localhost:8081"
  "http://localhost:8082"
  "http://localhost:8443"
)

failed=0
for url in "${URLS[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "000")
  if [ "$status" = "200" ]; then
    echo "✅ [OK $status] $url"
  else
    echo "❌ [FAILED $status] $url"
    failed=1
  fi
done

if [ "$failed" -eq 1 ]; then
  exit 1
fi
echo "🎉 All services are verified healthy!"
