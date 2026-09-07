#!/usr/bin/env bash
# ==============================================================================
# HealthTrack — AWS EC2 One-Click Automated Deployment Script
# ==============================================================================
set -e

echo "=========================================="
echo "🏥 Starting HealthTrack AWS EC2 Deployment"
echo "=========================================="

# 1. Update system packages
echo "📦 Updating apt packages..."
sudo apt-get update -y
sudo apt-get install -y curl git build-essential

# 2. Install Node.js 20.x if not already installed
if ! command -v node &> /dev/null; then
    echo "⚙️ Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "✅ Node version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# 3. Install PM2 process manager globally
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2 process manager..."
    sudo npm install -g pm2
fi

# 4. Install all dependencies and build frontend
echo "🔨 Installing dependencies and building frontend..."
npm run build

# 5. Allow node to bind to port 80 without root
sudo setcap 'cap_net_bind_service=+ep' `which node` || true

# 6. Stop previous instance if running
pm2 stop healthtrack 2>/dev/null || true
pm2 delete healthtrack 2>/dev/null || true

# 7. Start the unified server on Port 80
echo "🚀 Starting HealthTrack server on Port 80 via PM2..."
PORT=80 NODE_ENV=production pm2 start server/server.js --name "healthtrack"

# 8. Save PM2 startup script to survive server reboots
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME || true

echo "=================================================================="
echo "🎉 HealthTrack is now LIVE and running 24/7 on Port 80!"
echo "📍 Access your app in your browser at: http://$(curl -s http://checkip.amazonaws.com)"
echo "=================================================================="
