import React, { useState, useEffect, useCallback } from 'react';
import { FiDownload, FiFilter, FiRefreshCw, FiDatabase, FiSearch } from 'react-icons/fi';

const DatabaseInterface = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(25);
  const [filters, setFilters] = useState({
    prediction: '',
    encoding_method: '',
    model_type: '',
    min_confidence: '',
    max_confidence: ''
  });
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load data directly from JSON file
      const response = await fetch('/data_base_file.json');
      const rawData = await response.json();

      // Transform the raw data to include all available fields
      const transformedRecords = rawData.map((record, index) => ({
        id: index + 1,
        filename: record.path ? record.path.split('/').pop() : 'unknown.jpg',
        prediction: record.prediction === 'truth' ? 'Truthful' : 'Deceptive',
        confidence: record.confidence_score,
        encoding_method: record.encoding_type,
        model_type: record.model_type,
        region_importance: record.region_importance,
        confidence_based_accuracy: record.confidence_based_accuracy,
        image_accuracy_original: record.image_accuracy_original,
        image_accuracy_lower_quality: record.image_accuracy_lower_quality,
        performance_score: record.performance_score,
        processing_time: (record.performance_score * 5).toFixed(1),
        created_at: new Date().toISOString()
      }));

      // Apply filters
      let filteredRecords = transformedRecords;

      if (filters.prediction) {
        filteredRecords = filteredRecords.filter(record =>
          record.prediction.toLowerCase().includes(filters.prediction.toLowerCase())
        );
      }

      if (filters.encoding_method) {
        filteredRecords = filteredRecords.filter(record =>
          record.encoding_method === filters.encoding_method
        );
      }

      if (filters.model_type) {
        filteredRecords = filteredRecords.filter(record =>
          record.model_type === filters.model_type
        );
      }

      if (filters.min_confidence) {
        filteredRecords = filteredRecords.filter(record =>
          record.confidence >= parseFloat(filters.min_confidence)
        );
      }

      if (filters.max_confidence) {
        filteredRecords = filteredRecords.filter(record =>
          record.confidence <= parseFloat(filters.max_confidence)
        );
      }

      // Store all filtered records for pagination
      setAllRecords(filteredRecords);

      // Reset to first page when filters change
      setCurrentPage(1);

      // Calculate statistics
      const totalRecords = rawData.length;
      const truthfulCount = rawData.filter(r => r.prediction === 'truth').length;
      const deceptiveCount = rawData.filter(r => r.prediction === 'lie').length;
      const avgConfidence = rawData.reduce((sum, r) => sum + r.confidence_score, 0) / rawData.length;

      const calculatedStats = {
        total_records: totalRecords,
        truthful_count: truthfulCount,
        deceptive_count: deceptiveCount,
        avg_confidence: avgConfidence
      };

      setStats(calculatedStats);

    } catch (err) {
      console.error('Error loading database data:', err);
      setError('Failed to load database data from JSON file');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    setDisplayedRecords(allRecords.slice(startIndex, endIndex));
  }, [allRecords, currentPage, recordsPerPage]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadData();
  };

  const resetFilters = () => {
    setFilters({
      prediction: '',
      encoding_method: '',
      model_type: '',
      min_confidence: '',
      max_confidence: ''
    });
    setCurrentPage(1);
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      downloadCSV();
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download CSV');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      'id,filename,prediction,confidence,encoding_method,model_type,region_importance,confidence_based_accuracy,image_accuracy_original,image_accuracy_lower_quality,performance_score,processing_time,created_at',
      ...allRecords.map(record =>
        `${record.id},"${record.filename}","${record.prediction}",${record.confidence},"${record.encoding_method}","${record.model_type}","${record.region_importance}","${record.confidence_based_accuracy}",${record.image_accuracy_original},${record.image_accuracy_lower_quality},${record.performance_score},${record.processing_time},"${record.created_at}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'micro_expressions_data.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const getPredictionColor = (prediction) => {
    return prediction === 'Truthful' ? 'text-green-600' : 'text-red-600';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <section id="database" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Database Interface
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse and analyze the micro-expression detection results stored in our database.
            Filter, search, and download data for further analysis.
          </p>
        </div>



        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FiDatabase className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_records}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">T</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Truthful</p>
                  <p className="text-2xl font-bold text-green-600">{stats.truthful_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">D</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Deceptive</p>
                  <p className="text-2xl font-bold text-red-600">{stats.deceptive_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">%</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Confidence</p>
                  <p className="text-2xl font-bold text-purple-600">{(stats.avg_confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiFilter className="mr-2" />
              Filters
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={applyFilters}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
              >
                <FiSearch className="mr-2" />
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center"
              >
                <FiRefreshCw className="mr-2" />
                Reset
              </button>
              <button
                onClick={handleDownload}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center"
              >
                <FiDownload className="mr-2" />
                Download CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prediction</label>
              <select
                value={filters.prediction}
                onChange={(e) => handleFilterChange('prediction', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All</option>
                <option value="Truthful">Truthful</option>
                <option value="Deceptive">Deceptive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Encoding Method</label>
              <select
                value={filters.encoding_method}
                onChange={(e) => handleFilterChange('encoding_method', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All</option>
                <option value="low_level">Low Level</option>
                <option value="high_level">High Level</option>
                <option value="pretrained">Pretrained</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Type</label>
              <select
                value={filters.model_type}
                onChange={(e) => handleFilterChange('model_type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All</option>
                <option value="Random Forest">Random Forest</option>
                <option value="Decision Tree">Decision Tree</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Confidence</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={filters.min_confidence}
                onChange={(e) => handleFilterChange('min_confidence', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Confidence</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={filters.max_confidence}
                onChange={(e) => handleFilterChange('max_confidence', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="1.0"
              />
            </div>


          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Database Records ({allRecords.length} total, showing {displayedRecords.length} on page {currentPage})
            </h3>
            <div className="text-sm text-gray-500">
              {allRecords.length > 0 && (
                <>
                  Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, allRecords.length)} of {allRecords.length} records
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <FiRefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Loading database records...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prediction
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Encoding
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model Type
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region Importance
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence Accuracy
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original Accuracy
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lower Quality Accuracy
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance Score
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.id}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="h-6 w-6 bg-gray-200 rounded mr-2 flex items-center justify-center text-xs">
                            📷
                          </div>
                          <span className="truncate max-w-32">{record.filename}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPredictionColor(record.prediction)}`}>
                          {record.prediction}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getConfidenceColor(record.confidence)}`}>
                          {(record.confidence * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.encoding_method}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.model_type}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="truncate max-w-24">{record.region_importance}</span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="truncate max-w-32">{record.confidence_based_accuracy}</span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(record.image_accuracy_original * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(record.image_accuracy_lower_quality * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.performance_score.toFixed(3)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {allRecords.length > recordsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {Math.ceil(allRecords.length / recordsPerPage)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.ceil(allRecords.length / recordsPerPage) }, (_, i) => i + 1)
                  .filter(page => {
                    const totalPages = Math.ceil(allRecords.length / recordsPerPage);
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (page >= currentPage - 2 && page <= currentPage + 2) return true;
                    return false;
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(allRecords.length / recordsPerPage)))}
                  disabled={currentPage === Math.ceil(allRecords.length / recordsPerPage)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DatabaseInterface;
