import { useState } from "react";
import VoiceAgent from "./VoiceAgent";

function PractiseSection() {
  const [jobRole, setJobRole] = useState("");

  return (
    <div>
      <h1>Welcome to VoiceMirror</h1>

      <form className="mb-4">
        <label htmlFor="jobRole" className="block mb-2 text-sm font-medium text-gray-700">
          Enter Job Role:
        </label>
        <input
          type="text"
          id="jobRole"
          name="jobRole"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Software Engineer, Data Scientist"
          required
        />
      </form>

      <VoiceAgent jobRole={jobRole} />
    </div>
  );
}

export default PractiseSection;
