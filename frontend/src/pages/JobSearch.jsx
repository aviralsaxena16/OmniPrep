import React, { useState } from "react";

// API fetch function
async function fetchJobs(params) {
  // Construct query string
  const query = encodeURIComponent(params.query || "");
  const page = params.page || 1;
  const num_pages = params.num_pages || 1;
  const country = params.country || "us";
  const date_posted = params.date_posted || "all";
  const employment_types = params.employment_types || "";
  let url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&num_pages=${num_pages}&country=${country}&date_posted=${date_posted}`;
  if (employment_types) {
    url += `&employment_types=${employment_types}`;
  }
  // IMPORTANT: Replace with your actual RapidAPI key!
  const headers = {
    "X-RapidAPI-Key": "6252361aafmshfcdb9a2f67451b5p142b34jsn6b33251230e1", // <-- Replace with your API key
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
  };
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }
  const data = await res.json();
  return data.data || [];
}

export default function JobFetchApp() {
  const [form, setForm] = useState({
    query: "",
    country: "us",
    date_posted: "all",
    employment_types: "",
    page: 1,
    num_pages: 1
  });
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const jobsData = await fetchJobs(form);
      setJobs(jobsData);
    } catch (err) {
      setJobs([]);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="flex-none w-96 bg-white p-8 shadow-2xl border-r border-gray-100 flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-black text-black mb-4">Find Jobs</h1>
          <p className="text-gray-600 text-lg">Discover your next opportunity</p>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-lg font-bold text-black block mb-3">Job Title & Location</label>
            <input
              name="query"
              placeholder="e.g. developer jobs in chicago"
              value={form.query}
              onChange={handleChange}
              required
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-400"
            />
          </div>
          
          <div>
            <label className="text-lg font-bold text-black block mb-3">Employment Type</label>
            <select
              name="employment_types"
              value={form.employment_types}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-400 bg-white"
            >
              <option value="">All Types</option>
              <option value="FULLTIME">Full-time</option>
              <option value="PARTTIME">Part-time</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="INTERN">Internship</option>
            </select>
          </div>
          
          <div>
            <label className="text-lg font-bold text-black block mb-3">Posted Within</label>
            <select
              name="date_posted"
              value={form.date_posted}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-400 bg-white"
            >
              <option value="all">Anytime</option>
              <option value="today">Today</option>
              <option value="3days">Last 3 Days</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white p-5 rounded-2xl text-xl font-bold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4"
          >
            {loading ? "Searching..." : "Search Jobs"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col gap-6">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-2xl font-bold text-black">Searching for jobs...</div>
              <div className="text-gray-600 mt-2">Finding the best opportunities for you</div>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-6">🔍</div>
              <div className="text-3xl font-bold text-black mb-4">No jobs found</div>
              <div className="text-xl text-gray-600">Try adjusting your search criteria</div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-black text-black mb-2">Search Results</h2>
              <p className="text-gray-600 text-lg">Found {jobs.length} opportunities for you</p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {jobs.map(job => (
                <div key={job.job_id} className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-black hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                  <div className="flex items-start gap-4 mb-6">
                    {job.employer_logo ? (
                      <img 
                        src={job.employer_logo} 
                        alt={job.employer_name}
                        className="w-16 h-16 rounded-2xl object-contain border-2 border-gray-100 group-hover:border-black transition-all duration-300"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-gray-200 group-hover:border-black transition-all duration-300"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-black mb-2 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">{job.job_title}</h3>
                      <div className="text-lg font-semibold text-gray-800 mb-1">{job.employer_name}</div>
                      <div className="text-gray-600 mb-3">{job.job_location}</div>
                      {job.job_employment_type && (
                        <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-xl text-sm font-medium group-hover:bg-black group-hover:text-white transition-all duration-300">
                          {job.job_employment_type}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <a 
                    href={job.job_apply_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg text-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Apply Now
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}