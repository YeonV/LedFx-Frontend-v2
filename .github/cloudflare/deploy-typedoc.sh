
#!/bin/bash

ls -la

# Define the file pattern to check (for docs.ledfx.stream)
FILE_PATTERN="./src/api/* ./package.json"

# Check if files matching the pattern have changed
if git diff --quiet HEAD~1 HEAD -- $FILE_PATTERN; then
  echo "No relevant typedocs.ledfx.stream documentation file changes detected. Skipping build."
  exit 0
else
  echo "Relevant typedocs.ledfx.stream documentation file changes detected. Proceeding with build."
  yarn build-typedoc
fi