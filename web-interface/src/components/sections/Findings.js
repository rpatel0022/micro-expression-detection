import React, { useState } from 'react';
import { FiEye, FiLayers, FiTrendingUp, FiMinimize2, FiUsers } from 'react-icons/fi';
import CollapsibleSection from '../ui/CollapsibleSection';
import Chart from '../ui/Chart';
import { projectData } from '../../data/projectData';

const Findings = () => {
  const { findings } = projectData;
  const [activeView, setActiveView] = useState({});

  const findingIcons = {
    1: FiEye,
    2: FiLayers,
    3: FiTrendingUp,
    4: FiMinimize2,
    5: FiUsers
  };

  const toggleView = (findingId, viewType) => {
    setActiveView(prev => ({
      ...prev,
      [findingId]: prev[findingId] === viewType ? 'summary' : viewType
    }));
  };

  const getChartData = (finding) => {
    switch (finding.id) {
      case 1: // Feature Importance
        return {
          labels: finding.chartData.labels,
          datasets: [{
            label: 'Feature Importance (%)',
            data: finding.chartData.values,
          }]
        };
      case 2: // Encoding Comparison
        return {
          labels: finding.chartData.labels,
          datasets: [
            {
              label: 'Accuracy (%)',
              data: finding.chartData.accuracy,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
              label: 'Speed Score',
              data: finding.chartData.speed,
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
            }
          ]
        };
      case 3: // Model Comparison
        return {
          labels: finding.chartData.labels,
          datasets: [
            {
              label: 'Accuracy (%)',
              data: finding.chartData.accuracy,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
              label: 'Precision (%)',
              data: finding.chartData.precision,
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
            },
            {
              label: 'Recall (%)',
              data: finding.chartData.recall,
              backgroundColor: 'rgba(245, 158, 11, 0.8)',
            }
          ]
        };
      case 4: // Compression Impact
        return {
          labels: finding.chartData.labels,
          datasets: [
            {
              label: 'Accuracy (%)',
              data: finding.chartData.accuracy,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
              label: 'Storage Size (%)',
              data: finding.chartData.storageSize,
              backgroundColor: 'rgba(239, 68, 68, 0.8)',
            }
          ]
        };
      case 5: // Gender Bias
        return {
          labels: finding.chartData.labels,
          datasets: [{
            label: 'Accuracy (%)',
            data: finding.chartData.accuracy,
          }]
        };
      default:
        return { labels: [], datasets: [] };
    }
  };

  return (
    <section id="findings" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Research Findings
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive analysis reveals key insights into micro-expression
            detection, feature importance, model performance, and potential biases.
          </p>
        </div>

        <div className="space-y-6">
          {findings.map((finding) => {
            const Icon = findingIcons[finding.id];
            const currentView = activeView[finding.id] || 'summary';

            return (
              <CollapsibleSection
                key={finding.id}
                title={`${finding.id}. ${finding.title}`}
                defaultOpen={finding.id === 1}
                className="shadow-md"
              >
                <div className="space-y-6">
                  {/* Key Finding Highlight */}
                  <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <Icon className="text-primary-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-primary-800 mb-1">Key Finding</h4>
                        <p className="text-primary-700">{finding.keyFinding}</p>
                      </div>
                    </div>
                  </div>

                  {/* View Toggle Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleView(finding.id, 'summary')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        currentView === 'summary'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => toggleView(finding.id, 'details')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        currentView === 'details'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => toggleView(finding.id, 'metrics')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        currentView === 'metrics'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Metrics
                    </button>
                    <button
                      onClick={() => toggleView(finding.id, 'chart')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        currentView === 'chart'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Visualization
                    </button>
                  </div>

                  {/* Content Display */}
                  <div className="min-h-[200px]">
                    {currentView === 'summary' && (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {finding.summary}
                        </p>
                      </div>
                    )}

                    {currentView === 'details' && (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Detailed Analysis</h4>
                        <ul className="space-y-3">
                          {finding.details.map((detail, index) => (
                            <li key={index} className="flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentView === 'metrics' && (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(finding.metrics).map(([key, value]) => (
                            <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-sm text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="text-2xl font-bold text-gray-900 mt-1">
                                {typeof value === 'object' ? (
                                  <div className="space-y-1">
                                    {Object.entries(value).map(([subKey, subValue]) => (
                                      <div key={subKey} className="text-sm">
                                        <span className="text-gray-600">{subKey}:</span>
                                        <span className="ml-1 font-semibold">{subValue}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  value
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentView === 'chart' && (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Data Visualization</h4>
                        <Chart
                          type="bar"
                          data={getChartData(finding)}
                          className="h-80"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Findings;
