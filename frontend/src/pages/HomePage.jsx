import React from "react";
import { UserButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome Home 👋</h2>
      <UserButton />
    </div>
  );
}

export default HomePage;
