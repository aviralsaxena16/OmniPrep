import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-white/20 animate-pulse"
              style={{ 
                animationDelay: `${i * 0.05}s`,
                animationDuration: '4s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        
        {/* Logo/Title */}
        <div className="mb-12 transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              VOICE
            </span>
            <span className="text-white">MIRROR</span>
          </h1>
          <div className="w-32 h-0.5 bg-white mx-auto animate-pulse"></div>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed text-gray-300 font-light">
          Master your voice, ace your interviews
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl">
          <div className="group p-6 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300 hover:bg-white/5">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎤</div>
            <h3 className="text-lg font-semibold mb-2">AI Mock Interviews</h3>
            <p className="text-gray-400 text-sm">
              Practice with our AI interviewer that poses real questions and provides instant feedback
            </p>
          </div>
          
          <div className="group p-6 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300 hover:bg-white/5">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💬</div>
            <h3 className="text-lg font-semibold mb-2">Confidence Coaching</h3>
            <p className="text-gray-400 text-sm">
              Improve your speaking confidence with personalized suggestions and grammar corrections
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <button 
            onClick={() => navigate("/sign-up")}
            className="group relative px-8 py-4 bg-white text-black font-semibold text-lg tracking-wide hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="relative z-10">GET STARTED</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button 
            onClick={() => navigate("/sign-in")}
            className="group px-8 py-4 border border-white text-white font-semibold text-lg tracking-wide hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            SIGN IN
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm max-w-md">
          Join thousands of professionals who've transformed their interview skills with VoiceMirror
        </p>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white rounded-full animate-ping opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-6 h-6 border border-white rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-1/3 right-10 w-2 h-2 bg-white rounded-full animate-bounce opacity-20"></div>
        <div className="absolute bottom-1/3 left-10 w-3 h-3 border border-white rounded-full animate-spin opacity-20" style={{ animationDuration: '8s' }}></div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}

export default LandingPage;