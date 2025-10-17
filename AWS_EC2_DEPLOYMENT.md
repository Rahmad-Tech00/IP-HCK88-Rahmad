# 🚀 AWS EC2 Deployment Guide - Book Tracker

## ⚠️ Masalah Saat Ini

**Error:** `3.104.54.173 refused to connect`

**Root Cause:**
1. ❌ Server listen di `127.0.0.1` (localhost only) - harus `0.0.0.0`
2. ❌ Port 4000 belum dibuka di Security Group AWS
3. ❌ Server mungkin belum running di EC2
4. ❌ CORS belum dikonfigurasi untuk production

---

## 🔧 STEP 1: Fix Server Configuration (PENTING!)

### 1.1 Edit `server/server.js`

**Before:**
```javascript
const HOST = '127.0.0.1'; // ❌ Localhost only
```

**After:**
```javascript
const HOST = process.env.HOST || '0.0.0.0'; // ✅ Accessible dari internet
```

**Full file should be:**
```javascript
require('dotenv').config();
const app = require('./app');

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`⚡ Server listening on http://${HOST}:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

### 1.2 Edit `server/app.js` - Fix CORS

**Before:**
```javascript
app.use(cors({ origin: '*', credentials: true }));
```

**After:**
```javascript
// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://book-tracker-rahmad.web.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🔐 STEP 2: AWS Security Group Configuration

### 2.1 Buka AWS Console
1. Go to **EC2 Dashboard**
2. Click **Instances** di sidebar
3. Select instance kamu (`3.104.54.173`)
4. Klik tab **Security**
5. Klik **Security Groups** link (contoh: `sg-xxxxxxxxx`)

### 2.2 Edit Inbound Rules

Klik **Edit inbound rules** dan tambahkan:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access |
| Custom TCP | TCP | 4000 | 0.0.0.0/0 | Node.js API |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP (optional) |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS (optional) |

**Yang WAJIB:**
```
Port 22 (SSH) - untuk akses SSH ke server
Port 4000 (API) - untuk aplikasi Node.js
```

### 2.3 Save Rules

Klik **Save rules**

---

## 📦 STEP 3: Setup di EC2 Instance

### 3.1 SSH ke EC2

```bash
ssh -i "your-key.pem" ubuntu@3.104.54.173
```

atau jika user ec2-user:
```bash
ssh -i "your-key.pem" ec2-user@3.104.54.173
```

**Jika permission error:**
```bash
chmod 400 your-key.pem
```

### 3.2 Install Dependencies (First Time Only)

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Setup PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE booktracker;"
sudo -u postgres psql -c "CREATE USER booktracker_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE booktracker TO booktracker_user;"
```

### 3.3 Clone Repository

```bash
# Clone your repo
git clone https://github.com/Rahmad-Tech00/IP-HCK88-Rahmad.git
cd IP-HCK88-Rahmad/server

# Install dependencies
npm install
```

### 3.4 Create .env File

```bash
nano .env
```

Isi dengan:
```env
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

# Database
DB_USERNAME=booktracker_user
DB_PASSWORD=your_password
DB_NAME=booktracker
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# Client URL (deployed Firebase)
CLIENT_URL=https://book-tracker-rahmad.web.app

# JWT Secret
JWT_SECRET=rahmad-booktracker-super-secret-key-minimum-32-chars-2025

# APIs
GOOGLE_CLIENT_ID=1068759642351-70bqtlm9pn51qok807sq7s4ilaa0qmlg.apps.googleusercontent.com
GEMINI_API_KEY=AIzaSyDms_sRT2yOi_dMEjFwtSIx6RUYDZay2OE
```

Save: `Ctrl+X` → `Y` → `Enter`

### 3.5 Run Database Migrations

```bash
# Install Sequelize CLI globally
sudo npm install -g sequelize-cli

# Run migrations
npx sequelize-cli db:migrate

# Run seeds
npx sequelize-cli db:seed:all
```

### 3.6 Test Server Locally

```bash
npm start
```

**Expected output:**
```
⚡ Server listening on http://0.0.0.0:4000
📦 Environment: production
```

**Test dari EC2:**
```bash
curl http://localhost:4000/
# Expected: {"message":"Book Tracker API OK"}
```

Jika OK, stop dengan `Ctrl+C`

---

## 🚀 STEP 4: Deploy dengan PM2

### 4.1 Start dengan PM2

```bash
cd ~/IP-HCK88-Rahmad/server

# Start server
pm2 start server.js --name booktracker-api

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command output
```

### 4.2 Check Status

```bash
pm2 status
pm2 logs booktracker-api
```

### 4.3 Useful PM2 Commands

```bash
pm2 restart booktracker-api   # Restart
pm2 stop booktracker-api      # Stop
pm2 delete booktracker-api    # Remove
pm2 logs booktracker-api      # View logs
pm2 monit                     # Monitor
```

---

## 🧪 STEP 5: Test dari Luar

### 5.1 Test Server dari Local Machine

```bash
# Test health check
curl http://3.104.54.173:4000/
# Expected: {"message":"Book Tracker API OK"}

# Test books endpoint
curl http://3.104.54.173:4000/apis/books
# Expected: {"data":[...]}
```

### 5.2 Test dari Browser

Buka: `http://3.104.54.173:4000/`

Should see: `{"message":"Book Tracker API OK"}`

---

## 🌐 STEP 6: Update Client Configuration

### 6.1 Update Client Environment

Edit `client/.env.production`:

```env
VITE_API_BASE=http://3.104.54.173:4000/apis
VITE_GOOGLE_CLIENT_ID=1068759642351-70bqtlm9pn51qok807sq7s4ilaa0qmlg.apps.googleusercontent.com
VITE_GEMINI_API_KEY=AIzaSyDms_sRT2yOi_dMEjFwtSIx6RUYDZay2OE
```

