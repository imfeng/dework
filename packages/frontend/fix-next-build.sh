#!/bin/bash

echo "Fixing build issues for Next.js..."

# 1. Fix duplicate React imports more aggressively
find src -name "*.tsx" | while read file; do
  # Count how many React imports are in the file
  react_imports=$(grep -c "import React" "$file")
  
  if [ "$react_imports" -gt 1 ]; then
    echo "Fixing multiple React imports in $file"
    
    # Create a temp file
    tmp_file=$(mktemp)
    
    # Keep only the first React import, replace duplicate ones
    awk '
      BEGIN { count=0 }
      /^import React/ {
        if (count == 0) {
          # Keep the first one with all needed imports
          if ($0 ~ /import React, /) {
            print $0
          } else {
            print "import React from '\''react'\'';";
          }
          count++
        }
        next
      }
      { print }
    ' "$file" > "$tmp_file"
    
    # Replace the original file
    mv "$tmp_file" "$file"
  fi
done

# 2. Fix react-router-dom imports for Next.js
find src -name "*.tsx" | xargs grep -l "react-router-dom" | while read file; do
  echo "Fixing react-router-dom in $file"
  
  # Replace react-router-dom imports with Next.js equivalents
  sed -i '' 's/import { Link } from "react-router-dom";/import Link from "next\/link";/' "$file"
  sed -i '' "s/import { Link } from 'react-router-dom';/import Link from 'next\/link';/" "$file"
  
  # Replace useNavigate with Next.js useRouter
  sed -i '' 's/import { useNavigate } from "react-router-dom";/import { useRouter } from "next\/router";/' "$file"
  sed -i '' "s/import { useNavigate } from 'react-router-dom';/import { useRouter } from 'next\/router';/" "$file"
  
  # Replace navigate function calls
  sed -i '' 's/const navigate = useNavigate();/const router = useRouter();/' "$file"
  sed -i '' 's/navigate\(.*\);/router.push\1;/' "$file"
  
  # Fix Link usage to match Next.js API
  sed -i '' 's/<Link to=/<Link href=/' "$file"
  sed -i '' 's/<Link className="\(.*\)" to=/<Link href=/' "$file"
  sed -i '' 's/<\/Link>/<\/Link>/' "$file"
done

# 3. Fix import paths to use aliases
find src -name "*.tsx" | grep -v "pages/_" | while read file; do
  echo "Fixing import paths in $file"
  
  # Fix relative hooks imports
  sed -i '' 's/from "\.\.\(\/.*\)hooks/from "@\/hooks/' "$file"
  sed -i '' "s/from '\.\.\(\/.*\)hooks/from '@\/hooks/" "$file"
  
  # Fix relative utils imports
  sed -i '' 's/from "\.\.\(\/.*\)utils/from "@\/utils/' "$file"
  sed -i '' "s/from '\.\.\(\/.*\)utils/from '@\/utils/" "$file"
  
  # Fix relative components imports
  sed -i '' 's/from "\.\.\(\/.*\)components/from "@\/components/' "$file"
  sed -i '' "s/from '\.\.\(\/.*\)components/from '@\/components/" "$file"
  
  # Fix relative contexts imports
  sed -i '' 's/from "\.\.\(\/.*\)contexts/from "@\/contexts/' "$file"
  sed -i '' "s/from '\.\.\(\/.*\)contexts/from '@\/contexts/" "$file"
done

# 4. Create a temporary mock for @worldcoin/id
mkdir -p src/types
cat > src/types/worldcoin.d.ts << EOF
declare module '@worldcoin/id' {
  export interface WorldIDWidgetProps {
    actionId: string;
    signal?: string;
    enableTelemetry?: boolean;
    onSuccess: (verificationResponse: any) => void;
    onError?: (error: Error) => void;
    onInitSuccess?: () => void;
    debug?: boolean;
  }

  export function WorldIDWidget(props: WorldIDWidgetProps): JSX.Element;
}
EOF

echo "Fixes complete! Try running 'npm run build' again." 