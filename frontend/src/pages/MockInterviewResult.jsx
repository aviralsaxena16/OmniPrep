import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star, MessageSquare, TrendingUp, ArrowLeft, Download, Share2 } from 'lucide-react';

const MockinterviewResults = ({ callId, onBack }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (callId) {
      fetchInterviewResults();
    }
  }, [callId]);

  const fetchInterviewResults = async () => {
    try {
      const response = await fetch(`/api/webhooks/results/${callId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching interview results:', error);
      setError('Failed to load interview results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const handleDownloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-results-${callId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Mock Interview Results',
          text: `I just completed a mock interview! Overall score: ${results?.extractedInfo?.fitScore || 'N/A'}%`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading interview results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Results Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  const { extractedInfo, fullConversation, timestamp } = results;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Interview</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownloadResults}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-2">Interview Results</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              Completed on {new Date(timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <div className="text-sm text-gray-400">
              Call ID: <span className="font-mono text-gray-300">{callId}</span>
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`rounded-lg p-6 border-2 ${getScoreBgColor(extractedInfo?.fitScore || 0)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Overall Fit Score</h3>
              <Star className={`w-6 h-6 ${getScoreColor(extractedInfo?.fitScore || 0)}`} />
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(extractedInfo?.fitScore || 0)}`}>
              {extractedInfo?.fitScore || 'N/A'}%
            </div>
          </div>

          <div className={`rounded-lg p-6 border-2 ${getScoreBgColor(extractedInfo?.communicationScore || 0)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Communication Score</h3>
              <MessageSquare className={`w-6 h-6 ${getScoreColor(extractedInfo?.communicationScore || 0)}`} />
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(extractedInfo?.communicationScore || 0)}`}>
              {extractedInfo?.communicationScore || 'N/A'}%
            </div>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-white">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {extractedInfo?.strengths?.map((strength, index) => (
                <li key={index} className="text-gray-300 flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              )) || <li className="text-gray-400 italic">No strengths data available</li>}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-white">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {extractedInfo?.weaknesses?.map((weakness, index) => (
                <li key={index} className="text-gray-300 flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{weakness}</span>
                </li>
              )) || <li className="text-gray-400 italic">No weaknesses data available</li>}
            </ul>
          </div>
        </div>

        {/* Overall Feedback */}
        {extractedInfo?.overallFeedback && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Overall Feedback</h3>
            <p className="text-gray-300 leading-relaxed">{extractedInfo.overallFeedback}</p>
          </div>
        )}

        {/* Next Steps */}
        {extractedInfo?.nextSteps && extractedInfo.nextSteps.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Recommended Next Steps</h3>
            <ol className="space-y-2">
              {extractedInfo.nextSteps.map((step, index) => (
                <li key={index} className="text-gray-300 flex items-start space-x-3">
                  <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Notable Quotes */}
        {extractedInfo?.notableQuotes && extractedInfo.notableQuotes.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Notable Quotes</h3>
            <div className="space-y-3">
              {extractedInfo.notableQuotes.map((quote, index) => (
                <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-gray-300">
                  "{quote}"
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {extractedInfo?.suggestedQuestions && extractedInfo.suggestedQuestions.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Questions You Could Have Asked</h3>
            <ul className="space-y-2">
              {extractedInfo.suggestedQuestions.map((question, index) => (
                <li key={index} className="text-gray-300 flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">?</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Take Another Interview
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition-colors border border-gray-600"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockinterviewResults;