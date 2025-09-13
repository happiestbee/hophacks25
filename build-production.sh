#!/bin/bash

# FHA Recovery App - Production Build Script
# Creates a minimal production build without dev dependencies

echo "🏗️ Building FHA Recovery App for production..."

# Clean everything first
./cleanup.sh --full

# Install only production dependencies for frontend
echo "Installing production dependencies..."
cd fha-recovery-app
npm ci --only=production
cd ..

# Build the frontend
echo "Building frontend..."
cd fha-recovery-app
npm run build
cd ..

# Create production directory
echo "Creating production build..."
mkdir -p production-build
cp -r fha-recovery-app/.next production-build/
cp -r fha-recovery-app/public production-build/
cp -r fha-recovery-app/package.json production-build/
cp -r fha-recovery-app/next.config.ts production-build/
cp -r fha-recovery-app/tsconfig.json production-build/
cp -r fha-recovery-app/src production-build/

# Copy backend
cp -r fha-recovery-backend production-build/

# Copy startup scripts
cp package.json production-build/
cp start-dev.sh production-build/
cp start-dev-advanced.sh production-build/

# Show production build size
echo ""
echo "📊 Production build size:"
du -sh production-build

echo ""
echo "✅ Production build complete!"
echo "   Location: ./production-build"
echo "   Size: $(du -sh production-build | cut -f1)"
