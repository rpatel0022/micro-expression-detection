#!/bin/bash

# CS179G Live Prediction Server Startup Script
echo "🚀 Starting CS179G Live Prediction System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install express multer cors sqlite3 form-data axios
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Create uploads directory if it doesn't exist
mkdir -p uploads

echo "✅ Dependencies installed successfully!"
echo ""
echo "🔧 Configuration needed:"
echo "   1. Edit prediction-server.js and update SERVER_CONFIG with your server details"
echo "   2. Make sure your CS179G server is accessible"
echo ""
echo "🖥️  Starting servers..."
echo ""

# Function to start a server in background
start_server() {
    local server_file=$1
    local server_name=$2
    local port=$3
    
    echo "Starting $server_name on port $port..."
    node "$server_file" &
    local pid=$!
    echo "$server_name PID: $pid"
    
    # Wait a moment and check if process is still running
    sleep 2
    if kill -0 $pid 2>/dev/null; then
        echo "✅ $server_name started successfully"
    else
        echo "❌ $server_name failed to start"
        return 1
    fi
    
    return 0
}

# Start prediction server
if start_server "prediction-server.js" "Prediction Server" "3002"; then
    echo ""
    echo "🎉 Server started successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Open your web interface: npm start (in another terminal)"
    echo "   2. Navigate to: http://localhost:3000"
    echo "   3. Go to 'Live Prediction' section"
    echo "   4. Click 'Test Connection' to verify server connectivity"
    echo ""
    echo "🔗 API Endpoints:"
    echo "   • Health Check: http://localhost:3002/api/health"
    echo "   • Test Connection: http://localhost:3002/api/test-connection"
    echo "   • Prediction: http://localhost:3002/api/predict"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Wait for user to stop
    wait
else
    echo "❌ Failed to start servers"
    exit 1
fi
