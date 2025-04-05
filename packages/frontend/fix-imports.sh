#!/bin/bash

# Find files with duplicate React imports and fix them
find src -name "*.tsx" | xargs grep -l "import React from 'react';" | while read file; do
  echo "Checking $file for duplicate imports..."
  
  # Check if file has both import statements
  if grep -q "import React, " "$file"; then
    echo "Fixing duplicate React imports in $file"
    
    # Remove the simple import line
    sed -i '' '/import React from '"'"'react'"'"';/d' "$file"
  fi
done

# Fix incorrect type annotations on functions
find src -name "*.tsx" | xargs grep -l "const .* React.FC = (e) =>" | while read file; do
  echo "Fixing incorrect function type annotations in $file"
  
  # Replace React.FC on functions with proper types
  sed -i '' 's/const \(.*\): React\.FC = (e) =>/const \1 = (e: any) =>/' "$file"
  sed -i '' 's/const \(.*\): React\.FC = () =>/const \1 = () =>/' "$file"
done

echo "Fixes complete!" 