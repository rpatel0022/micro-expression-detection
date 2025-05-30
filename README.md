# Micro-Expression Detection for Lie Detection

A comprehensive web-based interface for micro-expression detection using advanced computer vision and machine learning techniques to identify deceptive behavior in facial expressions with 91% accuracy.

## 🎯 Features

- **🎥 Live Detection**: Real-time facial expression analysis with webcam integration
- **📊 Database Interface**: Browse and analyze stored expression data with comprehensive metrics
- **📈 Dataset Information**: Detailed overview of training dataset and file structure
- **🛡️ Bias Analysis**: Gender bias investigation and fairness measures implementation
- **⚙️ Technology Stack**: Modern React-based interface with responsive design

## 🚀 Quick Start

### Option 1: Direct Access (Recommended)

1. Open `index.html` in your web browser
2. Navigate through sections using the navigation bar
3. Try live prediction, browse database, and explore bias analysis

### Option 2: Development Server

```bash
cd web-interface
npm install
npm start
```

## 📁 Project Structure

```
micro-expression-detection/
├── index.html              # Main entry point
├── images/                 # Demo images and research visualizations
│   ├── Before.png         # Pre-bias correction results
│   ├── After.png          # Post-bias correction results
│   └── ...
├── static/                # Production build files
├── web-interface/         # React development source
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/
│   │   │   │   ├── LivePrediction.js
│   │   │   │   ├── DatabaseInterface.js
│   │   │   │   ├── BiasAnalysis.js
│   │   │   │   └── ...
│   │   └── ...
├── docs/                  # Documentation
└── data_base_file.json   # Sample dataset
```

## 🔬 Research Highlights

### Bias Analysis & Fairness

- **Gender Bias Investigation**: Comprehensive analysis of performance across demographics
- **Cross-Gender Training**: Testing model generalization capabilities
- **Performance Improvements**:
  - +15% Cross-Gender Accuracy
  - -8% Type I/II Error Rate
  - 91% Overall Balanced Accuracy

### Technical Achievements

- 91% accuracy in micro-expression detection
- Real-time processing capabilities
- Bias-corrected model ensuring fair performance across genders
- Comprehensive dataset with multiple facial expression categories

## 🛠️ Technologies Used

- **Frontend**: React.js, TailwindCSS, Chart.js
- **Backend**: Node.js, Express.js
- **Computer Vision**: Advanced ML models for facial analysis
- **Data Visualization**: Interactive charts and metrics display
- **Responsive Design**: Mobile-friendly interface

## 📊 Dataset

The project includes a comprehensive dataset with:

- Multiple subjects across different demographics
- Various facial expressions and micro-expressions
- Truth/lie classification labels
- Performance metrics and confidence scores

## 🔧 Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Setup

```bash
# Clone the repository
git clone [repository-url]
cd micro-expression-detection

# Install dependencies
cd web-interface
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Available Scripts

- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run test suite

## 📈 Performance Metrics

- **Overall Accuracy**: 91%
- **Cross-Gender Performance**: Balanced across demographics
- **Real-time Processing**: < 100ms response time
- **Bias Reduction**: Significant improvement in fairness metrics

## 🤝 Contributing

This project represents academic research in ethical AI and bias mitigation in computer vision systems. Contributions to improve fairness and accuracy are welcome.

## 📄 License

This project is part of academic research. Please cite appropriately if used in academic work.

## 🎓 Academic Context

Developed as part of CS179G coursework, focusing on:

- Ethical AI development
- Bias detection and mitigation
- Computer vision applications
- Human-computer interaction design
