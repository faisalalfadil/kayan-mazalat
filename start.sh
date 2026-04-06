#!/bin/bash
cd /home/z/my-project
while true; do
  npx next dev --port 3000 -H 0.0.0.0
  echo "Server crashed, restarting in 3s..."
  sleep 3
done
