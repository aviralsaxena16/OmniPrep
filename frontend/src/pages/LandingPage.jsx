import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import landing from "./../assets/landing.png";

function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const features = [
    {
      icon: "🎤",
      title: "Mock Interview Practice",
      description:
        "Practice with our advanced Omni Voice Agent that conducts realistic interviews with detailed feedback on every answer"
    },
    {
      icon: "🛣️",
      title: "Voice-Powered Coaching",
      description:
        "Get real-time feedback on your speaking style, confidence, and delivery through our intelligent voice analysis"
    },
    {
      icon: "🔍",
      title: "Smart Job Search",
      description:
        "Find relevant job opportunities and prepare specifically for the companies and roles you're targeting"
    },
    {
      icon: "🗕️",
      title: "Interview Tracker",
      description:
        "Manage your upcoming interviews and track your completed sessions with performance analytics"
    }
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler for navigation links
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-hidden relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-black rounded-full animate-ping opacity-10"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-black rounded-full animate-pulse opacity-20"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 border border-black rounded-full animate-spin opacity-10" style={{ animationDuration: "8s" }}></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 border border-black rounded-full animate-bounce opacity-10"></div>
        <div className="absolute top-1/2 left-8 w-1.5 h-1.5 bg-black rounded-full animate-pulse opacity-10"></div>
        <div className="absolute top-1/3 right-12 w-2.5 h-2.5 border border-black rounded-full animate-ping opacity-10"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="grid grid-cols-20 gap-2 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={i}
              className="border border-black/10 animate-pulse"
              style={{ animationDelay: `${i * 0.02}s`, animationDuration: "6s" }}
            ></div>
          ))}
        </div>
      </div>

      {/* Header - Fixed with better visibility */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">Omni</span>
            <span className="text-black">Prep</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm text-gray-800">
            <a 
              href="#features" 
              onClick={(e) => handleNavClick(e, 'features')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <Link 
              to="/sign-in" 
              className="border border-black px-4 py-2 hover:bg-black hover:text-white transition-all duration-300"
            >
              Sign In
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-black"></div>
              <div className="w-full h-0.5 bg-black"></div>
              <div className="w-full h-0.5 bg-black"></div>
            </div>
          </button>
        </div>
      </header>

      {/* Hero Section - Added padding top to account for fixed header */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between min-h-screen px-8 md:px-20 py-12 pt-24 text-left">
        <div className="max-w-xl md:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="text-black animate-pulse">OmniPrep</span><br />
            <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">Don't just know the answer,</span><br />
            <span className="text-black">say it right.</span>
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed">
            Master your interview skills with <span className="text-black font-semibold">OmniPrep</span>'s advanced voice agent. Get detailed feedback, improve your delivery, and track your journey to success.
          </p>

          <div className="flex gap-4 mt-4">
            <Link to="/sign-up" className="bg-black text-white px-6 py-3 font-semibold rounded hover:bg-gray-900 transition">Join Now</Link>
            <Link to="/demo" className="border border-black text-black px-6 py-3 font-semibold rounded hover:bg-black hover:text-white transition">Try Demo</Link>
          </div>
        </div>

        {/* Image */}
        <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center items-center">
          <img
            src={landing}
            alt="Interview Illustration"
            className="w-[90%] sm:w-full max-w-3xl object-contain rounded-lg"
          />
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-8 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"> Succeed</span>
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Comprehensive interview preparation powered by advanced voice AI
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 border border-black/10 bg-white hover:border-black/20 transition-all duration-500 hover:shadow-lg transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20 px-8 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-black">How OmniPrep Works</h2>
          <div className="grid md:grid-cols-3 gap-12 text-gray-700">
            <div className="space-y-4">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold">Choose Your Path</h3>
              <p>Select mock interviews, job search, or practice sessions based on your needs</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold">Practice with AI</h3>
              <p>Engage with our Omni Voice Agent for realistic interview experiences</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold">Get Detailed Feedback</h3>
              <p>Receive comprehensive analysis and improvement suggestions for every answer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20 px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of professionals who have transformed their interview skills with OmniPrep
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/sign-up" 
              className="bg-white text-black px-8 py-4 font-semibold rounded hover:bg-gray-100 transition-all duration-300 text-lg"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-white">Omni</span>
                <span className="text-gray-400">Prep</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Master your interview skills with AI-powered voice coaching and get the job you deserve.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 OmniPrep. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;