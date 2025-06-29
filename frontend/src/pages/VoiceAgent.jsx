import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Clock, User } from 'lucide-react';

function VoiceAgent({ name, education, experience, jobRole, companyName, callId, onInterviewComplete }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_OMNIDIMENSION_WIDGET_URL;
    script.async = true;
    script.id = "omnidimension-web-widget";

    script.onload = () => {
      try {
        // Ensure OmniDimension object is available
        if (window.OmniDimension && typeof window.OmniDimension.init === 'function') {
          window.OmniDimension.init({
            dynamic_variables: {
              name: name || "John Doe",
              education: education || "Bachelor's Degree",
              experience: experience || "Entry Level",
              job_role: jobRole || "Software Engineer",
              company_name: companyName || "Tech Company"
            },
            callId: callId,
            onCallStart: handleCallStart,
            onCallEnd: handleCallEnd,
            onError: handleError
          });
          setIsLoading(false);
        } else {
          throw new Error('OmniDimension widget failed to load properly');
        }
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      setError('Failed to load the voice agent. Please check your connection and try again.');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Clean up the script element
      const existingScript = document.getElementById("omnidimension-web-widget");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      // Clean up OmniDimension instance if necessary
      if (window.OmniDimension && typeof window.OmniDimension.destroy === 'function') {
        window.OmniDimension.destroy();
      }
    };
  }, [name, education, experience, jobRole, companyName, callId]);

  // Timer effect for call duration
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleCallStart = () => {
    setIsCallActive(true);
    setCallDuration(0);
  };

  const handleCallEnd = () => {
    setIsCallActive(false);
    if (onInterviewComplete) {
      onInterviewComplete(callId);
    }
  };

  const handleError = (error) => {
    setError(error.message || 'An error occurred during the interview');
    setIsCallActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-red-600 mb-4">
          <PhoneOff className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Mock Interview Session</h2>
      
      {/* Interview Details */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Interview Details:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300"><span className="font-medium">Name:</span> {name}</span>
          </div>
          <div className="text-gray-300"><span className="font-medium">Education:</span> {education}</div>
          <div className="text-gray-300"><span className="font-medium">Job Role:</span> {jobRole}</div>
          <div className="text-gray-300"><span className="font-medium">Company:</span> {companyName}</div>
        </div>
        <div className="mt-3">
          <div className="text-gray-300"><span className="font-medium">Experience:</span> {experience}</div>
        </div>
      </div>

      {/* Call Status */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
          isCallActive ? 'bg-green-100 animate-pulse' : 
          isLoading ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          ) : isCallActive ? (
            <Mic className="w-8 h-8 text-green-600" />
          ) : (
            <MicOff className="w-8 h-8 text-gray-600" />
          )}
        </div>
        
        {isLoading ? (
          <div>
            <p className="text-gray-300 font-medium">Initializing Voice Agent...</p>
            <p className="text-sm text-gray-400 mt-2">Please wait while we set up your interview</p>
          </div>
        ) : isCallActive ? (
          <div>
            <p className="text-green-400 font-medium">Interview in Progress</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 font-mono">{formatTime(callDuration)}</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Speak clearly and naturally</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 font-medium">Ready to Start</p>
            <p className="text-sm text-gray-400 mt-2">Click the microphone to begin your interview</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-800 mb-2">Interview Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Take your time to think before answering</li>
          <li>• Be specific and provide examples when possible</li>
          <li>• Ask questions about the role and company</li>
          <li>• Stay calm and confident</li>
        </ul>
      </div>

      {/* Call ID Display */}
      <div className="text-center">
        <div className="text-xs text-gray-500">
          Session ID: <span className="font-mono text-gray-400">{callId}</span>
        </div>
      </div>

      {/* OmniDimension Widget Container */}
      <div id="omnidimension-widget-container" className="mt-6">
        {/* The actual widget will be injected here by the script */}
      </div>
    </div>
  );
}

export default VoiceAgent;