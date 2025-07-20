import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const router = express.Router();

// Multer setup to store PDF temporarily
const upload = multer({ dest: 'uploads/' });

// Use Groq’s OpenAI-compatible SDK
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // Make sure GROQ_API_KEY is in your .env
  baseURL: 'https://api.groq.com/openai/v1', // Groq-specific base URL
});

router.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const pdfPath = req.file.path;
  let extractedText = '';

  const pythonProcess = spawn('python', ['./scripts/extract_text.py', pdfPath]);

  pythonProcess.stdout.on('data', (data) => {
    extractedText += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on('close', async (code) => {
    fs.unlinkSync(pdfPath); // Delete uploaded file

    if (code !== 0) {
      return res.status(500).send('Failed to extract text from PDF.');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          {
      role: 'system',
      content: `
You are a top-tier career advisor, resume reviewer, and recruitment strategist with years of experience helping candidates craft impactful resumes for competitive roles.

Your task is to carefully analyze the following resume content (raw text) and provide a structured JSON report with the following detailed fields:

{
  "candidate_summary": "Brief high-level summary of the candidate's profile, including education, domain interest, and experience.",
  "core_strengths": ["List the key strengths or standout qualities found in the resume."],
  "areas_of_improvement": ["List specific weak areas in the resume, with reasoning."],
  "red_flags": ["List any inconsistencies, vague claims, formatting issues, or missing information."],
  "resume_quality_rating": {
    "score": "Rate overall quality on a scale of 1-10",
    "justification": "Why this score was given"
  },
  "relevance_for_roles": {
    "software_engineer": "How well does the resume match a software engineering role? (e.g., strong match, moderate match, weak match)",
    "data_scientist": "Same",
    "product_manager": "Same"
  },
  "impact_analysis": "Evaluate whether the projects, internships, and achievements demonstrate measurable impact or outcomes.",
  "suggested_improvements": [
    "Rewrite experience points to show measurable outcomes using action verbs.",
    "Add links to portfolio or GitHub.",
    "Include a professional summary section."
  ],
  "grammar_and_formatting_issues": [
    "Mention any issues with grammar, formatting, alignment, or structure."
  ],
  "final_recommendation": "Summarize what the candidate should prioritize fixing or improving."
}

Only return a *valid JSON object* — no explanation or extra text. Be honest, specific, and use bullet-pointed insights where applicable.
        `.trim()
    },
          {
            role: 'user',
            content: extractedText,
          },
        ],
        temperature: 0,
      });

      let jsonResponse;
      try {
        jsonResponse = JSON.parse(completion.choices[0].message.content);
      } catch (err) {
        console.error("Invalid JSON returned from Groq:", err);
        return res.status(500).send("Groq response was not valid JSON.");
      }

      res.json(jsonResponse);
    } catch (error) {
      console.error('Groq API Error:', error);
      res.status(500).send('Failed to convert text to JSON.');
    }
  });
});

export default router;