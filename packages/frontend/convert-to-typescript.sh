#!/bin/bash

# Function to convert a JS file to TS
convert_js_to_ts() {
  local js_file=$1
  local ts_file=${js_file%.js}.ts
  
  # Create the typescript version of the file
  echo "// Converted from JavaScript to TypeScript
$(cat $js_file)" > $ts_file
  
  echo "Converted $js_file to $ts_file"
  
  # Remove the original JS file
  rm $js_file
}

# Function to convert a JSX file to TSX
convert_jsx_to_tsx() {
  local jsx_file=$1
  local tsx_file=${jsx_file%.jsx}.tsx
  
  # Create the typescript version of the file
  echo "import React from 'react';
$(cat $jsx_file | sed 's/const \([a-zA-Z0-9_]*\) = (/const \1: React.FC = (/g')" > $tsx_file
  
  echo "Converted $jsx_file to $tsx_file"
  
  # Remove the original JSX file
  rm $jsx_file
}

# Convert all JS files in the src directory
echo "Converting JS files to TS..."
find src -name "*.js" | while read file; do
  convert_js_to_ts "$file"
done

# Convert all JSX files in the src directory
echo "Converting JSX files to TSX..."
find src -name "*.jsx" | while read file; do
  convert_jsx_to_tsx "$file"
done

echo "Conversion complete!" 