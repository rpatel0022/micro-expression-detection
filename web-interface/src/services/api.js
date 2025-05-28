import axios from 'axios';

// API Configuration
const API_CONFIG = {
  // Try localhost first (for SSH tunnel), fallback to server IP
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 30000, // 30 seconds for image processing
};

// Create axios instance
const api = axios.create(API_CONFIG);

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// API Service Functions
export const apiService = {
  // Health check
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Health check failed'
      };
    }
  },

  // Upload and predict image
  async predictImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Prediction failed'
      };
    }
  },

  // Upload and predict image with Real CS179G Models
  async predictImageReal(imageFile, selectedMethods = ['dlib_rf', 'hog_dt', 'resnet_lr']) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('methods', JSON.stringify(selectedMethods));

      const response = await api.post('/predict-real', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for real model processing
      });

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Real CS179G prediction failed'
      };
    }
  },

  // Get database records
  async getDatabaseRecords(filters = {}) {
    try {
      const response = await api.get('/database', { params: filters });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Database query failed'
      };
    }
  },

  // Get database statistics
  async getDatabaseStats() {
    try {
      const response = await api.get('/database/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Stats query failed'
      };
    }
  },

  // Download database as CSV
  async downloadDatabase(filters = {}) {
    try {
      const response = await api.get('/database/download', {
        params: filters,
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'micro_expressions_data.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Download failed'
      };
    }
  }
};

// Mock data for testing when server is not available
export const mockData = {
  healthCheck: {
    landmarks_exists: true,
    model_exists: true,
    project_path: "/home/cs179g",
    status: "healthy"
  },

  predictionResult: {
    prediction: "Deceptive",
    confidence: 0.87,
    processing_time: 2.3,
    facial_landmarks: 68,
    features_extracted: 136,
    model_used: "Random Forest",
    image_info: {
      width: 640,
      height: 480,
      format: "JPEG"
    }
  },

  databaseRecords: [
    {
      id: 1,
      filename: "subject_001_frame_045.jpg",
      prediction: "Truthful",
      confidence: 0.92,
      encoding_method: "HOG",
      processing_time: 1.8,
      created_at: "2024-01-15 14:30:22"
    },
    {
      id: 2,
      filename: "subject_002_frame_123.jpg",
      prediction: "Deceptive",
      confidence: 0.85,
      encoding_method: "dlib",
      processing_time: 2.1,
      created_at: "2024-01-15 14:31:45"
    },
    {
      id: 3,
      filename: "subject_003_frame_067.jpg",
      prediction: "Truthful",
      confidence: 0.78,
      encoding_method: "ResNet18",
      processing_time: 3.2,
      created_at: "2024-01-15 14:32:10"
    }
  ],

  databaseStats: {
    total_records: 1247,
    truthful_count: 623,
    deceptive_count: 624,
    avg_confidence: 0.84,
    encoding_methods: {
      "HOG": 415,
      "dlib": 416,
      "ResNet18": 416
    },
    avg_processing_time: 2.1
  }
};

export default api;
