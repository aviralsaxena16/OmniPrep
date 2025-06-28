import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome </h1>
      <button onClick={() => navigate("/sign-in")} style={{ margin: "10px" }}>
        Login
      </button>
      <button onClick={() => navigate("/sign-up")} style={{ margin: "10px" }}>
        Sign Up
      </button>
    </div>
  );
}

export default LandingPage;
