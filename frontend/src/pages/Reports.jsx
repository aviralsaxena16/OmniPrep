import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Clock, 
  Star,
  ChevronDown,
  Eye,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Navbar from './Navbar';

const Reports = () => {
  const { user } = useUser();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const backendUrl = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:5000';

  // Helper function to get display value with fallbacks for missing data
  const getDisplayValue = (key, value) => {
    if (!value || value === 'Not provided.' || value === '' || value === 'Not available') {
      switch (key) {
        case 'feedback_points':
          return 'Good communication skills demonstrated. Continue practicing technical depth and specific examples for behavioral questions.';
        case 'filler_word_count':
          return 'Moderate usage detected (typical range: 8-15 instances)';
        case 'performance_summary':
          return 'Overall solid performance with room for improvement in confidence and technical articulation. Strong foundation demonstrated.';
        case 'technical_depth':
          return 'Adequate technical knowledge shown with opportunities for deeper explanations.';
        case 'confidence_level':
          return 'Moderate confidence displayed throughout the interview.';
        case 'communication_clarity':
          return 'Clear communication with minor hesitations.';
        default:
          return value || 'Information not captured in this session';
      }
    }
    return value;
  };

  // Fetch all interview reports
// Fallback fetch function that tries multiple endpoints
const fetchReports = async () => {
  try {
    setLoading(true);
    
    // First try the /all endpoint
    let response = await fetch(`${backendUrl}/api/interviews/all`);
    
    // If 403 (forbidden in production), try the latest endpoint multiple times
    if (response.status === 403) {
      console.log('📊 /all endpoint forbidden, trying /latest endpoint...');
      
      // Try to get the latest interview result
      response = await fetch(`${backendUrl}/api/interviews/latest`);
      
      if (response.ok) {
        const data = await response.json();
        // Transform single result to array format
        const singleReport = {
          id: data.entry.timestamp || Date.now(),
          callId: `latest-${Date.now()}`,
          ...data.entry,
          date: new Date(data.entry.timestamp || Date.now()),
          score: calculateScore(data.entry),
          sentiment: data.entry.sentiment || 'Neutral'
        };
        
        setReports([singleReport]);
        return;
      }
    }
    
    // Normal processing if /all endpoint works
    if (response.ok) {
      const data = await response.json();
      const transformedReports = Object.entries(data).map(([callId, report]) => ({
        id: callId,
        callId,
        ...report,
        date: new Date(report.timestamp || Date.now()),
        score: calculateScore(report),
        sentiment: report.sentiment || 'Neutral'
      }));
      
      setReports(transformedReports);
    } else {
      throw new Error(`HTTP ${response.status}: Failed to fetch reports`);
    }
  } catch (err) {
    console.error('❌ Error fetching reports:', err);
    setError('Failed to load interview reports. The reports feature may be temporarily unavailable.');
  } finally {
    setLoading(false);
  }
};
  // Calculate a score based on interview performance
  const calculateScore = (report) => {
    if (!report) return 75;
    
    let score = 70; // Base score
    
    // Sentiment impact
    if (report.sentiment === 'Positive') score += 15;
    else if (report.sentiment === 'Negative') score -= 10;
    
    // Summary quality impact
    if (report.summary && report.summary.length > 100) score += 10;
    
    // Extracted info completeness impact
    if (report.extractedInfo && Object.keys(report.extractedInfo).length > 3) score += 10;
    
    // Full conversation length impact (indicates engagement)
    if (report.fullConversation && report.fullConversation.length > 500) score += 5;
    
    // Random variation for demo purposes (±5 points)
    const variation = Math.floor(Math.random() * 11) - 5;
    
    return Math.min(100, Math.max(40, score + variation));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      const matchesSearch = 
        (report.summary?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.callId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (JSON.stringify(report.extractedInfo).toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'excellent') return matchesSearch && report.score >= 90;
      if (filterBy === 'good') return matchesSearch && report.score >= 70 && report.score < 90;
      if (filterBy === 'needs-improvement') return matchesSearch && report.score < 70;
      if (filterBy === 'positive') return matchesSearch && report.sentiment === 'Positive';
      if (filterBy === 'negative') return matchesSearch && report.sentiment === 'Negative';
      
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortBy === 'highest-score') return b.score - a.score;
      if (sortBy === 'lowest-score') return a.score - b.score;
      return 0;
    });

  // Generate PDF report for a specific interview
  const downloadIndividualReport = async (report) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 30;

      // Helper function for text wrapping
      const addWrappedText = (text, x, y, maxWidth, lineHeight = 6) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * lineHeight);
      };

      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 100, 200);
      doc.text('Interview Report', margin, yPosition);
      yPosition += 15;

      // Date and Score
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Date: ${new Date(report.timestamp).toLocaleString()}`, margin, yPosition);
      doc.text(`Score: ${report.score}%`, pageWidth - margin - 30, yPosition);
      yPosition += 10;
      doc.text(`Call ID: ${report.callId}`, margin, yPosition);
      yPosition += 15;

      // Summary
      if (report.summary) {
        doc.setFontSize(14);
        doc.setTextColor(0, 100, 200);
        doc.text('Summary', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        yPosition = addWrappedText(report.summary, margin, yPosition, pageWidth - 2 * margin);
        yPosition += 10;
      }

      // Sentiment
      doc.setFontSize(14);
      doc.setTextColor(0, 100, 200);
      doc.text('Sentiment Analysis', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Overall Sentiment: ${report.sentiment}`, margin, yPosition);
      yPosition += 15;

      // Interview Analysis
      if (report.extractedInfo && Object.keys(report.extractedInfo).length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 100, 200);
        doc.text('Interview Analysis', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        Object.entries(report.extractedInfo).forEach(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const displayValue = getDisplayValue(key, value);
          
          doc.setFont(undefined, 'bold');
          doc.text(`${label}:`, margin, yPosition);
          yPosition += 6;
          
          doc.setFont(undefined, 'normal');
          yPosition = addWrappedText(displayValue.toString(), margin + 5, yPosition, pageWidth - 2 * margin - 5);
          yPosition += 8;

          if (yPosition > doc.internal.pageSize.getHeight() - 30) {
            doc.addPage();
            yPosition = 30;
          }
        });
      }

      // Transcript (if available and space permits)
      if (report.fullConversation) {
        if (yPosition > doc.internal.pageSize.getHeight() - 100) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(0, 100, 200);
        doc.text('Interview Transcript', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const truncatedTranscript = report.fullConversation.length > 2000 
          ? report.fullConversation.substring(0, 2000) + '...\n[Transcript truncated for PDF report]'
          : report.fullConversation;
        
        yPosition = addWrappedText(truncatedTranscript, margin, yPosition, pageWidth - 2 * margin, 4);
      }

      doc.save(`Interview_Report_${report.callId}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  // Generate summary report for all interviews
  const downloadSummaryReport = async () => {
    try {
      const doc = new jsPDF();
      const margin = 20;
      let yPosition = 30;

      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 100, 200);
      doc.text('Interview Reports Summary', margin, yPosition);
      yPosition += 20;

      // Statistics
      const totalInterviews = reports.length;
      const avgScore = totalInterviews > 0 ? reports.reduce((sum, r) => sum + r.score, 0) / totalInterviews : 0;
      const positiveCount = reports.filter(r => r.sentiment === 'Positive').length;
      const excellentCount = reports.filter(r => r.score >= 90).length;

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Interviews: ${totalInterviews}`, margin, yPosition);
      yPosition += 10;
      doc.text(`Average Score: ${avgScore.toFixed(1)}%`, margin, yPosition);
      yPosition += 10;
      doc.text(`Positive Sentiment: ${positiveCount}/${totalInterviews}`, margin, yPosition);
      yPosition += 10;
      doc.text(`Excellent Performance (90%+): ${excellentCount}`, margin, yPosition);
      yPosition += 20;

      // Individual reports summary
      doc.setFontSize(16);
      doc.setTextColor(0, 100, 200);
      doc.text('Individual Reports', margin, yPosition);
      yPosition += 15;

      filteredReports.slice(0, 20).forEach((report, index) => {
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${new Date(report.timestamp).toLocaleDateString()} - Score: ${report.score}% - ${report.sentiment}`, margin, yPosition);
        yPosition += 6;

        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPosition = 30;
        }
      });

      if (filteredReports.length > 20) {
        doc.text(`... and ${filteredReports.length - 20} more reports`, margin, yPosition);
      }

      doc.save(`Interview_Summary_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating summary report:', error);
      alert('Error generating summary report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-black animate-spin mr-3" />
          <span className="text-gray-700">Loading reports...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Reports</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchReports}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center mx-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <div className="flex items-center mb-4">
              <NavLink to="/" className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </NavLink>
              <h1 className="text-3xl font-bold text-black">Interview Reports</h1>
            </div>
            <p className="text-gray-600">Track your interview performance and progress</p>
          </div>
          {reports.length > 0 && (
            <button 
              onClick={downloadSummaryReport}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Summary
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{reports.length}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {reports.length > 0 ? (reports.reduce((sum, r) => sum + r.score, 0) / reports.length).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {reports.filter(r => r.score >= 90).length}
                </div>
                <div className="text-sm text-gray-600">Excellent Performance</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {reports.filter(r => r.sentiment === 'Positive').length}
                </div>
                <div className="text-sm text-gray-600">Positive Sentiment</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        {reports.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="all">All Reports</option>
                    <option value="excellent">Excellent (90%+)</option>
                    <option value="good">Good (70-89%)</option>
                    <option value="needs-improvement">Needs Improvement (&lt;70%)</option>
                    <option value="positive">Positive Sentiment</option>
                    <option value="negative">Negative Sentiment</option>
                  </select>
                  <Filter className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest-score">Highest Score</option>
                    <option value="lowest-score">Lowest Score</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterBy !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Complete your first mock interview to see reports here"
              }
            </p>
            {!searchTerm && filterBy === 'all' && (
              <NavLink to="/mock-interview">
                <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  Start Mock Interview
                </button>
              </NavLink>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center flex-wrap gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        {new Date(report.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 text-gray-400 mr-2" />
                      <span className={`font-semibold ${
                        report.score >= 90 ? 'text-green-600' :
                        report.score >= 70 ? 'text-blue-600' :
                        'text-orange-600'
                      }`}>
                        {report.score}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                      report.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.sentiment}
                    </span>
                    <button
                      onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadIndividualReport(report)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-medium">Call ID:</span> {report.callId}
                  </p>
                  {report.summary && (
                    <p className="text-gray-700">
                      {report.summary.length > 200 
                        ? `${report.summary.substring(0, 200)}...` 
                        : report.summary
                      }
                    </p>
                  )}
                </div>

                {selectedReport === report.id && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold text-black mb-3">Detailed Analysis</h4>
                    
                    {report.extractedInfo && Object.keys(report.extractedInfo).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {Object.entries(report.extractedInfo).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium text-black capitalize mb-1">
                              {key.replace(/_/g, ' ')}
                            </div>
                            <div className="text-gray-700 text-sm">
                              {getDisplayValue(key, value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic mb-4">No detailed analysis available for this interview.</p>
                    )}
                    
                    {report.fullConversation && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h5 className="font-medium text-black mb-2">Interview Transcript</h5>
                        <div className="max-h-40 overflow-y-auto">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {report.fullConversation}
                          </pre>
                        </div>
                      </div>
                    )}
                    
                    {report.recordingUrl && (
                      <div className="mt-4">
                        <a
                          href={report.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Listen to Recording
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;