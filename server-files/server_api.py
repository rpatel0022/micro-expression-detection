#!/usr/bin/env python3
"""
CS179G Micro-Expression Detection API Server
Upload this file to your CS179G server and run it there.
"""

import sys
import os
import json
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import traceback

# Add the project path to Python path
project_path = '/home/cs179g'
sys.path.insert(0, project_path)

app = Flask(__name__)
CORS(app)  # Enable CORS for web interface

def predict_image(image_data, filename):
    """
    Process uploaded image and return prediction
    """
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
        model_path = os.path.join(project_path, 'balanced_model.pth')
        landmarks_path = os.path.join(project_path, 'shape_predictor_68_face_landmarks.dat')

        if not os.path.exists(model_path):
            return {'error': f'Model file not found: {model_path}'}

        if not os.path.exists(landmarks_path):
            return {'error': f'Landmarks file not found: {landmarks_path}'}

        # Save uploaded image to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            tmp_file.write(image_data)
            temp_image_path = tmp_file.name

        try:
            # Load the trained PyTorch model
            model = torch.load(model_path, map_location='cpu')
            model.eval()

            # Extract features using your encoding.py
            # Try different encoding methods based on what's available
            features = None
            encoding_method = 'unknown'

            # Try dlib encoding (most likely based on your project)
            try:
                features = encoding.extract_dlib_features(temp_image_path, landmarks_path)
                encoding_method = 'dlib'
            except AttributeError:
                # Try other encoding methods
                try:
                    features = encoding.extract_features(temp_image_path)
                    encoding_method = 'default'
                except AttributeError:
                    # Try HOG encoding
                    try:
                        features = encoding.extract_hog_features(temp_image_path)
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
                'model_type': 'PyTorch',
                'filename': filename
            }

        finally:
            # Clean up temporary file
            if os.path.exists(temp_image_path):
                os.unlink(temp_image_path)

    except Exception as e:
        return {
            'error': str(e),
            'traceback': traceback.format_exc(),
            'project_path': project_path
        }

@app.route('/predict', methods=['POST'])
def predict():
    """
    API endpoint for image prediction
    Expects: JSON with base64 encoded image data
    Returns: JSON with prediction results
    """
    try:
        data = request.get_json()

        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        filename = data.get('filename', 'uploaded_image.jpg')

        # Decode base64 image
        try:
            image_data = base64.b64decode(data['image'])
        except Exception as e:
            return jsonify({'error': f'Invalid base64 image data: {str(e)}'}), 400

        # Process the image
        result = predict_image(image_data, filename)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'project_path': project_path,
        'model_exists': os.path.exists(os.path.join(project_path, 'balanced_model.pth')),
        'landmarks_exists': os.path.exists(os.path.join(project_path, 'shape_predictor_68_face_landmarks.dat'))
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API info"""
    return jsonify({
        'message': 'CS179G Micro-Expression Detection API',
        'endpoints': {
            'POST /predict': 'Upload image for prediction',
            'GET /health': 'Health check',
            'GET /': 'This info'
        }
    })

if __name__ == '__main__':
    print("🚀 Starting CS179G Micro-Expression Detection API Server")
    print(f"📁 Project path: {project_path}")
    print(f"🤖 Model file: {os.path.join(project_path, 'balanced_model.pth')}")
    print(f"👁️ Landmarks file: {os.path.join(project_path, 'shape_predictor_68_face_landmarks.dat')}")
    # Try different ports in case 5000 is blocked
    ports_to_try = [8080, 8000, 3000, 5000]

    for port in ports_to_try:
        try:
            print(f"🌐 Trying to start server on http://0.0.0.0:{port}")
            print(f"📡 Make sure to open port {port} in firewall if needed")

            # Run the server
            app.run(host='0.0.0.0', port=port, debug=True)
            break
        except OSError as e:
            if "Address already in use" in str(e):
                print(f"❌ Port {port} is already in use, trying next port...")
                continue
            else:
                raise e
