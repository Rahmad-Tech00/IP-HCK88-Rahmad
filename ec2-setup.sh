#!/bin/bash
# EC2 Setup Script for Book Tracker

echo "🚀 Starting EC2 Setup..."
echo "========================"

# Step 1: Navigate to project
echo ""
echo "📁 Step 1: Navigating to project..."
cd ~/IP-HCK88-Rahmad || { echo "❌ Project folder not found. Cloning..."; git clone https://github.com/Rahmad-Tech00/IP-HCK88-Rahmad.git && cd IP-HCK88-Rahmad; }

# Step 2: Pull latest code
echo ""
echo "📥 Step 2: Pulling latest code..."
git pull origin dev

# Step 3: Install dependencies
echo ""
echo "📦 Step 3: Installing dependencies..."
cd server
npm install

# Step 4: Check if .env exists
echo ""
echo "⚙️  Step 4: Checking .env file..."
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

DB_USERNAME=booktracker_user
DB_PASSWORD=CHANGE_THIS_PASSWORD
DB_NAME=booktracker
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

CLIENT_URL=https://book-tracker-rahmad.web.app

JWT_SECRET=rahmad-booktracker-super-secret-key-minimum-32-chars-2025

GOOGLE_CLIENT_ID=1068759642351-70bqtlm9pn51qok807sq7s4ilaa0qmlg.apps.googleusercontent.com
GEMINI_API_KEY=AIzaSyDms_sRT2yOi_dMEjFwtSIx6RUYDZay2OE
EOF
    echo "✅ .env file created"
    echo "⚠️  IMPORTANT: Edit .env and change DB_PASSWORD!"
    echo "   Run: nano .env"
else
    echo "✅ .env file already exists"
fi

# Step 5: Run migrations
echo ""
echo "🗄️  Step 5: Running database migrations..."
npx sequelize-cli db:migrate

# Step 6: Run seeds
echo ""
echo "🌱 Step 6: Seeding database..."
npx sequelize-cli db:seed:all

# Step 7: Check if PM2 is installed
echo ""
echo "🔧 Step 7: Checking PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    sudo npm install -g pm2
fi

# Step 8: Start/Restart server
echo ""
echo "🚀 Step 8: Starting server with PM2..."
pm2 describe booktracker-api > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "♻️  Restarting existing server..."
    pm2 restart booktracker-api
else
    echo "▶️  Starting new server..."
    pm2 start server.js --name booktracker-api
fi

# Step 9: Save PM2 configuration
echo ""
echo "💾 Step 9: Saving PM2 configuration..."
pm2 save

# Step 10: Setup PM2 startup
echo ""
echo "⚡ Step 10: Setting up PM2 startup..."
pm2 startup | grep "sudo" | bash

# Step 11: Show status
echo ""
echo "✅ Setup Complete!"
echo "========================"
echo ""
pm2 status
echo ""
echo "📊 Server Logs (last 20 lines):"
echo "========================"
pm2 logs booktracker-api --lines 20 --nostream

echo ""
echo "🧪 Testing server..."
echo "========================"
sleep 2
curl http://localhost:4000/ || echo "❌ Server not responding yet"

echo ""
echo "✅ All Done!"
echo "========================"
echo ""
echo "Next steps:"
echo "1. If DB_PASSWORD needs changing: nano .env"
echo "2. View logs: pm2 logs booktracker-api"
echo "3. Check status: pm2 status"
echo "4. Test API: curl http://localhost:4000/"
echo ""
