#!/usr/bin/env bash
# Sync local docs/wiki/ markdown files to the GitHub Wiki repository
set -e

REPO_URL="https://github.com/SWAGAT10241/documorph.wiki.git"
TEMP_DIR="/tmp/documorph-wiki-sync"

echo "🚀 Preparing DocuMorph Wiki Sync..."

rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Check if GitHub wiki is initialized
if ! git ls-remote "$REPO_URL" &> /dev/null; then
  echo "⚠️ GitHub Wiki is not initialized yet on GitHub."
  echo "👉 Please visit https://github.com/SWAGAT10241/documorph/wiki in your browser and click 'Create the first page' once."
  echo "After doing that, run this script again: ./scripts/sync-wiki.sh"
  exit 1
fi

echo "📥 Cloning GitHub Wiki repository..."
git clone "$REPO_URL" "$TEMP_DIR"

echo "📄 Copying documentation chapters from docs/wiki/..."
cp -r docs/wiki/* "$TEMP_DIR"/

cd "$TEMP_DIR"
git add .

if git diff-index --quiet HEAD --; then
  echo "✅ GitHub Wiki is already up to date with docs/wiki/."
else
  git commit -m "docs(wiki): synchronize latest knowledge base chapters from main repository"
  echo "📤 Pushing updates to GitHub Wiki..."
  git push origin master || git push origin main
  echo "🎉 Wiki synchronization complete! Visit https://github.com/SWAGAT10241/documorph/wiki"
fi
