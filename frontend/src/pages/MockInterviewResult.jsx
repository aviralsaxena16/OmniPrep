import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, User, Briefcase, GraduationCap, Building, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const MockinterviewResults = ({ callId, onBack }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = 5;
  const retryDelay = 3000; // 3 seconds

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your actual backend URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      // UPDATED ENDPOINT:
      const response = await fetch(`${backendUrl}/api/interviews/results/${callId}`);


      if (response.ok) {
        const data = await response.json();
        console.log("result is fine")
        setResults(data);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        // Results not found yet, will retry
        return false;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(`Failed to fetch results: ${err.message}`);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    if (!callId) {
      setError('No call ID provided');
      setLoading(false);
      return;
    }

    const attemptFetch = async () => {
      const success = await fetchResults();

      if (!success && retryCount < maxRetries) {
        // Retry after delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      }
    };

    attemptFetch();
    // eslint-disable-next-line
  }, [callId, retryCount]);

  const handleManualRetry = () => {
    setRetryCount(0);
    fetchResults();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={onBack}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Form</span>
              </button>
              <h1 className="text-2xl font-bold text-white">Interview Results</h1>
            </div>

            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-white mb-2">Processing Results...</h2>
              <p className="text-gray-400 mb-4">
                Please wait while we fetch your interview results
              </p>
              <div className="text-sm text-gray-500">
                <p>Call ID: <span className="font-mono">{callId}</span></p>
                <p>Attempt: {retryCount + 1} of {maxRetries + 1}</p>
              </div>
              
              {retryCount > 0 && (
                <div className="mt-4 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    Still processing... This may take a few moments as we analyze your interview.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={onBack}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Form</span>
              </button>
              <h1 className="text-2xl font-bold text-white">Interview Results</h1>
            </div>
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Results</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-300 mb-2">Troubleshooting:</h3>
                <ul className="text-sm text-red-200 text-left space-y-1">
                  <li>• Make sure your backend server is running</li>
                  <li>• Check if the webhook endpoint is configured correctly</li>
                  <li>• Verify the call completed successfully</li>
                  <li>• Check browser console for detailed errors</li>
                </ul>
              </div>

              <div className="space-x-4">
                <button
                  onClick={handleManualRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={onBack}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Form</span>
              </button>
              <h1 className="text-2xl font-bold text-white">Interview Results</h1>
            </div>

            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">Results Not Available</h2>
              <p className="text-gray-400 mb-4">
                Interview results are not available yet. This could happen if:
              </p>
              <ul className="text-gray-400 text-left max-w-md mx-auto space-y-2 mb-6">
                <li>• The interview hasn't been completed</li>
                <li>• Results are still being processed</li>
                <li>• There was an issue with the webhook</li>
              </ul>
              <button
                onClick={handleManualRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Check Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { extractedInfo, fullConversation, timestamp } = results;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={onBack}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Form</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Interview Results</h1>
          </div>
          {/* Success indicator */}
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <h2 className="text-green-300 font-semibold">Interview Completed Successfully!</h2>
              <p className="text-green-200 text-sm">
                Completed on {new Date(timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Call Information */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Session Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">Session ID: <span className="font-mono">{callId}</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">Date: {new Date(timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Extracted Information */}
          {extractedInfo && (
            <div className="bg-gray-700 rounded-lg p-6 mb-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Interview Analysis</h3>
              <div className="space-y-4">
                {typeof extractedInfo === 'object' ? (
                  Object.entries(extractedInfo).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-600 pb-3 last:border-b-0">
                      <h4 className="font-medium text-blue-300 capitalize mb-1">
                        {key.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300">{extractedInfo}</p>
                )}
              </div>
            </div>
          )}

          {/* Full Conversation */}
          {fullConversation && (
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Interview Transcript</h3>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 max-h-96 overflow-y-auto">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                  {typeof fullConversation === 'object' 
                    ? JSON.stringify(fullConversation, null, 2)
                    : fullConversation
                  }
                </pre>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockinterviewResults;
