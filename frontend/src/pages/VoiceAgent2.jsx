import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff, User, AlertCircle } from 'lucide-react';

function VoiceAgent2({ name, education, experience, jobRole, companyName, onInterviewComplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    const widgetUrl = import.meta.env.VITE_OMNIDIMENSION_WIDGET_URL;

    if (!widgetUrl) {
      setError('Widget URL not configured. Please check your environment variables.');
      setIsLoading(false);
      return;
    }

    // Remove old script if already exists (avoid duplicate widgets)
    const existingScript = document.getElementById("omnidimension-web-widget");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.src = widgetUrl;
    script.async = true;
    script.id = "omnidimension-web-widget";

    const handleWidgetMessage = (event) => {
      if (event.origin !== new URL(widgetUrl).origin) return;

      if (event.data?.type === 'callEnded') {
        console.log('✅ OmniDimension Call Ended');
        onInterviewComplete?.();
      }
    };

    window.addEventListener("message", handleWidgetMessage);

    script.onload = () => {
      console.log('✅ Voice Agent widget script loaded.');
      setWidgetReady(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setError('Failed to load voice agent script. Check your connection or widget key.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("omnidimension-web-widget");
      if (scriptToRemove) scriptToRemove.remove();
      window.removeEventListener("message", handleWidgetMessage);
    };
  }, [onInterviewComplete]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setWidgetReady(false);
    // Simply re-run effect by forcing React to remount this component
    const script = document.getElementById("omnidimension-web-widget");
    if (script) script.remove();
    setTimeout(() => setIsLoading(false), 500); 
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Mock Interview Session</h2>

      {/* Candidate Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Candidate Info:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
          <div><User className="inline w-4 h-4 mr-1 text-blue-400" /> <strong>Name:</strong> {name}</div>
          <div><strong>Education:</strong> {education}</div>
          <div><strong>Job Role:</strong> {jobRole}</div>
          <div><strong>Company:</strong> {companyName}</div>
          <div><strong>Experience:</strong> {experience}</div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
          isLoading ? 'bg-blue-600' : widgetReady ? 'bg-green-600' : 'bg-yellow-600'
        }`}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : widgetReady ? (
            <Phone className="w-8 h-8 text-white" />
          ) : (
            <PhoneOff className="w-8 h-8 text-white" />
          )}
        </div>

        <div>
          {isLoading ? (
            <p className="text-blue-400">Loading voice agent...</p>
          ) : widgetReady ? (
            <p className="text-green-400">Voice Agent Ready. Use the icon at bottom-right to start.</p>
          ) : (
            <p className="text-yellow-400">Widget not loaded. Check configuration.</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-800 border border-red-700 text-red-300 p-4 rounded mb-6">
          <AlertCircle className="w-6 h-6 mb-2 inline" /> {error}
          <div className="mt-4">
            <button onClick={handleRetry} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white">
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceAgent2;
