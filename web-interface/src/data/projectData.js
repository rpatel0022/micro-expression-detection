// CS179G Project Data - Mock data for demonstration
export const projectData = {
  dataset: {
    name: "CS179G Micro-Expression Dataset",
    description: "Custom dataset for truthfulness detection using facial micro-expressions",
    totalImages: 1247,
    subjects: 25,
    truthfulImages: 623,
    deceptiveImages: 624,
    imageFormat: "JPEG",
    resolution: "640x480",
    sampleImages: {
      truth: "/micro-expression-detection/images/truth_demo.png",
      lie: "/micro-expression-detection/images/lie_demo.png"
    },
    statistics: {
      avgConfidence: 0.84,
      processingTime: 2.1,
      accuracy: 0.87
    },
    source: {
      url: "https://github.com/cs179g-team/micro-expression-detection",
      platform: "GitHub Repository",
      creator: "CS179G Team"
    },
    creation: {
      method: "Participants were asked to tell truths and lies while being recorded in controlled conditions",
      recording: "High-resolution video capture at 30fps with consistent lighting and background",
      processing: "Frame extraction and facial region cropping using automated detection algorithms",
      structure: {
        folders: ["truth/", "lie/"],
        fileFormat: "*.jpg (640x480 resolution)"
      }
    }
  },

  technologies: {
    dataSource: "Kaggle Micro-Expression Dataset",
    encoding: [
      {
        name: "HOG (Histogram of Oriented Gradients)",
        description: "Low-level feature extraction for facial patterns",
        accuracy: 0.82,
        speed: "Fast"
      },
      {
        name: "dlib Facial Landmarks",
        description: "68-point facial landmark detection",
        accuracy: 0.85,
        speed: "Medium"
      },
      {
        name: "ResNet18",
        description: "Deep learning feature extraction",
        accuracy: 0.89,
        speed: "Slow"
      }
    ],
    classifiers: [
      {
        name: "Random Forest",
        description: "Ensemble learning method",
        accuracy: 0.87,
        speed: "Fast"
      },
      {
        name: "Decision Tree",
        description: "Tree-based classification",
        accuracy: 0.83,
        speed: "Very Fast"
      }
    ],
    tools: [
      {
        name: "OpenCV",
        purpose: "Computer vision and image processing",
        version: "4.5.0"
      },
      {
        name: "PyTorch",
        purpose: "Deep learning framework",
        version: "1.9.0"
      },
      {
        name: "Apache Spark",
        purpose: "Distributed data processing",
        version: "3.2.0"
      }
    ]
  },

  findings: [
    {
      id: 1,
      title: "Feature Importance Analysis",
      summary: "Eye region features show highest importance for deception detection",
      details: "Analysis of 1247 facial images revealed that features around the eye region contribute 45% to classification accuracy.",
      chartData: {
        labels: ["Eye Region", "Mouth", "Nose", "Forehead", "Cheeks"],
        values: [45, 25, 15, 10, 5]
      }
    },
    {
      id: 2,
      title: "Encoding Method Comparison",
      summary: "ResNet18 achieves highest accuracy but with increased processing time",
      details: "ResNet18 deep features achieved 89% accuracy compared to 85% for dlib and 82% for HOG.",
      chartData: {
        labels: ["HOG", "dlib", "ResNet18"],
        accuracy: [82, 85, 89],
        speed: [95, 75, 45]
      }
    },
    {
      id: 3,
      title: "Model Performance Metrics",
      summary: "Random Forest classifier outperforms Decision Tree across all encoding methods",
      details: "Random Forest achieved 87% average accuracy compared to 83% for Decision Tree.",
      chartData: {
        labels: ["Random Forest", "Decision Tree"],
        accuracy: [87, 83],
        precision: [0.88, 0.84],
        recall: [0.86, 0.82]
      }
    }
  ],

  runtime: {
    description: "Performance analysis of different encoding methods and distributed processing",
    encoding: {
      lowLevel: {
        time: "0.8s",
        description: "HOG features - fastest processing for real-time applications"
      },
      pretrained: {
        time: "1.5s",
        description: "dlib landmarks - balanced speed and accuracy"
      },
      highLevel: {
        time: "3.2s",
        description: "ResNet18 features - highest accuracy but slower processing"
      }
    },
    sparkWorkers: {
      single: {
        time: "45 min",
        description: "Single worker processing - baseline performance"
      },
      dual: {
        time: "25 min",
        description: "2 workers - 44% improvement in processing time"
      },
      quad: {
        time: "15 min",
        description: "4 workers - 67% improvement, optimal for our dataset size"
      },
      eight: {
        time: "7 min",
        description: "8 workers - 84% improvement, optimal parallelization point"
      }
    },
    specialTasks: {
      featureImportance: "12.3 min",
      modelTraining: "8.7 min",
      crossValidation: "15.2 min",
      hyperparameterTuning: "23.1 min"
    },
    chartData: {
      encodingLabels: ["HOG", "dlib", "ResNet18"],
      encodingTimes: [0.8, 1.5, 3.2],
      sparkLabels: ["1 Worker", "2 Workers", "4 Workers", "8 Workers"],
      sparkTimes: [45, 25, 15, 7]
    },
    insights: [
      "HOG encoding is 4x faster than ResNet18",
      "Spark distributed processing reduces time by 67%",
      "Memory usage scales linearly with batch size"
    ]
  }
};
