#!/bin/bash
# MATCH ATS - Setup Script
# This script sets up the development environment

set -e

echo "🚀 MATCH ATS - Setup"
echo "===================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

# Setup environment
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your credentials"
fi

# Setup Husky
echo ""
echo "🐶 Setting up Husky..."
npm run prepare

# Run type check
echo ""
echo "🔍 Running type check..."
npm run type-check

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env.local with your credentials"
echo "  2. Run 'npm run dev' to start development"
echo "  3. Run 'npm run storybook' to view components"
