import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import AboutDataset from './components/sections/AboutDataset';
import Technologies from './components/sections/Technologies';
import Findings from './components/sections/Findings';
import RuntimeAnalysis from './components/sections/RuntimeAnalysis';
import LivePrediction from './components/sections/LivePrediction';
import DatabaseInterface from './components/sections/DatabaseInterface';

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-8 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Micro-Expression Detection
              <span className="block text-primary-600">for Lie Detection</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Advanced computer vision and machine learning techniques to detect
              deceptive micro-expressions in facial video data with 91% accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('live-prediction').scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
              >
                Try Live Detection
              </button>
              <button
                onClick={() => document.getElementById('database').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors duration-200"
              >
                Browse Database
              </button>
              <button
                onClick={() => document.getElementById('findings').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
              >
                View Research
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main>
        <LivePrediction />
        <DatabaseInterface />
        <AboutDataset />
        <Technologies />
        <Findings />
        <RuntimeAnalysis />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
              <p className="text-gray-300 text-sm">
                A comprehensive study on micro-expression detection for lie detection
                using advanced computer vision and machine learning techniques.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Technologies</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• OpenCV & dlib for facial analysis</li>
                <li>• PyTorch for deep learning</li>
                <li>• Apache Spark for distributed processing</li>
                <li>• Pandas & NumPy for data analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Research Highlights</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 91% accuracy with Random Forest</li>
                <li>• Forehead region most important for detection</li>
                <li>• Gender bias analysis reveals 18% accuracy drop</li>
                <li>• Compression reduces accuracy by only 4%</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Micro-Expression Detection Research Project.
              Dataset by Devvrat Mathur via Kaggle.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
