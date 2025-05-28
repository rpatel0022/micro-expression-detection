const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const FormData = require('form-data');
const axios = require('axios');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Load server configuration from private config file
let SERVER_CONFIG;
try {
  // Clear require cache to ensure fresh config load
  delete require.cache[require.resolve('./server-config.json')];
  SERVER_CONFIG = require('./server-config.json');
  console.log('✅ Loaded server configuration from server-config.json');
  console.log('📡 Server host:', SERVER_CONFIG.host);
} catch (error) {
  console.log('⚠️  server-config.json not found, using default configuration');
  SERVER_CONFIG = {
    host: 'class-143', // Your server hostname
    port: 22, // SSH port
    username: 'cs179g', // Your server username
    pythonPath: '/usr/bin/python3', // Python path on your server
    projectPath: '/home/cs179g', // Path to your project on server
    // For HTTP API (if your server has one)
    apiPort: 5000, // Port for HTTP API
    apiEndpoint: '/predict', // Prediction endpoint
    modelFile: 'balanced_model.pth', // Your model file (PyTorch format)
    landmarksFile: 'shape_predictor_68_face_landmarks.dat'
  };
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// Test server connection
app.get('/api/test-connection', async (req, res) => {
  try {
    console.log('Testing connection to server:', SERVER_CONFIG.host);
    console.log('Full config:', JSON.stringify(SERVER_CONFIG, null, 2));

    // Test 1: Try HTTP API connection (if available)
    if (SERVER_CONFIG.host !== 'your-server-ip') {
      try {
        const response = await axios.get(`http://${SERVER_CONFIG.host}:${SERVER_CONFIG.apiPort}/health`, {
          timeout: 5000
        });
        return res.json({
          success: true,
          method: 'HTTP API',
          message: 'Successfully connected to server HTTP API',
          serverResponse: response.data
        });
      } catch (httpError) {
        console.log('HTTP API not available, will try script execution');
      }
    }

    // Test 2: Basic connectivity test
    const isConfigured = SERVER_CONFIG.host !== 'your-server-ip' && SERVER_CONFIG.host !== 'class-143';
    res.json({
      success: true,
      method: 'Configuration Check',
      message: isConfigured ?
        `✅ Server configured! Ready to connect to ${SERVER_CONFIG.host}` :
        'Server configuration loaded. Update SERVER_CONFIG with your details.',
      config: {
        host: SERVER_CONFIG.host,
        configured: isConfigured,
        ready: isConfigured
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to connect to server'
    });
  }
});

// Upload and predict endpoint
app.post('/api/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imagePath = req.file.path;
    const filename = req.file.filename;

    console.log(`Processing image: ${filename}`);

    // Try HTTP API first, fall back to mock if it fails
    const result = await predictViaAPI(imagePath, filename);
    res.json(result);

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      error: 'Prediction failed',
      details: error.message
    });
  }
});

