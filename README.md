# CS179G Micro-Expression Detection Project

A comprehensive web interface for micro-expression detection using machine learning models with real-time analysis capabilities.

## 📁 Project Structure

```
CS179G_WebInterface/
├── 📂 server-files/           # Server-side processing and analysis
│   ├── server_api.py          # Main Python API server
│   ├── unified_analysis.py    # Unified analysis functions
│   ├── unified_analysis_real.py # Real server integration
│   ├── test_real_analysis.py  # Testing scripts
│   ├── server_requirements.txt # Python dependencies
│   ├── setup_server.sh        # Server setup script
│   ├── start_server.sh        # Server startup script
│   └── package.json           # Node.js dependencies for server
│
├── 📂 web-interface/          # React web application
│   ├── 📂 src/                # React source code
│   │   ├── 📂 components/     # React components
│   │   ├── 📂 services/       # API services
│   │   └── 📂 data/           # Static data
│   ├── 📂 public/             # Static assets
│   │   └── 📂 images/         # Demo images
│   ├── 📂 uploads/            # User uploaded files
│   ├── server.js              # Express backend server
│   ├── prediction-server.js   # Prediction API server
│   ├── setup_database.js      # Database initialization
│   ├── cs179g.db              # SQLite database
│   ├── package.json           # React app dependencies
│   └── start-servers.sh       # Start all servers script
│
├── 📂 docs/                   # Documentation
│   ├── README.md              # Original project README
│   ├── SETUP_INSTRUCTIONS.md  # Setup guide
│   ├── SETUP_LIVE_PREDICTION.md # Live prediction setup
│   └── setup_demo_images.md   # Demo images setup
│
└── README.md                  # This file
```

## 🚀 Quick Start

### 1. Server Setup
```bash
cd server-files
chmod +x setup_server.sh start_server.sh
./setup_server.sh
./start_server.sh
```

### 2. Web Interface Setup
```bash
cd web-interface
npm install
chmod +x start-servers.sh
./start-servers.sh
```

### 3. Access the Application
- **Web Interface**: http://localhost:3000
- **API Server**: http://localhost:5000
- **Prediction Server**: http://localhost:3001

## 🔧 Features

- **Real-time Micro-expression Detection**
- **Multiple ML Models** (HOG, dlib landmarks, ResNet18)
- **Interactive Web Interface**
- **Database Integration** (SQLite)
- **Server Integration** for CS179G project
- **Comprehensive Analytics Dashboard**
- **Image Upload and Processing**

## 📊 Models Supported

1. **Low-level Encoding** - HOG features
2. **High-level Encoding** - dlib facial landmarks  
3. **Pretrained Encoding** - ResNet18 features

## 🛠 Technology Stack

- **Frontend**: React, TailwindCSS, Chart.js
- **Backend**: Node.js, Express, Python Flask
- **Database**: SQLite, MySQL integration
- **ML**: scikit-learn, OpenCV, dlib, PyTorch
- **Processing**: Apache Spark (server-side)

## 📖 Documentation

Detailed documentation is available in the `docs/` folder:
- Setup instructions
- Live prediction configuration
- Demo images setup
- API documentation

## 🎯 CS179G Integration

This project integrates with the CS179G server environment for:
- Real model processing
- Spark-based data analysis
- MySQL database connectivity
- Production-ready deployment

## 👥 Team Members

- **Kush Momaya** (kmoma001) - Encoding/Multithreading
- **Mario Bertumen** (mbert015) - Data Collection/Spark
- **Rushi Patel** (rpate213) - MLlib/Compression/Web Interface
- **Suryateja Duvvuri** (sduvv003) - SQL/OpenCV/ResNet18
- **Rakshan Rajesh Jagadeesan** (rraje008) - Bias Analysis/Preprocessing

---

For detailed setup instructions, please refer to the documentation in the `docs/` folder.
