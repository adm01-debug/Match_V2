#!/bin/bash
# MATCH ATS - Deploy Script
# This script deploys the application

set -e

echo "🚀 MATCH ATS - Deploy"
echo "===================="

# Check environment
ENV=${1:-production}
echo "📦 Environment: $ENV"

# Build
echo ""
echo "🏗️  Building..."
npm run build

# Run tests
echo ""
echo "🧪 Running tests..."
npm run test:ci

# Type check
echo ""
echo "🔍 Type checking..."
npm run type-check

# Deploy based on environment
echo ""
echo "🚀 Deploying to $ENV..."

if [ "$ENV" == "production" ]; then
    echo "Deploying to production..."
    # Add your production deploy command here
    # e.g., vercel --prod, netlify deploy --prod, etc.
elif [ "$ENV" == "staging" ]; then
    echo "Deploying to staging..."
    # Add your staging deploy command here
else
    echo "Deploying to preview..."
    # Add your preview deploy command here
fi

echo ""
echo "✅ Deploy complete!"
