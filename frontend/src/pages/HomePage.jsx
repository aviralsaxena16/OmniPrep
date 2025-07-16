import React, { useState, useEffect } from 'react';
import { UserButton, useUser, useAuth } from "@clerk/clerk-react";
import {  Menu, X, Mic,  TrendingUp,  FlaskConical, Briefcase,  BarChart3, Target, Clock, FileText,ArrowRight,Zap,Settings,Bell,Calendar,Download, Activity, ListTodo} from 'lucide-react';
import { NavLink ,useNavigate} from "react-router-dom"; // Added import
import logo from "./../assets/logo.png"; // imported logo for navbar
import Navbar from './Navbar';

export default function PrepMateHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
 const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

    // Fetch interviews from backend
    const fetchInterviews = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/upcoming-interviews?email=${encodeURIComponent(
            user.primaryEmailAddress.emailAddress
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          setInterviews(data);
        } else {
          setInterviews([]);
        }
      } catch {
        setInterviews([]);
      }
      setLoading(false);
    };
  
    useEffect(() => {
      if (isLoaded && isSignedIn) fetchInterviews();
      // eslint-disable-next-line
    }, [isLoaded, isSignedIn]);

  const upcoming = interviews
  .filter((iv) => !iv.done)
  .sort((a, b) => {
    const aDateTime = new Date(`${a.interviewDate}T${a.interviewTime}`);
    const bDateTime = new Date(`${b.interviewDate}T${b.interviewTime}`);
    return aDateTime - bDateTime;
  })
  .slice(0, 3);


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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

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
            <NavLink to="/mock-interview">
              <button className="mt-4 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center w-fit">
                Start Interview
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </NavLink>
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
            <NavLink to="/practise-section">
              <button className="mt-4 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center w-fit">
                Start Practice
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </NavLink>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">Recent Activity</h3>
              <NavLink to="#" className="text-black hover:text-gray-700 text-sm font-medium">View All</NavLink>
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
              <h3 className="text-xl font-semibold text-black">Upcoming Interviews</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcoming.length>0 ? (
              upcoming.map((interview, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-black">{interview.company}</h4>
                    <span className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full">
                      {new Date(interview.interviewDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{interview.jobRole}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {interview.interviewTime}
                  </div>
                </div>
              ))
              ):(<p className="text-sm text-gray-500 text-center">No upcoming interviews</p>)}
                <button onClick={() => navigate("/upcoming-interview")} className="w-full text-center text-black hover:text-gray-700 text-sm font-medium py-2">
                Click to See your all interviews
              </button>
            </div>
          </div>

        </div>
      </div>
      <footer className="w-full bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          © 2025 OmniPrep. All rights reserved. Built with <span className="text-red-500" aria-label="love">❤️</span> for your success.
        </div>
      </footer>
    </div>
  );
}
