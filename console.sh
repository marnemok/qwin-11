#!/bin/bash

# Git Console Script
# This script helps manage git commands for the qwin-11 repository

set -e

REPO_URL="https://github.com/marnemok/qwin-11.git"
ORIGIN_NAME="origin"

echo "========================================="
echo "Git Console - qwin-11 Repository"
echo "========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "⚠️  Not a git repository. Initializing..."
    git init
fi

# Add remote origin
echo "📝 Adding remote origin..."
if git remote | grep -q "^$ORIGIN_NAME$"; then
    echo "⚠️  Remote 'origin' already exists. Updating..."
    git remote set-url "$ORIGIN_NAME" "$REPO_URL"
else
    echo "➕ Creating new remote 'origin'..."
    git remote add "$ORIGIN_NAME" "$REPO_URL"
fi

echo "✅ Remote added/updated successfully!"
echo ""
echo "Remote details:"
git remote -v
echo ""
echo "========================================="
echo "Ready to use! You can now:"
echo "  • git push -u origin main"
echo "  • git pull origin main"
echo "  • git fetch origin"
echo "========================================="
