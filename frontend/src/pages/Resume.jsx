import React, { useState } from 'react';

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

  const handleSubmit = async (event) => {
    event.preventDefault();

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-md"
        />
        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Analyze Resume'}
        </button>
      </form>

      {error && <p className="text-red-600 font-medium">{error}</p>}

      {jsonData && (
        <div className="bg-white shadow-xl rounded-xl p-6 space-y-4 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">📊 Resume Analysis</h2>

          {jsonData.candidate_summary && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Candidate Summary</h3>
              <p className="text-gray-700">{jsonData.candidate_summary}</p>
            </div>
          )}

          {jsonData.core_strengths?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Core Strengths</h3>
              <ul className="list-disc list-inside text-gray-700">
                {jsonData.core_strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {jsonData.areas_of_improvement?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Areas for Improvement</h3>
              <ul className="list-disc list-inside text-red-700">
                {jsonData.areas_of_improvement.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {jsonData.red_flags?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Red Flags</h3>
              <ul className="list-disc list-inside text-orange-700">
                {jsonData.red_flags.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {jsonData.resume_quality_rating && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Resume Score</h3>
              <p className="text-gray-700">
                <strong>Score:</strong> {jsonData.resume_quality_rating.score}/10<br />
                <strong>Reason:</strong> {jsonData.resume_quality_rating.justification}
              </p>
            </div>
          )}

          {jsonData.relevance_for_roles && Object.keys(jsonData.relevance_for_roles).length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Relevance for Roles</h3>
              <ul className="text-gray-700">
                {Object.entries(jsonData.relevance_for_roles).map(([role, rating]) => (
                  <li key={role}>
                    <strong>{role.replace(/_/g, ' ')}:</strong> {rating}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {jsonData.impact_analysis && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Impact of Work</h3>
              <p className="text-gray-700">{jsonData.impact_analysis}</p>
            </div>
          )}

          {jsonData.suggested_improvements?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Suggested Improvements</h3>
              <ul className="list-disc list-inside text-blue-700">
                {jsonData.suggested_improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {jsonData.grammar_and_formatting_issues?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Formatting & Grammar Issues</h3>
              <ul className="list-disc list-inside text-gray-700">
                {jsonData.grammar_and_formatting_issues.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {jsonData.final_recommendation && (
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Final Recommendation</h3>
              <p className="text-gray-700">{jsonData.final_recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeUploader;