### 6.2 Rebuild & Redeploy Client

```bash
cd client
npm run build
firebase deploy
```

---

## 🔒 STEP 7: Setup HTTPS (Optional but Recommended)

### 7.1 Install Nginx

```bash
sudo apt install -y nginx
```

### 7.2 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/booktracker
```

Paste:
```nginx
server {
    listen 80;
    server_name 3.104.54.173;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.3 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/booktracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7.4 Install SSL Certificate (if you have domain)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📋 Troubleshooting Checklist

### ✅ Server Configuration
- [ ] `server.js` menggunakan `0.0.0.0` (bukan `127.0.0.1`)
- [ ] `.env` file sudah dibuat di EC2
- [ ] Database credentials benar
- [ ] Port 4000 di `.env`

### ✅ AWS Security Group
- [ ] Port 22 (SSH) terbuka
- [ ] Port 4000 (API) terbuka untuk `0.0.0.0/0`
- [ ] Port 80 (HTTP) terbuka (optional)
- [ ] Inbound rules sudah di-save

### ✅ EC2 Instance
- [ ] Node.js terinstall (`node -v`)
- [ ] PostgreSQL running (`sudo systemctl status postgresql`)
- [ ] Database created dan migrated
- [ ] PM2 running (`pm2 status`)
- [ ] Server accessible dari localhost (`curl localhost:4000`)

### ✅ Network
- [ ] Server accessible dari luar (`curl http://3.104.54.173:4000`)
- [ ] CORS configured untuk client URL
- [ ] Client `.env.production` updated dengan EC2 IP

---

## 🐛 Common Issues & Solutions

### Issue 1: Connection Refused
**Problem:** Can't connect to `3.104.54.173:4000`

**Solutions:**
1. Check Security Group port 4000 is open
2. Check server is running: `pm2 status`
3. Check server listening on 0.0.0.0: `netstat -tlnp | grep 4000`
4. Check firewall: `sudo ufw status` (should be inactive or allow 4000)

### Issue 2: Server Not Starting
**Problem:** PM2 shows error or stopped

**Solutions:**
```bash
pm2 logs booktracker-api  # Check error logs
pm2 delete booktracker-api
pm2 start server.js --name booktracker-api
```

### Issue 3: Database Connection Error
**Problem:** Can't connect to PostgreSQL

**Solutions:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
sudo -u postgres psql -l | grep booktracker

# Test connection
psql -U booktracker_user -d booktracker -h localhost
```

### Issue 4: CORS Error from Client
**Problem:** Client can't make requests

**Solutions:**
1. Check `CLIENT_URL` in server `.env`
2. Restart PM2: `pm2 restart booktracker-api`
3. Check CORS in `app.js` includes client URL

### Issue 5: Port Already in Use
**Problem:** Port 4000 already in use

**Solutions:**
```bash
# Find process using port
sudo lsof -i :4000

# Kill process
sudo kill -9 <PID>

# Or change PORT in .env to 3000 or 5000
```

---

## 🎯 Quick Commands Reference

### SSH to EC2
```bash
ssh -i "your-key.pem" ubuntu@3.104.54.173
```

### Check Server Status
```bash
pm2 status
pm2 logs
curl http://localhost:4000
```

### Restart Server
```bash
cd ~/IP-HCK88-Rahmad/server
git pull
npm install
pm2 restart booktracker-api
```

### View Logs
```bash
pm2 logs booktracker-api
pm2 logs booktracker-api --lines 100
```

### Database Operations
```bash
cd ~/IP-HCK88-Rahmad/server
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## 📊 Monitoring

### Check Resource Usage
```bash
pm2 monit
htop  # Install: sudo apt install htop
```

### Check Logs
```bash
pm2 logs booktracker-api --lines 50
tail -f ~/.pm2/logs/booktracker-api-out.log
tail -f ~/.pm2/logs/booktracker-api-error.log
```

### Check Disk Space
```bash
df -h
du -sh ~/IP-HCK88-Rahmad
```

---

## 🔄 Update Deployment

When you make code changes:

```bash
# SSH to EC2
ssh -i "your-key.pem" ubuntu@3.104.54.173

# Pull latest code
cd ~/IP-HCK88-Rahmad
git pull

# Install dependencies (if package.json changed)
cd server
npm install

# Run migrations (if models changed)
npx sequelize-cli db:migrate

# Restart server
pm2 restart booktracker-api

# Check logs
pm2 logs booktracker-api
```

---

## ✅ Final Checklist

Before testing:
- [ ] Security Group port 4000 opened
- [ ] Server using `0.0.0.0` not `127.0.0.1`
- [ ] `.env` file created on EC2
- [ ] Database migrated and seeded
- [ ] PM2 running server
- [ ] Server responds to `curl http://localhost:4000` from EC2
- [ ] Server responds to `curl http://3.104.54.173:4000` from local
- [ ] Client `.env.production` has correct EC2 URL
- [ ] Client redeployed with new environment

---

## 🎉 Success Criteria

✅ `curl http://3.104.54.173:4000/` returns `{"message":"Book Tracker API OK"}`
✅ `curl http://3.104.54.173:4000/apis/books` returns book data
✅ PM2 shows green status
✅ Client can login/register successfully
✅ No CORS errors in browser console

---

## 📞 Need Help?

1. Check logs: `pm2 logs booktracker-api`
2. Check server status: `pm2 status`
3. Test locally on EC2: `curl http://localhost:4000`
4. Check Security Group rules
5. Verify `.env` file contents

---

**Last Updated:** October 17, 2025
**EC2 IP:** 3.104.54.173
**Client URL:** https://book-tracker-rahmad.web.app
