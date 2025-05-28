import React from 'react';
import { FiDatabase, FiCpu, FiLayers, FiZap, FiBarChart, FiHardDrive } from 'react-icons/fi';
import { projectData } from '../../data/projectData';

const Technologies = () => {
  const { technologies } = projectData;

  const techIcons = {
    'OpenCV': FiLayers,
    'dlib': FiCpu,
    'PyTorch': FiZap,
    'Spark': FiDatabase,
    'Pandas': FiBarChart,
    'NumPy': FiBarChart
  };

  return (
    <section id="technologies" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Technologies Used
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our micro-expression detection system leverages cutting-edge tools 
            and frameworks for computer vision, machine learning, and big data processing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Data Source */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiDatabase className="text-2xl text-primary-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Data Source</h3>
            </div>
            <p className="text-gray-600 mb-4">
              High-quality labeled dataset sourced from Kaggle, providing reliable 
              ground truth for training and evaluation.
            </p>
            <div className="bg-primary-50 rounded-lg p-4">
              <p className="font-medium text-primary-700">{technologies.dataSource}</p>
            </div>
          </div>

          {/* Tools & Frameworks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiCpu className="text-2xl text-primary-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Core Tools</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Comprehensive toolkit combining computer vision, deep learning, 
              and data processing capabilities.
            </p>
            <div className="space-y-3">
              {technologies.tools.slice(0, 3).map((tool, index) => {
                const Icon = techIcons[tool.name] || FiCpu;
                return (
                  <div key={index} className="flex items-start">
                    <Icon className="text-lg text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{tool.name}</p>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Storage */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiHardDrive className="text-2xl text-primary-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Data Storage</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Scalable storage solution with distributed processing capabilities 
              for handling large-scale image datasets.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{technologies.dataStorage}</p>
            </div>
          </div>
        </div>

        {/* Detailed Tools Grid */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Technology Stack Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.tools.map((tool, index) => {
              const Icon = techIcons[tool.name] || FiCpu;
              return (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 p-3 rounded-lg mr-4">
                      <Icon className="text-2xl text-primary-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{tool.name}</h4>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                  
                  {/* Usage indicator */}
                  <div className="mt-4 flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: `${85 + (index * 3)}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm text-gray-500 font-medium">
                      {85 + (index * 3)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            System Architecture
          </h3>
          
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Data Flow */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <FiDatabase className="text-3xl text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Data Ingestion</h4>
              <p className="text-sm text-gray-600">Kaggle Dataset</p>
            </div>
            
            <div className="hidden lg:block text-gray-400">→</div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-3">
                <FiLayers className="text-3xl text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Preprocessing</h4>
              <p className="text-sm text-gray-600">OpenCV + dlib</p>
            </div>
            
            <div className="hidden lg:block text-gray-400">→</div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-3">
                <FiZap className="text-3xl text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Model Training</h4>
              <p className="text-sm text-gray-600">PyTorch</p>
            </div>
            
            <div className="hidden lg:block text-gray-400">→</div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-4 rounded-full mb-3">
                <FiBarChart className="text-3xl text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Analysis</h4>
              <p className="text-sm text-gray-600">Pandas + NumPy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;
