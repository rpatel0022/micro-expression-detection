#!/bin/bash

# CS179G Micro-Expression Detection - Quick Start Script
# This script sets up and starts the entire project

echo "🚀 CS179G Micro-Expression Detection - Quick Start"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "server-files" ] || [ ! -d "web-interface" ]; then
    print_error "Please run this script from the CS179G_WebInterface directory"
    exit 1
fi

print_status "Setting up CS179G Micro-Expression Detection Project..."

# Step 1: Setup Server Files
print_status "Step 1: Setting up server environment..."
cd server-files

if [ -f "setup_server.sh" ]; then
    chmod +x setup_server.sh start_server.sh
    print_success "Server scripts made executable"
else
    print_warning "Server setup script not found, skipping..."
fi

cd ..

# Step 2: Setup Web Interface
print_status "Step 2: Setting up web interface..."
cd web-interface

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing Node.js dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Node.js dependencies installed"
    else
        print_error "Failed to install Node.js dependencies"
        exit 1
    fi
else
    print_success "Node.js dependencies already installed"
fi

# Make scripts executable
chmod +x start-servers.sh
print_success "Web interface scripts made executable"

cd ..

# Step 3: Display next steps
echo ""
print_success "Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🖥️  Start the server (in one terminal):"
echo "   cd server-files"
echo "   ./start_server.sh"
echo ""
echo "2. 🌐 Start the web interface (in another terminal):"
echo "   cd web-interface"
echo "   ./start-servers.sh"
echo ""
echo "3. 🔗 Access the application:"
echo "   • Web Interface: http://localhost:3000"
echo "   • API Server: http://localhost:5000"
echo "   • Prediction Server: http://localhost:3001"
echo ""
echo "📚 Documentation available in the 'docs/' folder"
echo ""
print_success "Ready to go! 🎉"
