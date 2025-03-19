
#!/bin/bash

cd ../../ # Navigate to the root directory
cd "$(git rev-parse --show-toplevel)"
cd root
ls -la
# Define the file pattern to check (for docs.ledfx.stream)
FILE_PATTERN="./storybook/* ./src/stories/* **/*.stories.tsx"

# Check if files matching the pattern have changed
if git diff --quiet HEAD~1 HEAD -- $FILE_PATTERN; then
  echo "No relevant docs.ledfx.stream documentation file changes detected. Skipping build."
  exit 0
else
  echo "Relevant docs.ledfx.stream documentation file changes detected. Proceeding with build."
  yarn build-storybook
fi