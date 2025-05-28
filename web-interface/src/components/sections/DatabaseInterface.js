import React, { useState, useEffect, useCallback } from 'react';
import { FiDownload, FiFilter, FiRefreshCw, FiDatabase, FiSearch } from 'react-icons/fi';
import { apiService, mockData } from '../../services/api';

const DatabaseInterface = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    prediction: '',
    encoding_method: '',
    min_confidence: '',
    max_confidence: '',
    limit: 50
  });
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let recordsResponse, statsResponse;

      // Try real server first
      recordsResponse = await apiService.getDatabaseRecords(filters);
      statsResponse = await apiService.getDatabaseStats();

      if (!recordsResponse.success || !statsResponse.success) {
        console.warn('Server failed, using mock data');
        // Fallback to mock data
        recordsResponse = { success: true, data: mockData.databaseRecords };
        statsResponse = { success: true, data: mockData.databaseStats };
      }

      if (recordsResponse.success && statsResponse.success) {
        setRecords(recordsResponse.data);
        setStats(statsResponse.data);
      } else {
        setError('Failed to load database data');
      }
    } catch (err) {
      console.error('Database load error:', err);
      setError('An unexpected error occurred while loading data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      min_confidence: '',
      max_confidence: '',
      limit: 50
    });
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await apiService.downloadDatabase(filters);
      if (!response.success) {
        console.warn('Server download failed, creating mock CSV');
        downloadMockCSV();
      }
    } catch (err) {
      console.error('Download error:', err);
      downloadMockCSV();
    } finally {
      setLoading(false);
    }
  };

  const downloadMockCSV = () => {
    const csvContent = [
      'id,filename,prediction,confidence,encoding_method,processing_time,created_at',
      ...mockData.databaseRecords.map(record =>
        `${record.id},${record.filename},${record.prediction},${record.confidence},${record.encoding_method},${record.processing_time},${record.created_at}`
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
                <option value="HOG">HOG</option>
                <option value="dlib">dlib</option>
                <option value="ResNet18">ResNet18</option>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Database Records ({records.length} results)
            </h3>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prediction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Encoding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Processing Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-200 rounded mr-3 flex items-center justify-center">
                            📷
                          </div>
                          {record.filename}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPredictionColor(record.prediction)}`}>
                          {record.prediction}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getConfidenceColor(record.confidence)}`}>
                          {(record.confidence * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.encoding_method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.processing_time}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DatabaseInterface;
