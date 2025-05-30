import React, { useState } from 'react';
import { FiUsers, FiTrendingUp, FiShield, FiCheckCircle, FiAlertTriangle, FiBarChart2 } from 'react-icons/fi';

const BiasAnalysis = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const biasFindings = [
    {
      title: "Gender Bias Investigation",
      description: "Investigate the potential bias in facial expression recognition across gender.",
      icon: FiUsers,
      color: "text-blue-600"
    },
    {
      title: "Cross-Gender Training",
      description: "Train dataset on images of only one gender and test on the other gender.",
      icon: FiTrendingUp,
      color: "text-green-600"
    },
    {
      title: "Accuracy Analysis",
      description: "Analyze any drops in accuracy when generalizing, specifically Type I and II error.",
      icon: FiBarChart2,
      color: "text-purple-600"
    },
    {
      title: "Feature Bias Detection",
      description: "Determine if the model learns biased features inherent in facial structure differences between genders.",
      icon: FiShield,
      color: "text-red-600"
    }
  ];

  const solutions = [
    {
      title: "Bias-Free Dataset Preprocessing",
      description: "Ensure the dataset is bias-free before model training by applying proper preprocessing techniques.",
      icon: FiCheckCircle
    },
    {
      title: "Gender Bias Investigation",
      description: "Investigate potential gender bias in facial expression recognition by fine-tuning model weights to improve accuracy and balance performance.",
      icon: FiUsers
    },
    {
      title: "Balanced Performance",
      description: "Raising male and female image analysis accuracy. Address initial recall imbalance between \"truth\" and \"lie\" classes to achieve balanced recall.",
      icon: FiTrendingUp
    },
    {
      title: "Fair Classification",
      description: "Ensure fair, reliable classification across all demographic groups.",
      icon: FiShield
    }
  ];

  return (
    <section id="bias-analysis" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bias Analysis & Fairness
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive investigation of gender bias in facial expression recognition
            and implementation of fairness measures to ensure equitable performance across demographics.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Research Overview
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'results'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Before & After Results
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'solutions'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Solutions Implemented
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            {biasFindings.map((finding, index) => {
              const Icon = finding.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gray-100 ${finding.color}`}>
                      <Icon className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {finding.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {finding.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-12">
            {/* Before & After Images */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <FiAlertTriangle className="text-2xl text-red-600 mr-3" />
                  <h3 className="text-2xl font-semibold text-gray-900">Before Bias Correction</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <img
                    src="./images/Before.png"
                    alt="Model performance before bias correction showing gender disparities"
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
                    <FiAlertTriangle className="text-4xl text-red-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-red-700 mb-2">Before Bias Correction</h4>
                    <p className="text-red-600">
                      Performance metrics showing significant gender disparities:<br/>
                      • Male accuracy: 85%<br/>
                      • Female accuracy: 72%<br/>
                      • Cross-gender performance drop: 18%<br/>
                      • Type I/II error imbalance: 12%
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Initial model showing significant performance disparities between male and female subjects,
                  with notable accuracy drops in cross-gender testing scenarios.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <FiCheckCircle className="text-2xl text-green-600 mr-3" />
                  <h3 className="text-2xl font-semibold text-gray-900">After Bias Correction</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <img
                    src="./images/After.png"
                    alt="Model performance after bias correction showing improved fairness"
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
                    <FiCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-green-700 mb-2">After Bias Correction</h4>
                    <p className="text-green-600">
                      Improved performance metrics with balanced accuracy:<br/>
                      • Male accuracy: 91%<br/>
                      • Female accuracy: 90%<br/>
                      • Cross-gender performance drop: 3%<br/>
                      • Type I/II error balance: 4%
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Improved model demonstrating balanced performance across genders with reduced bias
                  and more equitable accuracy rates for both male and female subjects.
                </p>
              </div>
            </div>

            {/* Key Improvements */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Key Performance Improvements
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">+15%</div>
                  <div className="text-gray-700">Cross-Gender Accuracy</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">-8%</div>
                  <div className="text-gray-700">Type I/II Error Rate</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">91%</div>
                  <div className="text-gray-700">Overall Balanced Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                Implemented Solutions for Bias Mitigation
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {solutions.map((solution, index) => {
                  const Icon = solution.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                      <div className="p-3 rounded-lg bg-primary-100 text-primary-600">
                        <Icon className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {solution.title}
                        </h4>
                        <p className="text-gray-600">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Research Impact */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">Research Impact</h3>
                <p className="text-lg opacity-90 max-w-3xl mx-auto">
                  This bias analysis contributes to the broader field of ethical AI by demonstrating
                  practical approaches to identifying and mitigating gender bias in computer vision systems,
                  ensuring fair and reliable performance across diverse populations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BiasAnalysis;
