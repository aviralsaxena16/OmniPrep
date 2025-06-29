import React, { useState , useEffect} from 'react';
import { UserButton,useUser,useAuth } from "@clerk/clerk-react";
import { 
  Menu, 
  X, 
  Mic, 
  TrendingUp, 
  FlaskConical, 
  Briefcase, 
  BarChart3, 
  Target, 
  Clock, 
  FileText,
  ArrowRight,
  Zap,
  Settings,
  Bell,
  Calendar,
  Download,
  Activity
} from 'lucide-react';

export default function PrepMateHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
   const { getToken } = useAuth();
  //  useEffect(() => {
  //   const syncUser = async () => {
  //     if (!isSignedIn || !user) return;

  //     const token = await getToken(); // Clerk JWT for backend auth

  //     await fetch("http://localhost:5000/store-user", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   };

  //   syncUser();
  // }, [isSignedIn, user,getToken]);
useEffect(() => {
  const syncUser = async () => {
    if (!isSignedIn || !user) return;

    try {
      const token = await getToken();

      const userData = {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName,
      };

      console.log("User synced:", userData);

      const res = await fetch("http://localhost:5000/store-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        console.error("Failed to store user:", await res.text());
      }
    } catch (err) {
      console.error("Error storing user:", err);
    }
  };

  syncUser();
}, [isSignedIn, user, getToken]);


  const quickStats = [
    { label: "Interviews Completed", value: "12", icon: <Mic className="w-5 h-5 text-black" />, bg: "bg-gray-100" },
    { label: "Average Confidence", value: "78%", icon: <TrendingUp className="w-5 h-5 text-black" />, bg: "bg-gray-100" },
    { label: "Practice Sessions", value: "24", icon: <FlaskConical className="w-5 h-5 text-black" />, bg: "bg-gray-100" },
    { label: "Jobs Applied", value: "8", icon: <Briefcase className="w-5 h-5 text-black" />, bg: "bg-gray-100" }
  ];

  const recentActivity = [
    { action: "Completed Mock Interview", role: "Software Engineer at TechCorp", time: "2 hours ago", score: 82 },
    { action: "Practice Session", role: "Behavioral Questions", time: "1 day ago", score: 75 },
    { action: "Downloaded Report", role: "Frontend Developer Interview", time: "2 days ago", score: 88 },
    { action: "Job Match Found", role: "React Developer at StartupXYZ", time: "3 days ago", score: null }
  ];

  const upcomingInterviews = [
    { company: "TechCorp", position: "Senior Frontend Developer", date: "Tomorrow", time: "2:00 PM" },
    { company: "DataFlow Inc", position: "Full Stack Engineer", date: "July 2", time: "10:30 AM" }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-black text-white p-2 rounded-lg mr-3">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-black">
                PrepMate
              </span>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <a href="#" className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Dashboard
                </a>
                <a href="#" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors flex items-center">
                  <Mic className="w-4 h-4 mr-1" />
                  Mock Interviews
                </a>
                <a href="#" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors flex items-center">
                  <FlaskConical className="w-4 h-4 mr-1" />
                  Practice Mode
                </a>
                <a href="#" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  Job Matching
                </a>
                <a href="#" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Reports
                </a>
              </div>
            </div>
            {/* User Profile & Notifications */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Settings className="w-5 h-5 text-gray-700 hover:text-black cursor-pointer" />
                <UserButton afterSignOutUrl="/sign-in" />
                {/* <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                  <UserButton afterSignOutUrl="/sign-in" />
                </div> */}
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-100 p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-200 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="text-black block px-3 py-2 text-base font-medium items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </a>
              <a href="#" className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium items-center">
                <Mic className="w-4 h-4 mr-2" />
                Mock Interviews
              </a>
              <a href="#" className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium items-center">
                <FlaskConical className="w-4 h-4 mr-2" />
                Practice Mode
              </a>
              <a href="#" className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Matching
              </a>
              <a href="#" className="text-gray-700 hover:t
              ext-black block px-3 py-2 text-base font-medium items-center">
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </a>
              <div className="border-t pt-4 pb-3">
                <div className="flex items-center px-3 space-x-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    JD
                  </div>
                  <span className="text-sm font-medium text-gray-700">John Doe</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">{isLoaded && isSignedIn && user?.firstName
          ? `Welcome back, ${user.firstName}!`
          : "Welcome!"}</h1>
          <p className="text-gray-700">Ready to ace your next interview? Let's continue your preparation journey.</p>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex items-center">
              <div className={`${stat.bg} p-3 rounded-full mr-4 flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className="flex-1 text-right">
                <div className="text-2xl font-bold text-black">{stat.value}</div>
                <div className="text-sm text-gray-700">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Mock Interview Card */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg flex flex-col justify-between">
            <div className="flex items-center mb-4">
              <div className="bg-black p-3 rounded-full mr-4 flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">Mock Interview</h3>
                <p className="text-gray-600">Full interview simulation with AI feedback</p>
              </div>
            </div>
            <button className="mt-4 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center w-fit">
              Start Interview
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          {/* Practice Mode Card */}
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-800 shadow-lg flex flex-col justify-between">
            <div className="flex items-center mb-4">
              <div className="bg-white p-3 rounded-full mr-4 flex items-center justify-center">
                <FlaskConical className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Practice Mode</h3>
                <p className="text-gray-300">Quick practice on specific topics</p>
              </div>
            </div>
            <button className="mt-4 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center w-fit">
              Start Practice
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">Recent Activity</h3>
              <a href="#" className="text-black hover:text-gray-700 text-sm font-medium">View All</a>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <Activity className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-medium text-black">{activity.action}</p>
                      <p className="text-sm text-gray-700">{activity.role}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  {activity.score && (
                    <div className="text-right">
                      <div className="text-lg font-semibold text-black">{activity.score}%</div>
                      <div className="text-xs text-gray-700">Score</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Upcoming Interviews */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">Upcoming</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcomingInterviews.map((interview, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-black">{interview.company}</h4>
                    <span className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full">
                      {interview.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{interview.position}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {interview.time}
                  </div>
                </div>
              ))}
              <button className="w-full text-center text-black hover:text-gray-700 text-sm font-medium py-2">
                Schedule Practice Interview
              </button>
            </div>
          </div>
        </div>
        
        
      </div>
        <footer className="w-full bg-white border-t border-gray-200 py-6">
  <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
    © 2025 PrepMate. All rights reserved. Built with <span className="text-red-500" aria-label="love">❤️</span> for your success.
  </div>
</footer>


    </div>
  );
}
