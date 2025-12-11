#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  echo "📁 Loading environment from .env file..."
  export $(grep -v '^#' .env | xargs)
  echo "✅ Environment loaded"
else
  echo "⚠️  No .env file found in current directory"
fi

# Check signing environment
echo ""
echo "Running environment check..."
node scripts/check-signing-env.cjs || exit 1

# Sign the LedFx core app
echo ""
echo "Signing LedFx core app..."
bash scripts/sign-ledfx-core.sh || exit 1

# Update package.json homepage
echo ""
echo "Updating package.json..."
node -e "let pkg=require('./package.json'); pkg.homepage='.'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

echo ""
echo "✅ Pre-build steps completed successfully"
