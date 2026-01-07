#!/bin/bash

# Charis Dashboard - GitHub Push Script
# This script helps you push the dashboard to GitHub

echo "🚀 Charis Foundation Dashboard - GitHub Push"
echo "=============================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed"
    echo "Please install Git: https://git-scm.com/downloads"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    echo "Please run this script from the dashboard-app directory"
    exit 1
fi

# Check remote configuration
echo "📡 Checking remote repository..."
REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [ -z "$REMOTE_URL" ]; then
    echo "❌ No remote repository configured"
    echo "Setting up remote: https://github.com/nate-peregoy/Charis-Dashboard.git"
    git remote add origin https://github.com/nate-peregoy/Charis-Dashboard.git
else
    echo "✅ Remote configured: $REMOTE_URL"
fi

echo ""
echo "📊 Current status:"
git status --short

echo ""
echo "📝 Commit history:"
git log --oneline -5

echo ""
echo "🔄 Ready to push to GitHub!"
echo ""
echo "Choose your authentication method:"
echo "1) GitHub Personal Access Token (recommended)"
echo "2) SSH Key"
echo "3) GitHub CLI (gh)"
echo "4) Cancel"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📖 Using Personal Access Token:"
        echo "1. Go to: https://github.com/settings/tokens"
        echo "2. Generate new token (classic)"
        echo "3. Select 'repo' scope"
        echo "4. Use the token as your password when prompted"
        echo ""
        read -p "Press Enter to continue with push..."
        git push -u origin main
        ;;
    2)
        echo ""
        echo "🔑 Using SSH Key..."
        git remote set-url origin git@github.com:nate-peregoy/Charis-Dashboard.git
        git push -u origin main
        ;;
    3)
        echo ""
        echo "🖥️ Using GitHub CLI..."
        if ! command -v gh &> /dev/null; then
            echo "❌ GitHub CLI not installed"
            echo "Install from: https://cli.github.com"
            exit 1
        fi
        gh auth status || gh auth login
        git push -u origin main
        ;;
    4)
        echo "❌ Push cancelled"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Check if push was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 View your repository:"
    echo "   https://github.com/nate-peregoy/Charis-Dashboard"
    echo ""
    echo "🎉 Your Charis Foundation Dashboard is now on GitHub!"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   - Incorrect credentials"
    echo "   - No write access to repository"
    echo "   - Repository doesn't exist"
    echo ""
    echo "📚 See GITHUB_PUSH_INSTRUCTIONS.md for detailed help"
fi
