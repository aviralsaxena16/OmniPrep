import React, { useState } from 'react';
import VoiceAgent from './VoiceAgent';
import MockinterviewResults from './MockinterviewResult';

const Mockinterview = () => {
  const [currentView, setCurrentView] = useState('form'); // 'form', 'interview', 'results'
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    experience: '',
    jobRole: '',
    companyName: ''
  });
  const [currentCallId, setCurrentCallId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that all fields are filled
    const requiredFields = ['name', 'education', 'experience', 'jobRole', 'companyName'];
    const isValid = requiredFields.every(field => formData[field].trim() !== '');
    
    if (!isValid) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Generate a unique call ID for this interview session
    const callId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentCallId(callId);
    
    // Show the voice agent with the form data
    setCurrentView('interview');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      education: '',
      experience: '',
      jobRole: '',
      companyName: ''
    });
    setCurrentView('form');
    setCurrentCallId(null);
  };

  const handleViewResults = () => {
    if (currentCallId) {
      setCurrentView('results');
    }
  };

  const handleBackToForm = () => {
    setCurrentView('form');
  };

  const handleBackToInterview = () => {
    setCurrentView('interview');
  };

  // Handle when interview is completed
  const handleInterviewComplete = (callId) => {
    setCurrentCallId(callId);
    // Auto-redirect to results after a short delay
    setTimeout(() => {
      setCurrentView('results');
    }, 3000);
  };

  // Results View
  if (currentView === 'results') {
    return (
      <MockinterviewResults 
        callId={currentCallId}
        onBack={handleBackToForm}
      />
    );
  }

  // Interview View
  if (currentView === 'interview') {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <button 
              onClick={handleReset}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600"
            >
              ← Back to Form
            </button>
            
            {currentCallId && (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">
                  Call ID: <span className="font-mono text-gray-300">{currentCallId}</span>
                </div>
                <button
                  onClick={handleViewResults}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  View Results
                </button>
              </div>
            )}
          </div>
          
          <VoiceAgent 
            name={formData.name}
            education={formData.education}
            experience={formData.experience}
            jobRole={formData.jobRole}
            companyName={formData.companyName}
            callId={currentCallId}
            onInterviewComplete={handleInterviewComplete}
          />
        </div>
      </div>
    );
  }

  // Form View (default)
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-2">Mock Interview Setup</h1>
          <p className="text-gray-300 mb-8">Please fill in your details to start the mock interview</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-200 mb-2">
                Education *
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                placeholder="e.g., Bachelor's in Computer Science, MBA"
                required
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-200 mb-2">
                Experience *
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-vertical text-white placeholder-gray-400"
                placeholder="Describe your relevant work experience, skills, and achievements"
                required
              />
            </div>

            <div>
              <label htmlFor="jobRole" className="block text-sm font-medium text-gray-200 mb-2">
                Target Job Role *
              </label>
              <input
                type="text"
                id="jobRole"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                required
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-200 mb-2">
                Target Company *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                placeholder="e.g., Google, Microsoft, Amazon"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105"
              >
                Start Mock Interview
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Mockinterview;