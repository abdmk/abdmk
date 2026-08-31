#!/bin/bash
# Generate secure secrets for Netlify deployment

echo "🔐 Generating secure secrets for .env..."
echo ""

# Generate ADMIN_SECRET (32 bytes base64)
ADMIN_SECRET=$(openssl rand -base64 32)

echo ".env.production:"
echo "ADMIN_PASSWORD=<choose-a-strong-password>"
echo "ADMIN_SECRET=$ADMIN_SECRET"
echo ""
echo "⚠️  Netlify Environment Variables (Site Settings → Environment):"
echo "ADMIN_PASSWORD=<choose-a-strong-password>"
echo "ADMIN_SECRET=$ADMIN_SECRET"
echo ""
echo "✅ Copy the values above to:"
echo "1. Your .env.production file (for local builds)"
echo "2. Netlify Site Settings → Environment (via dashboard)"
