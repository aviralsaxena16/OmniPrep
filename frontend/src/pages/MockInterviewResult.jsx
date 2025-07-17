import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, XCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

const MockinterviewResults = ({ callId, onBack }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const fetchUrl = `${backendUrl}/api/interviews/results/${callId}`;
  // const fetchUrl = `${backendUrl}/api/interviews/results/interview_1752754673567_txqkah33d`;

  const formattedDate = (ts) => {
    const date = new Date(Number(ts) || ts);
    return isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
  };

  // ✅ Fetch results
  const fetchResults = useCallback(async () => {
    if (!callId) {
      setLoading(false);
      setError('No call ID provided.');
      return false;
    }
    console.log(`Attempting to fetch results for Call ID: ${callId}`);

    try {
      const response = await fetch(fetchUrl);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setLoading(false);
        console.log("✅ Results fetched:", data);
        return true;
      } else if (response.status === 404) {
        console.warn(`Results not ready for ${callId} (404)`);
        return false;
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    } catch (err) {
      console.error(`❌ Fetch error:`, err);
      return false;
    }
  }, [callId, fetchUrl]);

  // ✅ Retry logic
  useEffect(() => {
    if (!callId) return;

    let timeoutId;
    const attemptFetch = async () => {
      const success = await fetchResults();

      if (!success && retryCount < maxRetries) {
        timeoutId = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, retryDelay);
      } else if (!success && retryCount >= maxRetries) {
        setLoading(false);
        setError(null); // Show "Not Available Yet"
      }
    };

    attemptFetch();
    return () => clearTimeout(timeoutId);
  }, [callId, retryCount, fetchResults]);

  // ✅ Reset when new callId
  useEffect(() => {
    setResults(null);
    setError(null);
    setLoading(true);
    setRetryCount(0);
  }, [callId]);

  // ✅ Manual Retry
  const handleManualRetry = () => {
    console.log("🔄 Manual retry...");
    setRetryCount((c) => c + 1);
    setLoading(true);
    setError(null);
  };

  // ✅ UI States
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl text-white mb-2">Processing Interview Results...</h2>
        <p className="text-gray-400 mb-4">
          Call ID: <span className="font-mono">{callId}</span> <br />
          Attempt {retryCount + 1} of {maxRetries + 1}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-red-400">Error Loading Results</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button onClick={handleManualRetry} className="bg-blue-600 px-6 py-2 rounded-lg text-white">
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Retry
        </button>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-yellow-400">Results Not Available Yet for {callId}</h2>
        <p className="text-gray-400">
          Could not retrieve results after {maxRetries + 1} attempts.
        </p>
        <button onClick={handleManualRetry} className="bg-blue-600 px-6 py-2 rounded-lg text-white">
          Check Again
        </button>
      </div>
    );
  }

  // ✅ Display Results
  const { extractedInfo, fullConversation, timestamp, summary, sentiment, recordingUrl } = results;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg border border-gray-700">
        <button onClick={onBack} className="bg-gray-700 px-4 py-2 rounded text-white mb-4">
          <ArrowLeft className="w-4 h-4 inline mr-2" /> Back
        </button>
        <h1 className="text-2xl text-white">Interview Results</h1>
        <p className="text-green-300 mt-2">Completed on {formattedDate(timestamp)}</p>

        {summary && (
          <div className="mt-4">
            <h3 className="text-lg text-blue-300 mb-2">Summary</h3>
            <p className="text-gray-300">{summary}</p>
          </div>
        )}

        {sentiment && (
          <div className="mt-4">
            <h3 className="text-lg text-blue-300 mb-2">Sentiment</h3>
            <p className={`text-${sentiment === 'Positive'
              ? 'green'
              : sentiment === 'Negative'
              ? 'red'
              : 'yellow'}-400`}>
              {sentiment}
            </p>
          </div>
        )}

        {recordingUrl && (
          <div className="mt-4">
            <h3 className="text-lg text-blue-300 mb-2">Recording</h3>
            <a
              href={recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Listen to Recording
            </a>
          </div>
        )}

        {extractedInfo && (
          <div className="mt-6">
            <h3 className="text-lg text-blue-300 mb-2">Interview Analysis</h3>
            {Object.entries(extractedInfo).map(([k, v]) => (
              <div key={k} className="text-gray-300 border-b border-gray-600 py-2">
                <strong className="capitalize">{k.replace(/_/g, " ")}:</strong> {v.toString()}
              </div>
            ))}
          </div>
        )}

        {fullConversation && (
          <div className="mt-6">
            <h3 className="text-lg text-blue-300 mb-2">Transcript</h3>
            <pre className="bg-gray-900 p-4 rounded max-h-64 overflow-auto text-gray-400 text-sm">
              {fullConversation}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockinterviewResults;
