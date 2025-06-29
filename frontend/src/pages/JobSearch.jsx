import React, { useState } from "react";
import styled from "styled-components";

// Styled-components for killer CSS
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f6f7fb;
  font-family: 'Segoe UI', Arial, sans-serif;
`;

const Sidebar = styled.div`
  flex: 0 0 340px;
  background: #fff;
  padding: 2rem 1.5rem;
  box-shadow: 2px 0 16px rgba(40, 60, 90, 0.07);
  border-radius: 0 24px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Main = styled.div`
  flex: 1;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.7rem 1rem;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  background: #1976d2;
  color: #fff;
  padding: 0.9rem 0;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: #1565c0;
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
`;

const JobCard = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(40, 60, 90, 0.09);
  padding: 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
`;

const JobHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 8px;
  background: #f0f0f0;
  object-fit: contain;
  border: 1px solid #eee;
`;

const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const JobTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
`;

const Company = styled.span`
  font-size: 0.97rem;
  color: #1976d2;
  font-weight: 500;
`;

const Location = styled.span`
  font-size: 0.92rem;
  color: #555;
`;

const Type = styled.span`
  font-size: 0.89rem;
  color: #888;
  background: #e3f2fd;
  border-radius: 6px;
  padding: 2px 8px;
  margin-top: 3px;
  display: inline-block;
`;

const ApplyLink = styled.a`
  background: #43b06c;
  color: #fff;
  padding: 0.6rem 1.3rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  margin-top: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: #388e3c;
  }
`;

const NoJobs = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

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
    <Container>
      <Sidebar>
        <Title>Find Jobs & Internships</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label>Job Title & Location</Label>
            <Input
              name="query"
              placeholder="e.g. developer jobs in chicago"
              value={form.query}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Employment Type</Label>
            <Select
              name="employment_types"
              value={form.employment_types}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="FULLTIME">Full-time</option>
              <option value="PARTTIME">Part-time</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="INTERN">Internship</option>
            </Select>
          </div>
          <div>
            <Label>Posted Within</Label>
            <Select
              name="date_posted"
              value={form.date_posted}
              onChange={handleChange}
            >
              <option value="all">Anytime</option>
              <option value="today">Today</option>
              <option value="3days">Last 3 Days</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </Select>
          </div>
          <Button type="submit">{loading ? "Searching..." : "Search"}</Button>
        </Form>
      </Sidebar>
      <Main>
        {loading ? (
          <NoJobs>Loading jobs...</NoJobs>
        ) : jobs.length === 0 ? (
          <NoJobs>No jobs found. Try a different search.</NoJobs>
        ) : (
          <JobsGrid>
            {jobs.map(job => (
              <JobCard key={job.job_id}>
                <JobHeader>
                  {job.employer_logo ? (
                    <Logo src={job.employer_logo} alt={job.employer_name} />
                  ) : (
                    <Logo as="div" />
                  )}
                  <JobInfo>
                    <JobTitle>{job.job_title}</JobTitle>
                    <Company>{job.employer_name}</Company>
                    <Location>{job.job_location}</Location>
                    <Type>{job.job_employment_type}</Type>
                  </JobInfo>
                </JobHeader>
                <ApplyLink href={job.job_apply_link} target="_blank" rel="noopener noreferrer">
                  Apply
                </ApplyLink>
              </JobCard>
            ))}
          </JobsGrid>
        )}
      </Main>
    </Container>
  );
}
