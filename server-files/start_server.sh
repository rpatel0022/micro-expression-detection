#!/bin/bash

echo "🚀 Starting CS179G API Server..."

# Set the project directory
PROJECT_DIR="/home/cs179g"
cd "$PROJECT_DIR"

# Add current directory to Python path
export PYTHONPATH="$PROJECT_DIR:$PYTHONPATH"

echo "📁 Working directory: $(pwd)"
echo "🐍 Python path: $PYTHONPATH"

# Check if required files exist
if [ ! -f "balanced_model.pth" ]; then
    echo "❌ Model file not found: balanced_model.pth"
    exit 1
fi

if [ ! -f "shape_predictor_68_face_landmarks.dat" ]; then
    echo "❌ Landmarks file not found: shape_predictor_68_face_landmarks.dat"
    exit 1
fi

echo "✅ Required files found"

# Start the server
echo "🌐 Starting Flask server..."
python3 server_api.py
