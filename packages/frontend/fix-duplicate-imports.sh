#!/bin/bash

# Function to fix duplicate React imports in a file
fix_duplicate_imports() {
  local file=$1
  
  # Check if file has duplicate React imports
  if grep -q "^import React.*from \"react\"" "$file" && grep -q "^import React," "$file"; then
    echo "Fixing duplicate React imports in $file"
    
    # Create a temporary file
    tmp_file=$(mktemp)
    
    # Keep the one with more imports (React, { useState, useEffect, etc. })
    # Remove the simple 'import React from "react"'
    sed '/^import React from "react";$/d' "$file" > "$tmp_file"
    
    # Replace the file
    mv "$tmp_file" "$file"
  fi
}

# Find all TypeScript React files
echo "Scanning for files with duplicate React imports..."
find src -name "*.tsx" | while read file; do
  fix_duplicate_imports "$file"
done

echo "Import fixes complete!" 