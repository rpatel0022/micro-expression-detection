import os
import cv2
import dlib
import torch
import numpy as np
import pandas as pd
import sqlite3
import time
from datetime import datetime
from torchvision import models, transforms
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UnifiedMicroExpressionAnalyzer:
    def __init__(self, db_path="cs179g.db"):
        self.db_path = db_path
        self.setup_database()
        self.load_models()

    def setup_database(self):
        """Create the unified results table"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS analysis_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_path TEXT NOT NULL,
                original_filename TEXT,
                encoding_type TEXT NOT NULL,
                classifier_type TEXT NOT NULL,
                prediction TEXT NOT NULL,
                confidence REAL NOT NULL,
                processing_time REAL NOT NULL,
                features_extracted INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                model_combination TEXT NOT NULL
            )
        ''')

        conn.commit()
        conn.close()
        logger.info("Database table 'analysis_results' ready")

    def load_models(self):
        """Load all required models and detectors"""
        try:
            # Load dlib face detector and predictor
            self.detector = dlib.get_frontal_face_detector()
            predictor_path = "shape_predictor_68_face_landmarks.dat"
            if os.path.exists(predictor_path):
                self.predictor = dlib.shape_predictor(predictor_path)
            else:
                logger.warning(f"dlib predictor not found at {predictor_path}")
                self.predictor = None

            # Load ResNet18
            self.resnet = torch.nn.Sequential(*list(models.resnet18(pretrained=True).children())[:-1])
            self.resnet.eval()

            # CNN transform
            self.cnn_transform = transforms.Compose([
                transforms.ToPILImage(),
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])

            logger.info("All models loaded successfully")

        except Exception as e:
            logger.error(f"Error loading models: {e}")

    def extract_hog_features(self, image_path):
        """Extract HOG features (Low-level encoding)"""
        try:
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                return None
            img = cv2.resize(img, (64, 64))
            hog = cv2.HOGDescriptor(_winSize=(64,64), _blockSize=(16,16),
                                  _blockStride=(8,8), _cellSize=(8,8), _nbins=9)
            features = hog.compute(img)
            return features.flatten()
        except Exception as e:
            logger.error(f"HOG extraction error: {e}")
            return None

    def extract_dlib_features(self, image_path):
        """Extract dlib facial landmarks (High-level encoding)"""
        try:
            if self.predictor is None:
                return None
            img = cv2.imread(image_path)
            if img is None:
                return None
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = self.detector(gray)
            if not faces:
                return np.zeros(136)  # No face found
            shape = self.predictor(gray, faces[0])
            landmarks = [(pt.x, pt.y) for pt in shape.parts()]
            features = [coord for pt in landmarks for coord in pt]
            return np.array(features)
        except Exception as e:
            logger.error(f"dlib extraction error: {e}")
            return None

    def extract_resnet_features(self, image_path):
        """Extract ResNet18 features (Pretrained encoding)"""
        try:
            img = cv2.imread(image_path)
            if img is None:
                return None
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            tensor = self.cnn_transform(img_rgb).unsqueeze(0)
            with torch.no_grad():
                features = self.resnet(tensor).squeeze().numpy()
            return features.flatten()
        except Exception as e:
            logger.error(f"ResNet extraction error: {e}")
            return None

    def extract_raw_pixel_features(self, image_path):
        """Extract raw pixel features"""
        try:
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                return None
            img = cv2.resize(img, (64, 64))
            return img.flatten().astype(float)
        except Exception as e:
            logger.error(f"Raw pixel extraction error: {e}")
            return None

    def extract_compressed_pixel_features(self, image_path):
        """Extract compressed pixel features (JPEG quality 30)"""
        try:
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                return None
            # Compress with JPEG quality 30
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 30]
            _, compressed = cv2.imencode('.jpg', img, encode_param)
            img = cv2.imdecode(compressed, cv2.IMREAD_GRAYSCALE)
            img = cv2.resize(img, (64, 64))
            return img.flatten().astype(float)
        except Exception as e:
            logger.error(f"Compressed pixel extraction error: {e}")
            return None

    def predict_with_mock_classifier(self, features, classifier_type):
        """Mock prediction function - replace with actual trained models"""
        if features is None or len(features) == 0:
            return "unknown", 0.5

        # Simple mock prediction based on feature statistics
        feature_mean = np.mean(features)
        feature_std = np.std(features)

        # Mock logic for demonstration
        if feature_mean > feature_std:
            prediction = "truth"
            confidence = min(0.95, 0.6 + abs(feature_mean - feature_std) / 1000)
        else:
            prediction = "lie"
            confidence = min(0.95, 0.6 + abs(feature_mean - feature_std) / 1000)

        # Add some randomness based on classifier type
        if classifier_type == "random_forest":
            confidence *= 0.95
        elif classifier_type == "decision_tree":
            confidence *= 0.85
        elif classifier_type == "logistic_regression":
            confidence *= 0.90

        return prediction, confidence

    def analyze_single_image(self, image_path, methods=None):
        """
        Analyze a single image with specified methods

        Args:
            image_path: Path to the image file
            methods: List of method combinations to run, or None for all
                   Format: ['hog_rf', 'dlib_dt', 'resnet_lr', etc.]

        Returns:
            List of analysis results
        """
        if methods is None:
            methods = [
                'hog_rf', 'hog_dt',
                'dlib_rf', 'dlib_dt',
                'resnet_rf', 'resnet_dt', 'resnet_lr',
                'raw_pixels_rf', 'compressed_pixels_rf'
            ]

        results = []
        original_filename = os.path.basename(image_path)

        for method in methods:
            start_time = time.time()

            # Parse method string
            parts = method.split('_')
            if len(parts) >= 2:
                encoding_type = '_'.join(parts[:-1])
                classifier_type = parts[-1]
            else:
                continue

            # Extract features based on encoding type
            features = None
            if encoding_type == 'hog':
                features = self.extract_hog_features(image_path)
            elif encoding_type == 'dlib':
                features = self.extract_dlib_features(image_path)
            elif encoding_type == 'resnet':
                features = self.extract_resnet_features(image_path)
            elif encoding_type == 'raw_pixels':
                features = self.extract_raw_pixel_features(image_path)
            elif encoding_type == 'compressed_pixels':
                features = self.extract_compressed_pixel_features(image_path)

            if features is None:
                logger.warning(f"Failed to extract features for {method}")
                continue

            # Get prediction
            prediction, confidence = self.predict_with_mock_classifier(features, classifier_type)

            processing_time = time.time() - start_time

            # Create result record
            result = {
                'image_path': image_path,
                'original_filename': original_filename,
                'encoding_type': encoding_type,
                'classifier_type': classifier_type,
                'prediction': prediction,
                'confidence': confidence,
                'processing_time': processing_time,
                'features_extracted': len(features),
                'model_combination': f"{encoding_type.replace('_', ' ').title()} + {classifier_type.replace('_', ' ').title()}"
            }

            results.append(result)
            logger.info(f"Completed {method}: {prediction} ({confidence:.2%})")

        # Store results in database
        self.store_results(results)

        return results

    def store_results(self, results):
        """Store analysis results in the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        for result in results:
            cursor.execute('''
                INSERT INTO analysis_results
                (image_path, original_filename, encoding_type, classifier_type,
                 prediction, confidence, processing_time, features_extracted, model_combination)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                result['image_path'],
                result['original_filename'],
                result['encoding_type'],
                result['classifier_type'],
                result['prediction'],
                result['confidence'],
                result['processing_time'],
                result['features_extracted'],
                result['model_combination']
            ))

        conn.commit()
        conn.close()
        logger.info(f"Stored {len(results)} results in database")

    def get_analysis_results(self, limit=50, image_path=None):
        """Retrieve analysis results from database"""
        conn = sqlite3.connect(self.db_path)

        if image_path:
            query = "SELECT * FROM analysis_results WHERE image_path = ? ORDER BY timestamp DESC LIMIT ?"
            df = pd.read_sql_query(query, conn, params=(image_path, limit))
        else:
            query = "SELECT * FROM analysis_results ORDER BY timestamp DESC LIMIT ?"
            df = pd.read_sql_query(query, conn, params=(limit,))

        conn.close()
        return df

    def get_statistics(self):
        """Get comprehensive statistics from the database"""
        conn = sqlite3.connect(self.db_path)

        stats = {}

        # Total analyses
        stats['total_analyses'] = pd.read_sql_query(
            "SELECT COUNT(*) as count FROM analysis_results", conn
        ).iloc[0]['count']

        # Accuracy by model combination
        stats['accuracy_by_model'] = pd.read_sql_query('''
            SELECT model_combination,
                   AVG(confidence) as avg_confidence,
                   COUNT(*) as count
            FROM analysis_results
            GROUP BY model_combination
            ORDER BY avg_confidence DESC
        ''', conn)

        # Prediction distribution
        stats['prediction_distribution'] = pd.read_sql_query('''
            SELECT prediction, COUNT(*) as count
            FROM analysis_results
            GROUP BY prediction
        ''', conn)

        # Processing time by encoding
        stats['processing_time_by_encoding'] = pd.read_sql_query('''
            SELECT encoding_type,
                   AVG(processing_time) as avg_time,
                   MIN(processing_time) as min_time,
                   MAX(processing_time) as max_time
            FROM analysis_results
            GROUP BY encoding_type
            ORDER BY avg_time
        ''', conn)

        conn.close()
        return stats

# Convenience functions for API integration
def analyze_image(image_path, methods=None):
    """Convenience function to analyze a single image"""
    analyzer = UnifiedMicroExpressionAnalyzer()
    return analyzer.analyze_single_image(image_path, methods)

def get_available_methods():
    """Get list of available analysis methods"""
    return [
        {'value': 'hog_rf', 'label': 'HOG + Random Forest'},
        {'value': 'hog_dt', 'label': 'HOG + Decision Tree'},
        {'value': 'dlib_rf', 'label': 'dlib Landmarks + Random Forest'},
        {'value': 'dlib_dt', 'label': 'dlib Landmarks + Decision Tree'},
        {'value': 'resnet_rf', 'label': 'ResNet18 + Random Forest'},
        {'value': 'resnet_dt', 'label': 'ResNet18 + Decision Tree'},
        {'value': 'resnet_lr', 'label': 'ResNet18 + Logistic Regression'},
        {'value': 'raw_pixels_rf', 'label': 'Raw Pixels + Random Forest'},
        {'value': 'compressed_pixels_rf', 'label': 'Compressed Pixels + Random Forest'}
    ]

if __name__ == "__main__":
    # Test the analyzer
    analyzer = UnifiedMicroExpressionAnalyzer()
    print("Unified Micro-Expression Analyzer initialized successfully!")
    print(f"Available methods: {len(get_available_methods())}")

    # Print available methods
    for method in get_available_methods():
        print(f"  - {method['label']}")
