import React, { useState } from 'react';
import { FiExternalLink, FiUser, FiFolder, FiImage } from 'react-icons/fi';
import { projectData } from '../../data/projectData';

const AboutDataset = () => {
  const [selectedImage, setSelectedImage] = useState('truth');
  const { dataset } = projectData;

  return (
    <section id="dataset" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            About the Dataset
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our research utilizes a comprehensive dataset of micro-expressions
            for lie detection, featuring carefully labeled facial expressions
            from controlled experimental conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Dataset Information */}
          <div className="space-y-8">
            {/* Source Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiExternalLink className="mr-2 text-primary-500" />
                Data Source
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Platform:</span>
                  <a
                    href={dataset.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary-600 hover:text-primary-700 underline"
                  >
                    {dataset.source.platform}
                  </a>
                </div>
                <div className="flex items-center">
                  <FiUser className="mr-2 text-gray-500" />
                  <span className="font-medium text-gray-700">Creator:</span>
                  <span className="ml-2 text-gray-600">{dataset.source.creator}</span>
                </div>
              </div>
            </div>

            {/* Creation Process */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Dataset Creation Process
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-gray-700">{dataset.creation.method}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-gray-700">{dataset.creation.recording}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-gray-700">{dataset.creation.processing}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* File Structure */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiFolder className="mr-2 text-primary-500" />
                File Structure
              </h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
                <div>📁 dataset/</div>
                {dataset.creation.structure.folders.map((folder, index) => (
                  <div key={index} className="ml-4">
                    📁 {folder}
                    <div className="ml-4 text-gray-400">
                      🖼️ {dataset.creation.structure.fileFormat}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Images */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiImage className="mr-2 text-primary-500" />
                Demo Images
              </h3>

              {/* Image Toggle Buttons */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setSelectedImage('truth')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedImage === 'truth'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Truth
                </button>
                <button
                  onClick={() => setSelectedImage('lie')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedImage === 'lie'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Lie
                </button>
              </div>

              {/* Image Display */}
              <div className="relative">
                <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  {/* Actual demo images */}
                  <img
                    src={selectedImage === 'truth' ? '/images/truth_demo.png' : '/images/lie_demo.png'}
                    alt={selectedImage === 'truth' ? 'Truthful Expression Demo' : 'Deceptive Expression Demo'}
                    className="w-full h-full object-contain rounded-lg bg-white"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback placeholder */}
                  <div className="hidden items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <FiImage className="mx-auto text-4xl text-gray-400 mb-2" />
                      <p className="text-gray-500 font-medium">
                        Demo Image: {selectedImage === 'truth' ? 'Truthful Expression' : 'Deceptive Expression'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        (Please add {selectedImage}_demo.png to /public/images/)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Label */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white font-medium ${
                  selectedImage === 'truth' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {selectedImage === 'truth' ? 'Truth' : 'Lie'}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium mb-2">Key Differences:</p>
                <ul className="space-y-1">
                  <li>• Micro-expressions duration: 1/25 to 1/5 of a second</li>
                  <li>• Truthful: More natural facial muscle movement</li>
                  <li>• Deceptive: Subtle tension in forehead and eye regions</li>
                  <li>• Detection requires frame-by-frame analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDataset;
