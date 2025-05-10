#!/bin/bash

echo "🔄 Deploying to Firebase..."
firebase deploy

echo "📦 Committing to Git..."
git add .
git commit -m "Auto deploy $(date '+%Y-%m-%d %H:%M:%S')"
git push

echo "✅ Done!"
