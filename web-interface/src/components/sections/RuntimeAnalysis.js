import React, { useState } from 'react';
import { FiClock, FiCpu, FiZap, FiBarChart2 } from 'react-icons/fi';
import Chart from '../ui/Chart';
import { projectData } from '../../data/projectData';

const RuntimeAnalysis = () => {
  const { runtime } = projectData;
  const [activeChart, setActiveChart] = useState('encoding');

  const encodingChartData = {
    labels: runtime.chartData.encodingLabels,
    datasets: [{
      label: 'Processing Time (seconds per image)',
      data: runtime.chartData.encodingTimes,
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
      ],
    }]
  };

  const sparkChartData = {
    labels: runtime.chartData.sparkLabels,
    datasets: [{
      label: 'Processing Time (minutes)',
      data: runtime.chartData.sparkTimes,
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
      ],
    }]
  };

  return (
    <section id="runtime" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Runtime Analysis
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Performance metrics and timing analysis across different processing
            stages, encoding methods, and parallelization strategies.
          </p>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiZap className="text-2xl text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Fastest Encoding</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {runtime.encoding.lowLevel.time}
            </div>
            <p className="text-sm text-gray-600">{runtime.encoding.lowLevel.description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiCpu className="text-2xl text-green-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Best Balance</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {runtime.encoding.highLevel.time}
            </div>
            <p className="text-sm text-gray-600">{runtime.encoding.highLevel.description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiBarChart2 className="text-2xl text-orange-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Highest Accuracy</h3>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {runtime.encoding.pretrained.time}
            </div>
            <p className="text-sm text-gray-600">{runtime.encoding.pretrained.description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiClock className="text-2xl text-purple-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Optimal Parallel</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {runtime.sparkWorkers.eight.time}
            </div>
            <p className="text-sm text-gray-600">{runtime.sparkWorkers.eight.description}</p>
          </div>
        </div>

        {/* Interactive Charts */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
              Performance Comparison
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveChart('encoding')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeChart === 'encoding'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Encoding Methods
              </button>
              <button
                onClick={() => setActiveChart('spark')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeChart === 'spark'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Spark Workers
              </button>
            </div>
          </div>

          <div className="h-80">
            {activeChart === 'encoding' ? (
              <Chart
                type="bar"
                data={encodingChartData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'Processing Time by Encoding Method'
                    }
                  },
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: 'Time (seconds per image)'
                      }
                    }
                  }
                }}
              />
            ) : (
              <Chart
                type="bar"
                data={sparkChartData}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'Processing Time by Number of Spark Workers'
                    }
                  },
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: 'Time (minutes)'
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Detailed Timing Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Encoding Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Encoding Performance Details
            </h3>
            <div className="space-y-4">
              {Object.entries(runtime.encoding).map(([key, value]) => (
                <div key={key} className="border-l-4 border-primary-500 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()} Encoding
                    </h4>
                    <span className="text-lg font-bold text-primary-600">
                      {value.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Parallelization Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Spark Parallelization Impact
            </h3>
            <div className="space-y-4">
              {Object.entries(runtime.sparkWorkers).map(([key, value]) => (
                <div key={key} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()} Worker{key !== 'single' ? 's' : ''}
                    </h4>
                    <span className="text-lg font-bold text-green-600">
                      {value.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Special Tasks */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Special Task Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(runtime.specialTasks).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {value}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: key === 'featureImportance' ? '75%' : '25%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-primary-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-primary-800 mb-4">
            Key Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <FiZap className="text-primary-600 text-xl mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-primary-800">Speed vs Accuracy Trade-off</h4>
                <p className="text-primary-700 text-sm">
                  HOG encoding is 7.6x faster than ResNet18 but with 16% lower accuracy
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FiCpu className="text-primary-600 text-xl mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-primary-800">Optimal Parallelization</h4>
                <p className="text-primary-700 text-sm">
                  8 Spark workers provide 6.4x speedup with diminishing returns beyond this point
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RuntimeAnalysis;