// Method 1: Predict via HTTP API (if your server has one)
async function predictViaAPI(imagePath, filename) {
  try {
    // Convert image to base64 for JSON API
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Send to your CS179G server API
    const response = await axios.post(`http://${SERVER_CONFIG.host}:5000/predict`, {
      image: base64Image,
      filename: filename
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    return {
      success: true,
      filename: filename,
      prediction: response.data,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    // Clean up uploaded file on error
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // If HTTP API fails, fall back to mock data
    console.log('HTTP API failed, using mock data:', error.message);
    return await generateMockPrediction(imagePath, filename);
  }
}

// Method 2: Predict via SSH execution on server
async function predictViaScript(imagePath, filename) {
  return new Promise((resolve, reject) => {
    // First, copy the image to the server
    const remoteImagePath = `/tmp/${filename}`;

    // Create a Python script that will run on the server
    const pythonScript = `
import sys
import os
import json

# Add the project path to Python path
project_path = '${SERVER_CONFIG.projectPath}'
sys.path.insert(0, project_path)

def predict_image(image_path):
    try:
        # Import required libraries
        import torch
        import numpy as np
        import cv2

        # Import your CS179G project modules
        import encoding
        import classifiers
        import image_preprocess

        # Check if model file exists
        model_path = os.path.join(project_path, '${SERVER_CONFIG.modelFile}')
        landmarks_path = os.path.join(project_path, '${SERVER_CONFIG.landmarksFile}')

        if not os.path.exists(model_path):
            return {'error': f'Model file not found: {model_path}'}

        if not os.path.exists(landmarks_path):
            return {'error': f'Landmarks file not found: {landmarks_path}'}

        if not os.path.exists(image_path):
            return {'error': f'Image file not found: {image_path}'}

        # Load the trained PyTorch model
        model = torch.load(model_path, map_location='cpu')
        model.eval()

        # Extract features using your encoding.py
        # Try different encoding methods based on what's available
        features = None
        encoding_method = 'unknown'

        # Try dlib encoding (most likely based on your project)
        try:
            features = encoding.extract_dlib_features(image_path, landmarks_path)
            encoding_method = 'dlib'
        except AttributeError:
            # Try other encoding methods
            try:
                features = encoding.extract_features(image_path)
                encoding_method = 'default'
            except AttributeError:
                # Try HOG encoding
                try:
                    features = encoding.extract_hog_features(image_path)
                    encoding_method = 'hog'
                except AttributeError:
                    return {'error': 'No compatible encoding method found'}

        if features is None:
            return {'error': 'Feature extraction failed'}

        # Convert features to tensor
        if isinstance(features, np.ndarray):
            features_tensor = torch.FloatTensor(features).unsqueeze(0)
        else:
            features_tensor = torch.FloatTensor([features]).unsqueeze(0)

        # Make prediction
        with torch.no_grad():
            outputs = model(features_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = torch.max(probabilities).item()

        # Map class index to label (based on your CS179G project)
        class_labels = ['truth', 'lie']  # Adjust if your model uses different labels
        prediction_label = class_labels[predicted_class] if predicted_class < len(class_labels) else 'unknown'

        return {
            'prediction': prediction_label,
            'confidence': float(confidence),
            'encoding_method': encoding_method,
            'features_extracted': len(features) if hasattr(features, '__len__') else 'N/A',
            'model_type': 'PyTorch'
        }

    except Exception as e:
        import traceback
        return {
            'error': str(e),
            'traceback': traceback.format_exc(),
            'project_path': project_path
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No image path provided'}))
        sys.exit(1)

    image_path = sys.argv[1]
    result = predict_image(image_path)
    print(json.dumps(result))
`;

    // Write temporary Python script locally
    const localScriptPath = path.join(__dirname, 'temp_predict.py');
    fs.writeFileSync(localScriptPath, pythonScript);

    // Remote script path on server
    const remoteScriptPath = `/tmp/predict_${Date.now()}.py`;

    // Execute commands via SSH
    const sshCommand = `
      # Copy image to server
      scp "${imagePath}" ${SERVER_CONFIG.username}@${SERVER_CONFIG.host}:${remoteImagePath} &&
      # Copy script to server
      scp "${localScriptPath}" ${SERVER_CONFIG.username}@${SERVER_CONFIG.host}:${remoteScriptPath} &&
      # Execute script on server
      ssh ${SERVER_CONFIG.username}@${SERVER_CONFIG.host} "cd ${SERVER_CONFIG.projectPath} && python3 ${remoteScriptPath} ${remoteImagePath}" &&
      # Clean up remote files
      ssh ${SERVER_CONFIG.username}@${SERVER_CONFIG.host} "rm -f ${remoteImagePath} ${remoteScriptPath}"
    `;

    const sshProcess = spawn('bash', ['-c', sshCommand]);

    let output = '';
    let errorOutput = '';

    sshProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    sshProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    sshProcess.on('close', (code) => {
      // Clean up local files
      if (fs.existsSync(localScriptPath)) {
        fs.unlinkSync(localScriptPath);
      }
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      console.log(`SSH command finished with code: ${code}`);
      console.log(`SSH stdout: ${output}`);
      console.log(`SSH stderr: ${errorOutput}`);

      if (code === 0) {
        try {
          // The output should contain the JSON result from the Python script
          const lines = output.trim().split('\n');
          const jsonLine = lines[lines.length - 1]; // Get the last line which should be JSON
          const result = JSON.parse(jsonLine);

          resolve({
            success: true,
            filename: filename,
            prediction: result,
            timestamp: new Date().toISOString()
          });
        } catch (parseError) {
          console.error('Parse error:', parseError);
          console.error('Raw output:', output);
          // Return a mock result for now to test the interface
          resolve({
            success: true,
            filename: filename,
            prediction: {
              prediction: 'lie',
              confidence: 0.75,
              encoding_method: 'dlib',
              features_extracted: 68,
              model_type: 'PyTorch',
              error: 'Using mock data - SSH script failed to parse',
              raw_output: output
            },
            timestamp: new Date().toISOString()
          });
        }
      } else {
        console.error('SSH command failed with error:', errorOutput);
        // Return a mock result for now to test the interface
        resolve({
          success: true,
          filename: filename,
          prediction: {
            prediction: 'lie',
            confidence: 0.75,
            encoding_method: 'dlib',
            features_extracted: 68,
            model_type: 'PyTorch',
            error: `SSH command failed: ${errorOutput}`,
            raw_output: output
          },
          timestamp: new Date().toISOString()
        });
      }
    });

    // Set timeout
    setTimeout(() => {
      sshProcess.kill();
      reject(new Error('SSH prediction timeout'));
    }, 60000); // Increased timeout for SSH operations
  });
}

// Method 3: Generate realistic mock prediction (temporary while fixing SSH)
async function generateMockPrediction(imagePath, filename) {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Generate realistic mock data based on CS179G project
      const predictions = ['truth', 'lie'];
      const encodingMethods = ['dlib', 'hog', 'resnet18'];
      const confidenceRanges = {
        'truth': [0.65, 0.92],
        'lie': [0.58, 0.89]
      };

      const prediction = predictions[Math.floor(Math.random() * predictions.length)];
      const encoding = encodingMethods[Math.floor(Math.random() * encodingMethods.length)];
      const [minConf, maxConf] = confidenceRanges[prediction];
      const confidence = Math.random() * (maxConf - minConf) + minConf;

      // Clean up uploaded file
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      resolve({
        success: true,
        filename: filename,
        prediction: {
          prediction: prediction,
          confidence: parseFloat(confidence.toFixed(4)),
          encoding_method: encoding,
          features_extracted: encoding === 'dlib' ? 68 : (encoding === 'hog' ? 324 : 512),
          model_type: 'PyTorch',
          note: 'Mock prediction - SSH connection being fixed'
        },
        timestamp: new Date().toISOString()
      });
    }, 2000); // 2 second delay to simulate processing
  });
}

// Get prediction history
app.get('/api/history', (req, res) => {
  // You could implement a simple file-based or database storage for prediction history
  res.json({
    message: 'Prediction history endpoint',
    // Add your history logic here
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Prediction server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('  POST /api/predict - Upload image for prediction');
  console.log('  GET  /api/health - Health check');
  console.log('  GET  /api/history - Prediction history');
  console.log('\nMake sure to update SERVER_CONFIG with your server details!');
});
