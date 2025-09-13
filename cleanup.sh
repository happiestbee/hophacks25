#!/bin/bash

# FHA Recovery App - Cleanup Script
# This script removes unnecessary files to reduce project size

echo "🧹 Cleaning up FHA Recovery App..."

# Remove build artifacts
echo "Removing build artifacts..."
rm -rf fha-recovery-app/.next
rm -rf fha-recovery-app/out
rm -rf fha-recovery-app/build
rm -rf fha-recovery-app/dist

# Remove OS files
echo "Removing OS files..."
find . -name ".DS_Store" -delete
find . -name "Thumbs.db" -delete
find . -name "*.tmp" -delete
find . -name "*.temp" -delete

# Remove logs
echo "Removing log files..."
find . -name "*.log" -delete
rm -f frontend.log backend.log

# Remove node_modules if requested
if [ "$1" = "--full" ]; then
    echo "Removing node_modules (use 'npm run install:all' to reinstall)..."
    rm -rf fha-recovery-app/node_modules
    rm -rf node_modules
fi

# Show current size
echo ""
echo "📊 Current project size:"
du -sh . | head -1
echo ""
echo "📁 Directory sizes:"
du -sh * | sort -hr

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "To reinstall dependencies:"
echo "  npm run install:all"
echo ""
echo "To start development:"
echo "  npm run dev"
