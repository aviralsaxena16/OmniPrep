import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Clock, User, AlertCircle } from 'lucide-react';

function VoiceAgent({ name, education, experience, jobRole, companyName, callId, onInterviewComplete }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    // Check if environment variable exists
    const widgetUrl = import.meta.env.VITE_OMNIDIMENSION_WIDGET_URL;
    
    if (!widgetUrl) {
      setError('Widget URL not configured. Please check your environment variables.');
      setIsLoading(false);
      return;
    }

    // Clean up any existing script
    const existingScript = document.getElementById("omnidimension-web-widget");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = widgetUrl;
    script.async = true;
    script.id = "omnidimension-web-widget";

    script.onload = () => {
      console.log('Widget script loaded');
      
      // Add a small delay to ensure the widget is fully initialized
      setTimeout(() => {
        try {
          if (window.OmniDimension && typeof window.OmniDimension.init === 'function') {
            console.log('Initializing OmniDimension widget...');
            
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
            
            setWidgetReady(true);
            setIsLoading(false);
            console.log('Widget initialized successfully');
          } else {
            throw new Error('OmniDimension widget not available after script load');
          }
        } catch (err) {
          console.error('Error initializing widget:', err);
          setError(`Widget initialization failed: ${err.message}`);
          setIsLoading(false);
        }
      }, 5000);
    };

    script.onerror = (e) => {
      console.error('Script loading error:', e);
      setError('Failed to load the voice agent script. Please check your network connection.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const scriptToRemove = document.getElementById("omnidimension-web-widget");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      
      if (window.OmniDimension && typeof window.OmniDimension.destroy === 'function') {
        try {
          window.OmniDimension.destroy();
        } catch (e) {
          console.warn('Error destroying OmniDimension:', e);
        }
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
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const handleCallStart = () => {
    console.log('Call started');
    setIsCallActive(true);
    setCallDuration(0);
  };

  const handleCallEnd = (callData) => {
    console.log('Call ended:', callData);
    setIsCallActive(false);
    
    // Notify parent component
    if (onInterviewComplete) {
      onInterviewComplete(callId);
    }
  };

  const handleError = (error) => {
    console.error('Widget error:', error);
    setError(error?.message || 'An error occurred during the interview');
    setIsCallActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setWidgetReady(false);
    // Trigger re-render to reload the widget
    window.location.reload();
  };

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 rounded-lg p-8 text-center">
        <div className="text-red-400 mb-6">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-300">Connection Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          
          {/* Debug info */}
          <div className="bg-red-800 rounded-lg p-4 mb-4 text-left">
            <h3 className="font-semibold text-red-200 mb-2">Debug Information:</h3>
            <ul className="text-sm text-red-300 space-y-1">
              <li>• Widget URL: {import.meta.env.VITE_OMNIDIMENSION_WIDGET_URL || 'Not configured'}</li>
              <li>• Call ID: {callId}</li>
              <li>• Widget Ready: {widgetReady ? 'Yes' : 'No'}</li>
              <li>• OmniDimension Available: {typeof window.OmniDimension !== 'undefined' ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={handleRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry Connection
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
          isCallActive ? 'bg-green-600 animate-pulse' : 
          isLoading ? 'bg-blue-600' : 
          widgetReady ? 'bg-gray-600' : 'bg-yellow-600'
        }`}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : isCallActive ? (
            <Mic className="w-8 h-8 text-white" />
          ) : widgetReady ? (
            <Phone className="w-8 h-8 text-white" />
          ) : (
            <PhoneOff className="w-8 h-8 text-white" />
          )}
        </div>
        
        {isLoading ? (
          <div>
            <p className="text-blue-400 font-medium">Initializing Voice Agent...</p>
            <p className="text-sm text-gray-400 mt-2">Please wait while we set up your interview</p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Loading widget from: {import.meta.env.VITE_OMNIDIMENSION_WIDGET_URL}</p>
            </div>
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
        ) : widgetReady ? (
          <div>
            <p className="text-green-400 font-medium">Voice Agent Ready</p>
            <p className="text-sm text-gray-400 mt-2">You can now start your interview</p>
          </div>
        ) : (
          <div>
            <p className="text-yellow-400 font-medium">Widget Not Ready</p>
            <p className="text-sm text-gray-400 mt-2">Please check your configuration</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-300 mb-2">Interview Tips:</h4>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Take your time to think before answering</li>
          <li>• Be specific and provide examples when possible</li>
          <li>• Ask questions about the role and company</li>
          <li>• Stay calm and confident</li>
        </ul>
      </div>

      {/* Status Indicators */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-200 mb-2">System Status:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${widgetReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-300">Widget: {widgetReady ? 'Ready' : 'Not Ready'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-gray-300">Call: {isCallActive ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>

      {/* Call ID Display */}
      <div className="text-center mb-6">
        <div className="text-xs text-gray-500">
          Session ID: <span className="font-mono text-gray-400">{callId}</span>
        </div>
      </div>

      {/* OmniDimension Widget Container */}
      <div id="omnidimension-widget-container" className="mt-6 min-h-[200px] bg-gray-900 rounded-lg border border-gray-600 p-4">
        {!widgetReady && !isLoading && (
          <div className="text-center text-gray-400 py-8">
            <p>Widget container ready, waiting for initialization...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceAgent;