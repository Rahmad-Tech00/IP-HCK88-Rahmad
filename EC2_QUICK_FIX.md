# 🚀 EC2 Quick Fix - Connection Refused

## ⚠️ Current Problem
```
3.104.54.173 refused to connect
ERR_CONNECTION_REFUSED
```

---

## ✅ SOLUTION - 3 Steps

### STEP 1: Open Port 4000 di AWS Security Group

1. **AWS Console** → **EC2** → **Security Groups**
2. Select security group instance kamu
3. **Edit inbound rules**
4. **Add rule:**
   - Type: `Custom TCP`
   - Port range: `4000`
   - Source: `0.0.0.0/0` (atau `Anywhere-IPv4`)
   - Description: `Node.js API`
5. **Save rules**

**Port yang harus terbuka:**
```
Port 22   (SSH)      - untuk SSH access
Port 4000 (API)      - untuk Node.js server ✅ PENTING!
Port 80   (HTTP)     - optional untuk Nginx
Port 443  (HTTPS)    - optional untuk SSL
```

---

### STEP 2: Fix Server Configuration

**Files sudah saya perbaiki:**
- ✅ `server/server.js` - sekarang listen di `0.0.0.0` (bukan `127.0.0.1`)
- ✅ `server/app.js` - CORS sudah dikonfigurasi
- ✅ `client/.env.production` - sudah ada EC2 IP

**Upload ke GitHub:**
```bash
git add .
git commit -m "Fix server for EC2 deployment"
git push
```

---

### STEP 3: Setup Server di EC2

**SSH ke EC2:**
```bash
ssh -i "your-key.pem" ubuntu@3.104.54.173
```

**Pull latest code:**
```bash
cd ~/IP-HCK88-Rahmad
git pull origin dev  # atau main
```

**Create .env file:**
```bash
cd server
nano .env
```

**Paste ini:**
```env
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

DB_USERNAME=booktracker_user
DB_PASSWORD=your_password_here
DB_NAME=booktracker
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

CLIENT_URL=https://book-tracker-rahmad.web.app

JWT_SECRET=rahmad-booktracker-super-secret-key-minimum-32-chars-2025

GOOGLE_CLIENT_ID=1068759642351-70bqtlm9pn51qok807sq7s4ilaa0qmlg.apps.googleusercontent.com
GEMINI_API_KEY=AIzaSyDms_sRT2yOi_dMEjFwtSIx6RUYDZay2OE
```

Save: `Ctrl+X` → `Y` → `Enter`

**Restart server:**
```bash
pm2 restart booktracker-api
# atau jika belum ada:
pm2 start server.js --name booktracker-api
```

**Check logs:**
```bash
pm2 logs booktracker-api
```

Should see:
```
⚡ Server listening on http://0.0.0.0:4000
📦 Environment: production
🌐 Client URL: https://book-tracker-rahmad.web.app
```

---

## 🧪 Test

### Test 1: Dari dalam EC2
```bash
curl http://localhost:4000/
```
Expected: `{"message":"Book Tracker API OK"}`

### Test 2: Dari local machine (Windows)
```bash
curl http://3.104.54.173:4000/
```
Expected: `{"message":"Book Tracker API OK"}`

### Test 3: Dari browser
Buka: http://3.104.54.173:4000/

Should see JSON response

---

## 🔍 Troubleshooting

### Jika masih connection refused:

**1. Check Security Group:**
```bash
# Di AWS Console, pastikan:
- Inbound rules ada port 4000
- Source: 0.0.0.0/0 atau Anywhere
```

**2. Check server running:**
```bash
ssh -i "key.pem" ubuntu@3.104.54.173
pm2 status
# Should show "online"
```

**3. Check port listening:**
```bash
sudo netstat -tlnp | grep 4000
# Should show: 0.0.0.0:4000
```

**4. Check firewall (disable if needed):**
```bash
sudo ufw status
# If active:
sudo ufw allow 4000
sudo ufw reload
```

---

## 📋 Checklist

- [ ] Security Group port 4000 opened (AWS Console)
- [ ] Code pushed ke GitHub
- [ ] Code pulled di EC2
- [ ] `.env` file created di EC2
- [ ] PM2 server running
- [ ] Server listening on `0.0.0.0:4000`
- [ ] `curl http://localhost:4000` works di EC2
- [ ] `curl http://3.104.54.173:4000` works dari local

---

## 🎯 After Success

1. **Redeploy client** dengan `.env.production` yang baru
2. **Test login** dari https://book-tracker-rahmad.web.app
3. **Check network tab** - API calls harus ke `http://3.104.54.173:4000/apis/...`

---

## 📞 Commands Reference

```bash
# SSH
ssh -i "key.pem" ubuntu@3.104.54.173

# Check status
pm2 status
pm2 logs

# Restart
pm2 restart booktracker-api

# View logs
pm2 logs booktracker-api --lines 50

# Check port
sudo netstat -tlnp | grep 4000

# Test locally
curl http://localhost:4000
curl http://localhost:4000/apis/books
```

---

**Security Group adalah kunci utama!** Jika port 4000 belum dibuka, connection pasti refused.
