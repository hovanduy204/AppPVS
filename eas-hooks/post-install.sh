#!/usr/bin/env bash

# EAS Build Hook to update Android Gradle Plugin version
# This ensures AGP 8.6.0+ is used for Expo SDK 51

set -euo pipefail

echo "=== EAS Build Hook: Updating AGP Version ==="

# Find build.gradle file - check multiple locations
BUILD_GRADLE=""
SEARCH_PATHS=(
  "android/build.gradle"
  "build/android/build.gradle"
  "/home/expo/workingdir/build/android/build.gradle"
)

# Also search in current directory and subdirectories
CURRENT_DIR=$(pwd)
echo "Current directory: $CURRENT_DIR"

# Search recursively for build.gradle in android directories
if [ -d "android" ]; then
  if [ -f "android/build.gradle" ]; then
    BUILD_GRADLE="android/build.gradle"
  fi
elif [ -d "build/android" ]; then
  if [ -f "build/android/build.gradle" ]; then
    BUILD_GRADLE="build/android/build.gradle"
  fi
fi

# If still not found, try to find any build.gradle in android subdirectories
if [ -z "$BUILD_GRADLE" ]; then
  FOUND=$(find . -path "*/android/build.gradle" -type f 2>/dev/null | head -1)
  if [ -n "$FOUND" ]; then
    BUILD_GRADLE="$FOUND"
  fi
fi

# Also check EAS build working directory
if [ -z "$BUILD_GRADLE" ] && [ -d "/home/expo/workingdir/build/android" ]; then
  if [ -f "/home/expo/workingdir/build/android/build.gradle" ]; then
    BUILD_GRADLE="/home/expo/workingdir/build/android/build.gradle"
    echo "Found build.gradle in EAS working directory"
  fi
fi

if [ -n "$BUILD_GRADLE" ]; then
  echo "Found build.gradle at: $BUILD_GRADLE"
  
  # Check current AGP version
  if grep -q "com.android.tools.build:gradle:" "$BUILD_GRADLE"; then
    CURRENT_VERSION=$(grep -oP 'com\.android\.tools\.build:gradle:\K[0-9.]+' "$BUILD_GRADLE" | head -1)
    echo "Current AGP version: $CURRENT_VERSION"
    
    # Extract version parts
    MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1)
    MINOR=$(echo "$CURRENT_VERSION" | cut -d. -f2)
    
    # Check if version is less than 8.6.0
    NEEDS_UPDATE=false
    if [ "$MAJOR" -lt 8 ] || ([ "$MAJOR" -eq 8 ] && [ "${MINOR:-0}" -lt 6 ]); then
      NEEDS_UPDATE=true
    fi
    
    if [ "$NEEDS_UPDATE" = true ]; then
      echo "Updating AGP version from $CURRENT_VERSION to 8.6.0..."
      sed -i.bak 's/com\.android\.tools\.build:gradle:[0-9.]*/com.android.tools.build:gradle:8.6.0/g' "$BUILD_GRADLE"
      echo "✓ Successfully updated AGP version to 8.6.0"
    else
      echo "✓ AGP version is already 8.6.0 or higher"
    fi
  else
    echo "WARNING: Could not find AGP version in $BUILD_GRADLE"
  fi
else
  echo "WARNING: build.gradle not found. Searched in:"
  echo "  - android/build.gradle"
  echo "  - build/android/build.gradle"
fi

echo "=== End AGP Version Update ==="

