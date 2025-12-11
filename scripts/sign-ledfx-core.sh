#!/bin/bash

set -e

IDENTITY="${CODESIGN_IDENTITY:-CEE631E9774D506963ECC20D6BFA8213FB07B2B1}"
APP_PATH="extraResources/LedFx.app"

echo "🔐 Signing LedFx Core with identity: $IDENTITY"

# Remove any existing signatures first
echo "📝 Removing existing signatures..."
codesign --remove-signature "$APP_PATH" 2>/dev/null || true

# Sign all .so and .dylib files first (inside-out approach)
echo "📝 Signing native libraries..."
find "$APP_PATH" -type f \( -name "*.so" -o -name "*.dylib" \) -print0 | while IFS= read -r -d '' file; do
    echo "   Signing: $(basename "$file")"
    codesign --sign "$IDENTITY" \
        --force \
        --timestamp \
        --options runtime \
        "$file" 2>&1 | grep -v "replacing existing signature" || true
done

# Sign executables
echo "📝 Signing executables..."
find "$APP_PATH/Contents/MacOS" -type f -perm +111 -print0 2>/dev/null | while IFS= read -r -d '' file; do
    echo "   Signing: $(basename "$file")"
    codesign --sign "$IDENTITY" \
        --force \
        --timestamp \
        --options runtime \
        "$file" 2>&1 | grep -v "replacing existing signature" || true
done

# Finally sign the app bundle itself
echo "📝 Signing app bundle..."
codesign --sign "$IDENTITY" \
    --force \
    --timestamp \
    --options runtime \
    --entitlements entitlements.mac.core.plist \
    "$APP_PATH"

# Verify the signature
echo "✅ Verifying signature..."
codesign --verify --deep --strict --verbose=2 "$APP_PATH"

echo "✅ LedFx Core signed successfully!"
