import React, { useState, useEffect } from "react";
import { Plus, X, Calendar, Clock, Briefcase } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export default function UpcomingInterviewsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    company: "",
    role: "",
    date: "",
    time: "",
    location: "",
    jobLink: "",
    description: "",
    priority: "Medium",
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add interview (calls backend)
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user?.primaryEmailAddress?.emailAddress) return;
    const payload = {
      email: user.primaryEmailAddress.emailAddress,
      company: form.company,
      jobRole: form.role,
      interviewDate: form.date,
      interviewTime: form.time,
      jobLink: form.jobLink,
      location: form.location,
      jobDescription: form.description,
      priority: form.priority,
    };
    await fetch("http://localhost:5000/upcoming-interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setShowModal(false);
    setForm({
      company: "",
      role: "",
      date: "",
      time: "",
      location: "",
      jobLink: "",
      description: "",
      priority: "Medium",
    });
    fetchInterviews();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-black">Upcoming Interviews</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white p-2 rounded-full hover:bg-gray-900 transition-colors"
            title="Add Interview"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Pop-up */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            aria-modal="true"
            tabIndex={-1}
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-black p-1 rounded-full"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <form
                className="p-6 space-y-4"
                onSubmit={handleAdd}
                autoComplete="off"
              >
                <h2 className="text-xl font-bold text-black mb-2">
                  Add Upcoming Interview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Job Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Interview Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Interview Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Job Link
                    </label>
                    <input
                      type="url"
                      name="jobLink"
                      value={form.jobLink}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Job Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={2}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                  >
                    Add Interview
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-gray-600 hover:text-black px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Interview Cards */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-gray-500 text-center py-8 border border-gray-200 rounded-xl bg-white">
              Loading...
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-gray-500 text-center py-8 border border-gray-200 rounded-xl bg-white">
              No upcoming interviews scheduled.
            </div>
          ) : (
            interviews.map((iv, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-4"
              >
                <div className="flex-shrink-0 flex flex-col items-center justify-center md:w-40 mb-2 md:mb-0">
                  <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mb-2">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      (iv.priority || iv.priority === "High")
                        ? iv.priority === "High"
                          ? "bg-black text-white"
                          : iv.priority === "Medium"
                          ? "bg-gray-200 text-black"
                          : "bg-gray-50 text-gray-600"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {iv.priority || "Medium"} Priority
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-black mb-1">
                    {iv.company}
                  </h2>
                  <div className="flex items-center text-gray-700 mb-2">
                    <span className="font-medium">{iv.jobRole || iv.role}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />{" "}
                      {iv.interviewDate || iv.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />{" "}
                      {iv.interviewTime || iv.time}
                    </span>
                    <span>{iv.location}</span>
                    <span className="truncate max-w-xs">{iv.jobLink}</span>
                  </div>
                  <div className="text-gray-700 text-sm mb-2">
                    {iv.jobDescription || iv.description}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
