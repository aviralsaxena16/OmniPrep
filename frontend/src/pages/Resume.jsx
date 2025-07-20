import React, { useState } from 'react';
import Navbar from './Navbar';
function ResumeUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setJsonData(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setJsonData(data);
    } catch (err) {
      setError('Failed to process the PDF. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-5xl mx-auto p-8 bg-white min-h-screen">
      {/* Header */}
        
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-black mb-4 tracking-tight">Resume Analysis Tool</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Upload your PDF resume for comprehensive analysis and professional feedback
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-gray-50 border-2 border-black p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <label htmlFor="resume-upload" className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
              Select Resume (PDF)
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border-2 border-gray-300 bg-white text-black file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-black file:text-white file:font-semibold file:uppercase file:text-sm hover:file:bg-gray-800 transition-colors"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !selectedFile}
            className="px-8 py-3 bg-black text-white font-semibold uppercase tracking-wide border-2 border-black hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
          >
            {isLoading ? 'Processing...' : 'Analyze Resume'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-600 p-4 mb-8">
          <p className="text-red-600 font-semibold">⚠ {error}</p>
        </div>
      )}

      {/* Results */}
      {jsonData && (
        <div className="bg-white border-2 border-black">
          {/* Header Section */}
          <div className="bg-black text-white p-6">
            <h2 className="text-3xl font-bold uppercase tracking-wide">Resume Analysis Results</h2>
          </div>

          <div className="p-8 space-y-8">
            {jsonData.candidate_summary && (
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-wide">Executive Summary</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{jsonData.candidate_summary}</p>
              </div>
            )}

            {jsonData.core_strengths?.length > 0 && (
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Core Strengths</h3>
                <div className="grid gap-2">
                  {jsonData.core_strengths.map((strength, i) => (
                    <div key={i} className="bg-gray-100 p-3 border-l-2 border-gray-400">
                      <span className="text-gray-800 font-medium">• {strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jsonData.resume_quality_rating && (
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Quality Assessment</h3>
                <div className="bg-gray-50 p-6 border border-gray-300">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-black">{jsonData.resume_quality_rating.score}</span>
                    <span className="text-gray-500 text-lg">/ 10</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{jsonData.resume_quality_rating.justification}</p>
                </div>
              </div>
            )}

            {jsonData.relevance_for_roles && Object.keys(jsonData.relevance_for_roles).length > 0 && (
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Role Compatibility</h3>
                <div className="grid gap-3">
                  {Object.entries(jsonData.relevance_for_roles).map(([role, rating]) => (
                    <div key={role} className="flex justify-between items-center p-3 bg-gray-100 border border-gray-300">
                      <span className="font-semibold text-black uppercase text-sm tracking-wide">
                        {role.replace(/_/g, ' ')}
                      </span>
                      <span className="text-gray-700 font-medium">{rating}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jsonData.impact_analysis && (
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-wide">Impact Analysis</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{jsonData.impact_analysis}</p>
              </div>
            )}

            {jsonData.areas_of_improvement?.length > 0 && (
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Areas for Improvement</h3>
                <div className="grid gap-2">
                  {jsonData.areas_of_improvement.map((area, i) => (
                    <div key={i} className="bg-red-50 p-3 border-l-2 border-red-400">
                      <span className="text-red-700 font-medium">• {area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jsonData.red_flags?.length > 0 && (
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Critical Issues</h3>
                <div className="grid gap-2">
                  {jsonData.red_flags.map((flag, i) => (
                    <div key={i} className="bg-red-100 p-3 border border-red-300">
                      <span className="text-red-800 font-semibold">⚠ {flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jsonData.suggested_improvements?.length > 0 && (
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Recommended Actions</h3>
                <div className="grid gap-2">
                  {jsonData.suggested_improvements.map((improvement, i) => (
                    <div key={i} className="bg-blue-50 p-3 border-l-2 border-blue-400">
                      <span className="text-blue-800 font-medium">→ {improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jsonData.grammar_and_formatting_issues?.length > 0 && (
              <div className="border-l-4 border-black pl-6">
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Technical Issues</h3>
                <div className="grid gap-2">
                  {jsonData.grammar_and_formatting_issues.map((issue, i) => (
                    <div key={i} className="bg-yellow-50 p-3 border-l-2 border-yellow-400">
                      <span className="text-yellow-800 font-medium">• {issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jsonData.final_recommendation && (
              <div className="border-2 border-black bg-gray-50 p-6">
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">Final Recommendation</h3>
                <p className="text-gray-800 leading-relaxed text-lg font-medium">{jsonData.final_recommendation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default ResumeUploader;