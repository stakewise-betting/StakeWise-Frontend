#!/bin/bash
# Copy index.html to handle all routes
cd dist
for route in news upcoming results politics sports dashboard profile leaderboard watchlist; do
  mkdir -p $route
  cp index.html $route/
done
