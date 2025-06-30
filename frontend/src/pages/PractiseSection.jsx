import { useState } from "react";
import VoiceAgent from "./VoiceAgent";
import { Mic, User, Target, Brain, MessageSquare, Star, ArrowRight } from "lucide-react";
function PractiseSection() {
  const [jobRole, setJobRole] = useState("");
  const [feedback, setFeedback] = useState(null);

  const features = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "AI-Powered Questions",
      description: "Tailored interview questions based on your specific job role"
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Voice Practice",
      description: "Speak naturally - no typing required, just like a real interview"
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Instant Analysis",
      description: "Get immediate feedback on tone, clarity, and confidence"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Targeted Improvement",
      description: "Identify filler words and areas for enhancement"
    }
  ];

  const mockFeedback = {
    confidence: 85,
    clarity: "Excellent",
    fillerWords: ["um", "like"],
    toneSuggestion: "More assertive tone recommended",
    rewrite: "I have extensive experience in React development and have successfully delivered multiple projects."
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header with image right */}
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 mb-16">
  {/* Left: Heading and Text */}
  <div className="flex-1">
    <div className="relative inline-block">
      <h1 className="text-5xl font-bold text-black mb-4">
        Practice with <span className="italic">VoiceMirror</span>
      </h1>
    </div>
    <p className="text-xl text-gray-600 max-w-3xl">
      Master your interview skills with AI-powered voice practice. Get instant feedback and build confidence for your next opportunity.
    </p>
  </div>
  {/* Right: Image */}
  <div className="flex-1 flex justify-center md:justify-end">
    <div className="w-full max-w-md">
      <img
        src="/cover3.png"
        alt="Cover"
        className="w-full h-64 object-cover rounded-xl"
      />
    </div>
  </div>
</div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 border border-gray-100 rounded-lg hover:border-black transition-colors">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon && <div className="text-white">{feature.icon}</div>}
              </div>
              <h3 className="font-semibold text-black mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Practice Area */}
        <div className="max-w-4xl mx-auto">
          {/* How it Works */}
          <div className="bg-gray-50 p-8 rounded-2xl mb-8 border">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
              <Star className="w-6 h-6 mr-2" />
              How This Works
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                  <p className="text-gray-700">Enter your target job role below</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                  <p className="text-gray-700">Click the voice agent to start practicing</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                  <p className="text-gray-700">Answer questions naturally using your voice</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                  <p className="text-gray-700">Receive instant AI feedback and improve</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Role Input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-black mb-3">
              What role are you preparing for?
            </label>
            <div className="relative">
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors pr-12"
                placeholder="e.g. Software Engineer, Product Manager, Data Scientist"
              />
              <ArrowRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {jobRole && (
              <p className="mt-2 text-sm text-gray-600">
                Great! We'll tailor questions specifically for <strong>{jobRole}</strong> roles.
              </p>
            )}
          </div>

          {/* Practice Stats */}
          {jobRole && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <div className="font-bold text-2xl text-black">0</div>
                <div className="text-sm text-gray-600">Questions Completed</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <div className="font-bold text-2xl text-black">--</div>
                <div className="text-sm text-gray-600">Avg Confidence</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <div className="font-bold text-2xl text-black">0</div>
                <div className="text-sm text-gray-600">Practice Minutes</div>
              </div>
            </div>
          )}

          {/* Feedback Panel */}
          {feedback && (
            <div className="bg-white border-2 border-black rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-black mb-6">Your Performance Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Confidence</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-black rounded-full transition-all"
                            style={{ width: `${feedback.confidence}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-black">{feedback.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Clarity</span>
                      <span className="font-semibold text-black">{feedback.clarity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Filler Words</span>
                      <span className="font-semibold text-black">{feedback.fillerWords.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-3">Improvement</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">{feedback.toneSuggestion}</p>
                    <p className="text-sm font-medium text-black">
                      <strong>Suggested response:</strong> "{feedback.rewrite}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mock Feedback Button for Demo */}
          <div className="text-center mb-8">
            <button
              onClick={() => setFeedback(mockFeedback)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Show Sample Feedback
            </button>
          </div>

          {/* Motivational Quote */}
          <div className="text-center p-8 bg-black text-white rounded-2xl">
            <p className="text-lg italic mb-2">
              "Every expert was once a beginner. Every pro was once an amateur."
            </p>
            <p className="text-sm opacity-80">
              Start your journey to interview confidence today.
            </p>
          </div>
        </div>
      </div>

      {/* Voice Agent - Fixed Position */}
      <VoiceAgent jobRole={jobRole} setFeedback={setFeedback} />
    </div>
  );
}

export default PractiseSection;
