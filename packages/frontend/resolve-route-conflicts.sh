#!/bin/bash

# Create backup directory for conflicting pages
mkdir -p src/pages-backup

# List of conflicting routes
CONFLICTING_ROUTES=(
  "connect.ts"
  "dashboard.ts"
  "landlord.ts"
  "marketplace.ts"
  "index.tsx"
  "tenant.ts"
)

# Move conflicting pages to backup directory
for route in "${CONFLICTING_ROUTES[@]}"; do
  if [ -f "src/pages/$route" ]; then
    mv "src/pages/$route" "src/pages-backup/"
    echo "Moved $route to pages-backup/"
  fi
done

echo "Route conflicts resolved! The original files have been backed up to src/pages-backup/"
echo "The application now uses the App Router implementation for these routes." 