// Navbar.jsx
import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Menu, X, Mic, FlaskConical, Briefcase, BarChart3, FileText, ListTodo, Settings } from 'lucide-react';
import logo from "./../assets/logo.png";
import { UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  return (
    <nav className="bg-black shadow-sm border-b border-gray-800 sticky top-0 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-black text-black rounded-lg mr-3">
              <img src={logo} alt="OmniPrep Logo" className="w-16 h-16 object-contain" />
            </div>
            <span className="text-2xl font-bold text-white">
              OmniPrep
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <NavLink to="/home" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Dashboard
              </NavLink>
              <NavLink to="/mock-interview" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <Mic className="w-4 h-4 mr-1" />
                Mock Interviews
              </NavLink>
              <NavLink to="/practise-section" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <FlaskConical className="w-4 h-4 mr-1" />
                Practice Mode
              </NavLink>
              <NavLink to="/job-search" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Job Matching
              </NavLink>
              <NavLink to="/reports" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Reports
              </NavLink>
              <NavLink to="/upcoming-interview" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <ListTodo className="w-4 h-4 mr-1" />
                Your Interviews
              </NavLink>
            </div>
          </div>

          {/* User & Notifications */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Settings className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-800 p-2 rounded-md text-white hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-white">
            <NavLink to="/home" className="block px-3 py-2 text-base font-medium hover:text-gray-300">Dashboard</NavLink>
            <NavLink to="/mock-interview" className="block px-3 py-2 text-base font-medium hover:text-gray-300">Mock Interviews</NavLink>
            <NavLink to="/practise-section" className="block px-3 py-2 text-base font-medium hover:text-gray-300">Practice Mode</NavLink>
            <NavLink to="/job-search" className="block px-3 py-2 text-base font-medium hover:text-gray-300">Job Matching</NavLink>
            <NavLink to="#" className="block px-3 py-2 text-base font-medium hover:text-gray-300">Reports</NavLink>
            <NavLink to="/upcoming-interview" className="block px-3 py-2 text-base font-medium hover:text-gray-300">Your Interviews</NavLink>
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-3 space-x-3">
                <UserButton />
                {isSignedIn && user && (
                  <span className="text-sm font-medium text-gray-300">{user.fullName}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
