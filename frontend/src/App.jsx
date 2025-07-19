import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import JobSearch from "./pages/JobSearch";
import PractiseSection from "./pages/PractiseSection";
import Mockinterview from "./pages/Mockinterview";
import UpcomingInterviewsPage from "./pages/UpcomingInterview";
import NotificationHandler from "./pages/NotificationHandler";
import Reports from './pages/Reports';

// Add this route

function App() {
  return (
    <Router>
       <NotificationHandler /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/practise-section" element={<PractiseSection />} />
        <Route path="/mock-interview" element={<Mockinterview />} />
        <Route path="/job-search" element={<JobSearch />} />
                 <Route path="/reports" element={<Reports />} />
        <Route 
          path="/sign-in" 
          element={
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
              <SignIn redirectUrl="/home" />
            </div>
          } 
        />
        
        <Route 
          path="/sign-up" 
          element={
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
              <SignUp redirectUrl="/home" />
            </div>
          } 
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upcoming-interview"
          element={
            <ProtectedRoute>
              <UpcomingInterviewsPage/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;