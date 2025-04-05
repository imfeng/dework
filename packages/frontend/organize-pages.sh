#!/bin/bash

# Create directories for page components
mkdir -p src/components/pages

# Move capitalized component files to components/pages
for file in src/pages/*[A-Z]*.tsx; do
  if [[ "$(basename "$file")" != "_app.tsx" && "$(basename "$file")" != "_document.tsx" ]]; then
    # Skip files that are already properly named for Next.js
    cp "$file" "src/components/pages/$(basename "$file")"
    echo "Moved $(basename "$file") to components/pages/"
  fi
done

# Fix page imports for the lowercase route files
for file in src/pages/*.ts; do
  component=$(grep -o "import .* from '.*'" "$file" | cut -d "'" -f 2 | xargs basename)
  if [[ -n "$component" ]]; then
    # Update import path
    sed -i '' "s|import .* from '.*'|import $component from '@/components/pages/$component'|" "$file"
    echo "Updated import in $(basename "$file")"
  fi
done

echo "Page organization complete!" 