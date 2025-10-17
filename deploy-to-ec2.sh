#!/bin/bash
# Quick SSH and Setup Script

KEY_PATH="/c/Users/RahmadSantoso/1-Hacktiv8-hck88/3-Phase-2/rahmad db/rahmad00.pem"
EC2_HOST="ubuntu@ec2-3-104-54-173.ap-southeast-2.compute.amazonaws.com"

echo "🔐 Setting key permissions..."
chmod 400 "$KEY_PATH"

echo ""
echo "🚀 Connecting to EC2 and running setup..."
echo "=========================================="
echo ""

# Upload setup script to EC2
scp -i "$KEY_PATH" ec2-setup.sh "$EC2_HOST:~/"

# SSH and run setup
ssh -i "$KEY_PATH" "$EC2_HOST" << 'ENDSSH'
echo "✅ Connected to EC2!"
echo ""

# Run setup script
chmod +x ~/ec2-setup.sh
bash ~/ec2-setup.sh

ENDSSH

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🧪 Testing from local machine..."
curl http://3.104.54.173:4000/

echo ""
echo "📝 To connect again:"
echo "ssh -i \"$KEY_PATH\" $EC2_HOST"
