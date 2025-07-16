import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import inter from "./../assets/inter.webp";
import logo from "./../assets/logo.png"; // imported logo for navbar

function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const features = [
    {
      icon: "🎤",
      title: "Mock Interview Practice",
      description:
        "Practice with our advanced Omni Voice Agent that conducts realistic interviews with detailed feedback on every answer",
    },
    {
      icon: "🛣️",
      title: "Voice-Powered Coaching",
      description:
        "Get real-time feedback on your speaking style, confidence, and delivery through our intelligent voice analysis",
    },
    {
      icon: "🔍",
      title: "Smart Job Search",
      description:
        "Find relevant job opportunities and prepare specifically for the companies and roles you're targeting",
    },
    {
      icon: "🗣️",
      title: "Interview Tracker",
      description:
        "Manage your upcoming interviews and track your completed sessions with performance analytics",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler for navigation links
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-black rounded-full animate-ping opacity-5"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-black rounded-full animate-pulse opacity-10"></div>
        <div
          className="absolute bottom-32 left-16 w-3 h-3 border border-black rounded-full animate-spin opacity-5"
          style={{ animationDuration: "12s" }}
        ></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 border border-black rounded-full animate-bounce opacity-5"></div>
        <div className="absolute top-1/2 left-8 w-1.5 h-1.5 bg-black rounded-full animate-pulse opacity-8"></div>
        <div className="absolute top-1/3 right-12 w-2.5 h-2.5 border border-black rounded-full animate-ping opacity-5"></div>
      </div>

      {/* Navbar WITHOUT fixed; solid black background always */}
      <header className="bg-black sticky top-0 w-full z-50">
  <div className="px-6 py-3 flex justify-between items-center max-w-7xl mx-auto">

    <div className="flex items-center space-x-4">
      <img src={logo} alt="OmniPrep Logo" className="w-16 h-16 object-contain" />
      <span className="text-white text-4xl font-bold tracking-tight select-none">OmniPrep</span>
    </div>
    <nav className="hidden md:flex space-x-12 text-base font-medium text-gray-300">
      <a
        href="#features"
        onClick={(e) => handleNavClick(e, "features")}
        className="hover:text-white transition-colors cursor-pointer relative group"
      >
        Features
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
      </a>
      <a
        href="#how-it-works"
        onClick={(e) => handleNavClick(e, "how-it-works")}
        className="hover:text-white transition-colors cursor-pointer relative group"
      >
        How It Works
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
      </a>
      <button
        className="bg-white text-black px-6 py-2.5 rounded-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 cursor-pointer font-semibold"
        onClick={() => (window.location.href = "/sign-in")}
      >
        Sign In
      </button>
    </nav>

    {/* Mobile menu button */}
    <button className="md:hidden p-3 rounded hover:bg-gray-700 transition-colors">
      <div className="w-7 h-7 flex flex-col justify-center space-y-2">
        <div className="w-full h-1.5 bg-white rounded-full"></div>
        <div className="w-full h-1.5 bg-white rounded-full"></div>
        <div className="w-full h-1.5 bg-white rounded-full"></div>
      </div>
    </button>
  </div>
</header>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen px-8 md:px-16 lg:px-20 py-12 pt-22">
        <div className="max-w-4xl lg:w-1/2 space-y-8">
          {/* Title */}
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl font-black leading-tight tracking-tight text-black">
              OmniPrep
            </h1>

            <div className="text-4xl lg:text-5xl font-bold leading-tight space-y-4">
              <div className="text-gray-800">
                Don't just <span className="text-black font-black">know</span> the answer,
              </div>
              <div className="text-black font-black">say it right.</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <p className="text-xl text-gray-700 leading-relaxed">
              Master your interview skills with{" "}
              <span className="font-bold text-black">OmniPrep's</span> advanced voice agent. Get
              detailed feedback, improve your delivery, and track your journey to success.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <button
              className="group bg-black text-white px-10 py-4 text-lg font-semibold rounded-sm hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center cursor-pointer"
              onClick={() => (window.location.href = "/sign-up")}
            >
              <span>Join Now</span>
              <svg
                className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <button
              className="group bg-white text-black px-10 py-4 text-lg font-semibold rounded-sm border-2 border-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center cursor-pointer"
              onClick={() => (window.location.href = "/demo")}
            >
              <span>Try Demo</span>
              <svg
                className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-8 mt-10 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span>Real-time Feedback</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span>Voice Analysis</span>
            </div>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center items-center">
          <img
            src={inter}
            alt="Interview Illustration"
            width="100px"
            className="w-full lg:max-w-md h-auto object-contain rounded-xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-8 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-black">
              Everything You Need to
              <span className="block mt-2">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive interview preparation powered by advanced voice AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-lg border border-gray-200 hover:border-black transition-all duration-500 hover:shadow-lg transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-black">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24 px-8 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-black mb-20 text-black">How OmniPrep Works</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                number: "1",
                title: "Choose Your Path",
                description: "Select mock interviews, job search, or practice sessions based on your needs",
              },
              {
                number: "2",
                title: "Practice with AI",
                description: "Engage with our Omni Voice Agent for realistic interview experiences",
              },
              {
                number: "3",
                title: "Get Detailed Feedback",
                description: "Receive comprehensive analysis and improvement suggestions for every answer",
              },
            ].map((step, index) => (
              <div key={index} className="group space-y-6">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-3xl font-black shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-black">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black text-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-3xl font-bold mb-6">
                <span className="text-white">OmniPrep</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Master your interview skills with AI-powered voice coaching and get the job you deserve.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 OmniPrep. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-gray-400 text-sm">Powered by Voice AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
