# 🚀 Live Prediction Setup Guide

This guide will help you set up the live micro-expression prediction feature that connects your web interface to your server with the trained models.

## 📋 Prerequisites

1. **Your CS179G Database**: `cs179g.db` file
2. **Your Server**: With Python files and trained models
3. **Node.js**: Version 14+ installed
4. **Your Trained Models**: `balanced_model.pkl` and related files

## 🔧 Setup Steps

### Step 1: Install Backend Dependencies

```bash
cd micro-expression-detection

# Install backend dependencies
npm install --save express multer cors sqlite3 form-data axios
# OR use the package file:
# cp package-backend.json package-backend-temp.json
# npm install --package-lock-only --package-lock-file package-backend-temp.json
```

### Step 2: Place Your Database

```bash
# Download and place your cs179g.db file in the project directory
# Desktop/CS179G_WebInterface/micro-expression-detection/cs179g.db
```

### Step 3: Configure Server Connection

Edit `prediction-server.js` and update the `SERVER_CONFIG` section:

```javascript
const SERVER_CONFIG = {
  host: 'YOUR_SERVER_IP',           // Replace with your server IP
  port: 22,                         // SSH port
  username: 'YOUR_USERNAME',        // Your server username
  pythonPath: '/usr/bin/python3',   // Python path on your server
  projectPath: '/path/to/your/cs179g/project', // Path to your project on server
};
```

### Step 4: Update Python Script Path

In `prediction-server.js`, update the Python script to match your project structure:

```javascript
// Update these paths to match your server structure:
sys.path.append('${SERVER_CONFIG.projectPath}')

// Import your modules (update these imports)
from encoding import extract_features
from classifiers import predict_expression
import pickle

// Update model path
with open('${SERVER_CONFIG.projectPath}/balanced_model.pkl', 'rb') as f:
    model = pickle.load(f)
```

## 🖥️ Running the System

### Option 1: Database + Live Prediction

```bash
# Terminal 1: Start the database server
node server.js
# Runs on http://localhost:3001

# Terminal 2: Start the prediction server  
node prediction-server.js
# Runs on http://localhost:3002

# Terminal 3: Start the web interface
npm start
# Runs on http://localhost:3000
```

### Option 2: Just Live Prediction (without database)

```bash
# Terminal 1: Start the prediction server
node prediction-server.js

# Terminal 2: Start the web interface
npm start
```

## 🔗 Server Integration Options

### Option A: HTTP API (Recommended)

If your server has an HTTP API endpoint:

```python
# On your server, create a simple Flask/FastAPI endpoint
from flask import Flask, request, jsonify
import your_prediction_modules

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    image = request.files['image']
    # Your prediction logic here
    result = your_model.predict(image)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### Option B: Direct Script Execution

The current setup runs Python scripts directly. Make sure your server has:

1. **Python Environment**: With all required packages
2. **Model Files**: `balanced_model.pkl` accessible
3. **Your Modules**: `encoding.py`, `classifiers.py`, etc.

## 📁 Expected Server File Structure

```
your-server/
├── balanced_model.pkl
├── encoding.py
├── classifiers.py
├── image_preprocess.py
├── sparkPipeline.py
├── requirements.txt
└── other_model_files/
```

## 🧪 Testing the Setup

### Test 1: Database Connection

```bash
curl http://localhost:3001/api/schema
# Should return your database schema
```

### Test 2: Prediction Server

```bash
curl http://localhost:3002/api/health
# Should return server status
```

### Test 3: Live Prediction

1. Open http://localhost:3000
2. Navigate to "Live Prediction" section
3. Upload a test facial image
4. Check for prediction results

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure both servers are running
2. **File Upload Fails**: Check file size limits (10MB max)
3. **Python Script Errors**: Verify paths and dependencies on server
4. **Database Connection**: Ensure `cs179g.db` is in the correct location

### Debug Steps:

```bash
# Check if servers are running
lsof -i :3001  # Database server
lsof -i :3002  # Prediction server
lsof -i :3000  # Web interface

# Check server logs
tail -f prediction-server.log
```

## 🔒 Security Notes

- **File Uploads**: Limited to images, 10MB max
- **SQL Injection**: Only SELECT queries allowed
- **Server Access**: Configure SSH keys for production
- **CORS**: Restrict origins in production

## 🚀 Production Deployment

For production deployment:

1. **Use Environment Variables** for server config
2. **Set up SSL/HTTPS** for secure connections
3. **Configure Firewall** rules
4. **Use Process Manager** (PM2) for Node.js
5. **Set up Logging** and monitoring

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Check server logs in terminal
3. Verify your server file structure matches expectations
4. Test with a simple image first

## 🎯 Next Steps

Once working:

1. **Add More Models**: Support multiple encoding methods
2. **Batch Processing**: Upload multiple images
3. **Real-time Video**: Process video streams
4. **Model Comparison**: Compare different model results
5. **Performance Metrics**: Track prediction accuracy over time

---

**Ready to test your live micro-expression detection system!** 🔍✨
