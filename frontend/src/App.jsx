import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Mockinterview from "./pages/Mockinterview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mock-interview" element={<Mockinterview />} />

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
      </Routes>
    </Router>
  );
}

export default App;