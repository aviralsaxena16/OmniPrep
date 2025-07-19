import React, { useState } from 'react';
import VoiceAgent2 from './VoiceAgent2';
import MockinterviewResults from './MockInterviewResult';
import Navbar from './Navbar';

const Mockinterview = () => {
  const callId = `call_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const [currentView, setCurrentView] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    experience: '',
    jobRole: '',
    companyName: '',
    callId:callId
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'education', 'experience', 'jobRole', 'companyName'];
    const isValid = requiredFields.every(field => formData[field].trim() !== '');
    if (!isValid) return alert('Please fill in all required fields');

    try {
      // await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/start-omnidimension-call`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData) 
      // });

      console.log("✅ Interview session started");
      setCurrentView('interview');
    } catch (err) {
      console.error("❌ Failed to start interview:", err);
      alert("Error starting interview. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({ name: '', education: '', experience: '', jobRole: '', companyName: '' ,callId:callId});
    setCurrentView('form');
  };

  const handleViewResults = () => setCurrentView('results');
  const handleBackToForm = () => setCurrentView('form');

  const handleInterviewComplete = () => {
    // ✅ No callId; just switch to results after a delay
    setTimeout(() => setCurrentView('results'), 3000);
  };

  if (currentView === 'results') {
    return <MockinterviewResults onBack={handleBackToForm} />;
  }

  if (currentView === 'interview') {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, black 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>

        {/* Header */}
        <div className="relative z-10 bg-white border-b border-gray-100">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <button
                onClick={handleReset}
                className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:text-black transition-all duration-200 group"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Setup</span>
              </button>

              <button
                onClick={handleViewResults}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                View Latest Results
              </button>
            </div>
          </div>
        </div>

        {/* Interview Content */}
        <div className="relative z-10 px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-black mb-4">Live Interview Session</h1>
              <p className="text-xl text-gray-600">Stay confident and speak clearly</p>
            </div>

            <VoiceAgent2
              {...formData}
              onInterviewComplete={handleInterviewComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  // FORM VIEW
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, black 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 flex flex-col items-center justify-start px-6 lg:px-20 pt-12 pb-16 gap-10">
          {/* Top Section */}
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left: Header */}
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>AI Interview Ready</span>
              </div>
              <h1 className="text-5xl font-bold text-black mb-3 leading-tight">Mock Interview</h1>
              <span className="block text-2xl text-gray-600 font-normal mb-4">Practice. Perfect. Succeed.</span>
              <p className="text-lg text-gray-600 mb-8">
                Get personalized feedback from our AI interviewer and boost your confidence for real interviews.
              </p>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start space-x-8">
                <div>
                  <div className="text-2xl font-bold text-black">95%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">10k+</div>
                  <div className="text-xs text-gray-600">Interviews</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">5min</div>
                  <div className="text-xs text-gray-600">Setup Time</div>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div>
              <img
                src="/interview2.png"
                alt="Interview Candidate"
                className="w-[32rem] h-[28rem] object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Form */}
          <h1 className="text-4xl font-bold text-black mb-4">Submit</h1>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl bg-white px-8 py-10 rounded-2xl shadow-2xl border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-2 text-sm font-semibold text-black">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-5 py-3 text-base border-2 border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-black transition-all duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="education" className="mb-2 text-sm font-semibold text-black">
                  Education
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="px-5 py-3 text-base border-2 border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-black transition-all duration-200"
                  placeholder="e.g., B.Tech CSE"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="flex flex-col">
                <label htmlFor="jobRole" className="mb-2 text-sm font-semibold text-black">
                  Target Job Role
                </label>
                <input
                  type="text"
                  id="jobRole"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  className="px-5 py-3 text-base border-2 border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-black transition-all duration-200"
                  placeholder="e.g., Frontend Developer"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="companyName" className="mb-2 text-sm font-semibold text-black">
                  Target Company
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="px-5 py-3 text-base border-2 border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-black transition-all duration-200"
                  placeholder="e.g., Google"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mt-6">
              <label htmlFor="experience" className="mb-2 text-sm font-semibold text-black">
                Experience, Skills & Achievements
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows="4"
                className="px-5 py-3 text-base border-2 border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-black transition-all duration-200 resize-none"
                placeholder="Tell us about your experience, skills, and achievements..."
                required
              />
            </div>

            <div className="pt-8">
              <button
                type="submit"
                className="w-full bg-black text-white py-4 px-8 rounded-xl hover:bg-gray-900 transition-all duration-200 font-semibold text-lg shadow-md"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span>Start Interview</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Mockinterview;
