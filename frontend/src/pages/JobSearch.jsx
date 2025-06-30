import React, { useState } from "react";

// API fetch function
async function fetchJobs(params) {
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
  
  const headers = {
    "X-RapidAPI-Key": "6252361aafmshfcdb9a2f67451b5p142b34jsn6b33251230e1",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
  };
  
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('API Error:', error);
    // Return mock data for demo
    return [
      {
        job_id: "1",
        job_title: "Senior Frontend Developer",
        employer_name: "Tech Innovations Inc.",
        job_location: "San Francisco, CA",
        job_employment_type: "FULLTIME",
        job_apply_link: "https://example.com/apply/1",
        employer_logo: null
      },
      {
        job_id: "2",
        job_title: "UX/UI Designer",
        employer_name: "Creative Studios",
        job_location: "New York, NY",
        job_employment_type: "FULLTIME",
        job_apply_link: "https://example.com/apply/2",
        employer_logo: null
      },
      {
        job_id: "3",
        job_title: "Data Scientist",
        employer_name: "Analytics Pro",
        job_location: "Remote",
        job_employment_type: "CONTRACTOR",
        job_apply_link: "https://example.com/apply/3",
        employer_logo: null
      }
    ];
  }
}

export default function JobSearchApp() {
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
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const jobsData = await fetchJobs(form);
      setJobs(jobsData);
    } catch (err) {
      setJobs([]);
      console.error(err);
    }
    setLoading(false);
  };

  const formatEmploymentType = (type) => {
    const types = {
      'FULLTIME': 'Full-time',
      'PARTTIME': 'Part-time',
      'CONTRACTOR': 'Contract',
      'INTERN': 'Internship'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-black tracking-tight">Job Search</h1>
              <p className="text-gray-600 text-lg mt-1">Discover your next career opportunity</p>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {/* <span className="text-sm font-medium text-gray-500">Powered by AI</span> */}
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-1 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Search Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-32">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-2">Find Jobs</h2>
                <p className="text-gray-600">Filter your perfect match</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wider">
                    Job Title & Location
                  </label>
                  <input
                    name="query"
                    placeholder="e.g. developer jobs in chicago"
                    value={form.query}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wider">
                    Employment Type
                  </label>
                  <select
                    name="employment_types"
                    value={form.employment_types}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-400 bg-white appearance-none cursor-pointer"
                  >
                    <option value="">All Types</option>
                    <option value="FULLTIME">Full-time</option>
                    <option value="PARTTIME">Part-time</option>
                    <option value="CONTRACTOR">Contractor</option>
                    <option value="INTERN">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wider">
                    Posted Within
                  </label>
                  <select
                    name="date_posted"
                    value={form.date_posted}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:border-black focus:outline-none transition-all duration-300 hover:border-gray-400 bg-white appearance-none cursor-pointer"
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
                  className="w-full bg-black text-white py-4 px-6 rounded-xl font-bold text-base hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Searching...
                    </div>
                  ) : (
                    "Search Jobs"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <div className="text-2xl font-bold text-black mb-2">Finding Opportunities</div>
                  <div className="text-gray-600">Searching through thousands of jobs...</div>
                </div>
              </div>
            ) : !hasSearched ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                <div className="text-8xl mb-8">🚀</div>
                <h3 className="text-3xl font-bold text-black mb-4">Ready to Launch Your Career?</h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Enter your dream job title and location to discover thousands of opportunities waiting for you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="font-bold text-black mb-2">Targeted Search</h4>
                    <p className="text-gray-600 text-sm">Find jobs that match your skills</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="font-bold text-black mb-2">Real-time Results</h4>
                    <p className="text-gray-600 text-sm">Fresh opportunities updated daily</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌟</span>
                    </div>
                    <h4 className="font-bold text-black mb-2">Top Companies</h4>
                    <p className="text-gray-600 text-sm">Connect with leading employers</p>
                  </div>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-3xl font-bold text-black mb-4">No Jobs Found</h3>
                <p className="text-xl text-gray-600 mb-8">Try adjusting your search criteria or broadening your search terms.</p>
                <div className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto">
                  <h4 className="font-bold text-black mb-3">Search Tips:</h4>
                  <ul className="text-left space-y-2 text-gray-600">
                    <li>• Use broader job titles</li>
                    <li>• Try different locations</li>
                    <li>• Remove employment type filters</li>
                    <li>• Expand date range</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-black mb-2">Search Results</h2>
                      <p className="text-gray-600 text-lg">
                        Found <span className="font-bold text-black">{jobs.length}</span> opportunities for you
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                        ✨ Fresh results
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {jobs.map((job, index) => (
                    <div
                      key={job.job_id}
                      className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-black hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex items-start gap-5 flex-1">
                          {job.employer_logo ? (
                            <img
                              src={job.employer_logo}
                              alt={job.employer_name}
                              className="w-16 h-16 rounded-2xl object-contain border-2 border-gray-100 group-hover:border-black transition-all duration-300"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 group-hover:border-black transition-all duration-300 flex items-center justify-center">
                              <span className="text-gray-500 font-bold text-lg">
                                {job.employer_name?.charAt(0) || "?"}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300">
                              {job.job_title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="text-lg font-semibold text-gray-800">{job.employer_name}</div>
                              <div className="text-gray-500">•</div>
                              <div className="text-gray-600 flex items-center">
                                <span className="mr-2">📍</span>
                                {job.job_location}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              {job.job_employment_type && (
                                <span className="inline-flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-xl text-sm font-medium group-hover:bg-black group-hover:text-white transition-all duration-300">
                                  {formatEmploymentType(job.job_employment_type)}
                                </span>
                              )}
                              <span className="inline-flex items-center bg-blue-50 text-blue-800 px-4 py-2 rounded-xl text-sm font-medium border border-blue-200">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:flex-shrink-0">
                          <a
                            href={job.job_apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full lg:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg text-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            Apply Now →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Section */}
                <div className="mt-12 text-center">
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <h4 className="text-xl font-bold text-black mb-4">Want to see more opportunities?</h4>
                    <p className="text-gray-600 mb-6">Refine your search or try different keywords to discover more jobs.</p>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="bg-gray-100 text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                    >
                      Back to Search
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}