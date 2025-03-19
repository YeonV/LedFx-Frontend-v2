
#!/bin/bash

ls -la
cd ../../ # Navigate to the root directory

# Define the file pattern to check (for ledfx.stream)
FILE_PATTERN="!./storybook/* !./src/stories/* !**/*.stories.tsx !./.github/workflows/* !./.vscode/* !./README.md ./* **/*"

# Check if files matching the pattern have changed
if git diff --quiet HEAD~1 HEAD -- $FILE_PATTERN; then
  echo "No relevant ledfx.stream app file changes detected. Skipping build."
  exit 0
else
  echo "Relevant ledfx.stream app file changes detected. Proceeding with build."
  yarn buildcloudflare
fi