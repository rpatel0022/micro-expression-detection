# Micro-Expression Detection for Lie Detection

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-blue?style=for-the-badge&logo=github)](https://your-username.github.io/micro-expression-detection)
[![CS179G](https://img.shields.io/badge/Course-CS179G-green?style=for-the-badge)](https://www.cs.ucr.edu/)
[![UC Riverside](https://img.shields.io/badge/University-UC%20Riverside-gold?style=for-the-badge)](https://www.ucr.edu/)

## 🎯 Project Overview

Advanced computer vision and machine learning research project that detects deceptive micro-expressions in facial video data with **91% accuracy**. This comprehensive web interface demonstrates our CS179G Group 3 research findings, methodologies, and interactive code demonstrations.

## 🌟 Key Features

- **Interactive Code Demonstrations** with pre-computed results
- **Advanced Analysis** including compression tradeoffs and bias evaluation
- **Colorful Progress Bars** showing feature importance
- **Responsive Design** optimized for all devices
- **Professional Presentation** of research findings

## 🔬 Research Highlights

### 📊 Model Performance

- **Random Forest**: 91% accuracy (best performer)
- **Logistic Regression**: 85% accuracy
- **Decision Tree**: 82% accuracy

### 🎯 Feature Importance Analysis

- **Forehead**: 85% importance (most critical for lie detection)
- **Eyes**: 72% importance
- **Mouth**: 68% importance
- **Nose**: 45% importance

### 🔍 Encoding Methods Comparison

- **ResNet18**: 94% accuracy (slow processing)
- **dlib Landmarks**: 91% accuracy (best balance)
- **HOG**: 78% accuracy (fast processing)

## 🛠️ Technologies Used

- **Computer Vision**: OpenCV, dlib
- **Machine Learning**: PyTorch, scikit-learn, Spark MLlib
- **Deep Learning**: ResNet18 (pretrained)
- **Big Data**: Apache Spark, MySQL, SQLite3
- **Data Processing**: Pandas, NumPy
- **Web Interface**: React, Tailwind CSS, HTML5

## 📁 Project Structure

```
micro-expression-detection/
├── index.html          # Main web interface
├── README.md          # Project documentation
└── assets/            # Additional resources (if any)
```

## 🚀 Live Demo

Visit our live demonstration: **[Micro-Expression Detection Demo](https://your-username.github.io/micro-expression-detection)**

## 📖 How to Use

1. **Navigate through sections** using the top navigation menu
2. **Explore Interactive Results** by clicking "Run Code" buttons
3. **Expand Advanced Analysis** sections for detailed insights
4. **View Team Contributions** to understand individual roles

## 🔧 Local Development

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/micro-expression-detection.git

# Navigate to project directory
cd micro-expression-detection

# Open in browser
open index.html
# or
python -m http.server 8000  # Then visit http://localhost:8000
```

## 📊 Dataset Information

- **Source**: [Kaggle - Micro-Expression Detection](https://www.kaggle.com/datasets/devvratmathur/micro-expression-detection)
- **Creator**: Devvrat Mathur
- **Size**: ~23,000 images
- **Method**: Subjects recorded giving truthful and deceptive responses
- **Format**: 60 FPS video frames, manually labeled

## 🧪 Research Methodology

### Data Processing Pipeline

1. **Data Collection**: Kaggle dataset with truthful/deceptive responses
2. **Feature Extraction**: Three encoding methods (HOG, dlib, ResNet18)
3. **Model Training**: Multiple classifiers with cross-validation
4. **Performance Analysis**: Accuracy, bias, and scalability evaluation

### Advanced Analysis

- **Compression vs Accuracy**: 95% → 91% with 85% storage reduction
- **Gender Bias Evaluation**: Cross-gender testing and mitigation
- **Scalability Testing**: Worker scaling analysis (1-8 workers)
- **LOOCV Validation**: Statistical significance testing

## 👥 Team Members - CS179G Group 3

| Name                          | NetID    | Role                                           | Key Contributions                                   |
| ----------------------------- | -------- | ---------------------------------------------- | --------------------------------------------------- |
| **Kush Momaya**               | kmoma001 | Implementation Research & Performance Analysis | Multi-threading performance, encoding comparison    |
| **Mario Bertumen**            | mbert015 | Data Verification & Model Comparison           | Spark DataFrames, model validation                  |
| **Rushi Patel**               | rpate213 | Model Training & Compression Analysis          | MLlib training, compression analysis, web interface |
| **Suryateja Duvvuri**         | sduvv003 | Infrastructure & Feature Engineering           | SQL/Spark setup, ResNet18 integration               |
| **Rakshan Rajesh Jagadeesan** | rraje008 | Bias Analysis & Model Fairness                 | Gender bias evaluation, fairness optimization       |

## 🏆 Key Achievements

- ✅ **91% accuracy** in lie detection using Random Forest
- ✅ **Forehead identified** as most important facial region (85% importance)
- ✅ **Gender bias mitigation** with 12% improvement through fine-tuning
- ✅ **Scalability optimization** with 4-6 workers for optimal performance
- ✅ **Storage optimization** with 85% reduction and minimal accuracy loss
- ✅ **Comprehensive web interface** for interactive demonstration

## 📚 Technical Implementation

### Infrastructure

- **Training Environment**: Google Colab (GPU support)
- **Database**: MySQL (production) + SQLite3 (development)
- **Processing**: Apache Spark for distributed computing
- **Memory Optimization**: Batch processing for large datasets

### Model Architecture

- **Feature Engineering**: 68 facial landmarks using dlib
- **Encoding Methods**: HOG, dlib landmarks, ResNet18 features
- **Classification**: Random Forest, Decision Tree, Logistic Regression
- **Validation**: Leave-One-Out Cross Validation (LOOCV)

## 🚀 GitHub Pages Deployment

This project is optimized for GitHub Pages deployment:

1. **Fork or clone** this repository
2. **Enable GitHub Pages** in repository settings
3. **Select source**: Deploy from main branch
4. **Access your demo**: `https://your-username.github.io/repository-name`

### Deployment Features

- ✅ **Static HTML** - No server required
- ✅ **CDN dependencies** - Fast loading from external CDNs
- ✅ **Responsive design** - Works on all devices
- ✅ **Professional presentation** - Ready for academic/professional use

## 📱 Browser Compatibility

- ✅ **Chrome** (recommended)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**
- ✅ **Mobile browsers**

## 📄 License

This project is part of CS179G coursework at UC Riverside. All rights reserved to the respective team members and the University of California, Riverside.

## 🙏 Acknowledgments

- **Professor**: CS179G Instructor
- **Dataset**: Devvrat Mathur (Kaggle)
- **University**: UC Riverside Computer Science Department
- **Tools**: Open source libraries and frameworks used

## 📞 Contact

For questions about this research project, please contact any of the team members through their UC Riverside email addresses.

---

**CS179G Group 3** | **University of California, Riverside** | **2024**

_This web interface showcases our comprehensive research in micro-expression detection for lie detection, featuring interactive demonstrations, advanced analysis, and professional presentation of our findings._
