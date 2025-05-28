#!/bin/bash

# CS179G Server Setup Script
# This script helps you set up the HTTP API on your CS179G server

echo "🚀 CS179G Micro-Expression Detection Server Setup"
echo "=================================================="

# Check if we have the required files
if [ ! -f "server_api.py" ]; then
    echo "❌ Error: server_api.py not found!"
    echo "   Make sure you're running this script from the CS179G_WebInterface directory"
    exit 1
fi

if [ ! -f "server_requirements.txt" ]; then
    echo "❌ Error: server_requirements.txt not found!"
    exit 1
fi

echo "📁 Found required files:"
echo "   ✅ server_api.py"
echo "   ✅ server_requirements.txt"
echo ""

# Get server details
read -p "🌐 Enter your CS179G server IP address (e.g., 169.235.28.143): " SERVER_IP
read -p "👤 Enter your username (default: cs179g): " USERNAME
USERNAME=${USERNAME:-cs179g}

echo ""
echo "📡 Server Details:"
echo "   IP: $SERVER_IP"
echo "   Username: $USERNAME"
echo ""

# Test basic connectivity
echo "🔍 Testing basic connectivity..."
if ping -c 1 "$SERVER_IP" > /dev/null 2>&1; then
    echo "   ✅ Server is reachable"
else
    echo "   ❌ Server is not reachable"
    echo "   Make sure you're connected to the right network (VPN?)"
    exit 1
fi

# Try to copy files to server
echo ""
echo "📤 Copying files to server..."

# Copy the API server script
if scp server_api.py "$USERNAME@$SERVER_IP:/home/cs179g/"; then
    echo "   ✅ Copied server_api.py"
else
    echo "   ❌ Failed to copy server_api.py"
    echo "   Check your SSH access to the server"
    exit 1
fi

# Copy requirements file
if scp server_requirements.txt "$USERNAME@$SERVER_IP:/home/cs179g/"; then
    echo "   ✅ Copied server_requirements.txt"
else
    echo "   ❌ Failed to copy server_requirements.txt"
fi

echo ""
echo "🔧 Setting up Python environment on server..."

# Install Python dependencies
ssh "$USERNAME@$SERVER_IP" << 'EOF'
cd /home/cs179g

echo "📦 Installing Python dependencies..."
pip3 install --user -r server_requirements.txt

echo "🔍 Checking project files..."
if [ -f "balanced_model.pth" ]; then
    echo "   ✅ Model file found: balanced_model.pth"
else
    echo "   ❌ Model file not found: balanced_model.pth"
fi

if [ -f "shape_predictor_68_face_landmarks.dat" ]; then
    echo "   ✅ Landmarks file found: shape_predictor_68_face_landmarks.dat"
else
    echo "   ❌ Landmarks file not found: shape_predictor_68_face_landmarks.dat"
fi

if [ -f "encoding.py" ]; then
    echo "   ✅ Encoding module found: encoding.py"
else
    echo "   ❌ Encoding module not found: encoding.py"
fi

echo ""
echo "🚀 Starting API server..."
echo "   The server will run on port 5000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the API server
python3 server_api.py
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. The API server should now be running on http://$SERVER_IP:5000"
echo "   2. Test the connection using: curl http://$SERVER_IP:5000/health"
echo "   3. Update your web interface to use this server"
echo ""
echo "🔧 To start the server manually later:"
echo "   ssh $USERNAME@$SERVER_IP"
echo "   cd /home/cs179g"
echo "   python3 server_api.py"
