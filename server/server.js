const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume PDF.' });
    }
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: 'Please provide a valid job description.' });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({ error: 'Could not extract text from PDF. Make sure it is not a scanned image PDF.' });
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) and career coach.
Carefully analyze the resume against the job description below.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Respond ONLY in this exact JSON format (no extra text, no markdown, just pure JSON):
{
  "score": <integer 0-100>,
  "jobTitle": "<job title from JD>",
  "matchingKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "analysis": "<2-3 sentence overall assessment>",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "atsRating": "<Poor | Average | Good | Excellent>"
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
    });

    const rawText = completion.choices[0]?.message?.content || '';
    const clean = rawText.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(clean);

    res.json({ success: true, analysis });
  } catch (err) {
    console.error('Analysis error:', err.message);
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'AI response parsing failed. Please try again.' });
    }
    res.status(500).json({ error: 'Analysis failed. Please try again.', details: err.message });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const { query, location = 'India' } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Job query is required.' });
    }

    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: `${query} in ${location}`,
        page: '1',
        num_pages: '2',
        date_posted: 'month',
        country: 'in'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    const rawJobs = response.data.data || [];

    const jobs = rawJobs.slice(0, 12).map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', '),
      type: job.job_employment_type || 'Full Time',
      isRemote: job.job_is_remote || false,
      description: job.job_description ? job.job_description.slice(0, 250) + '...' : 'No description available.',
      applyLink: job.job_apply_link,
      logo: job.employer_logo || null,
      postedAt: job.job_posted_at_datetime_utc,
      salary: job.job_min_salary && job.job_max_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : null
    }));

    res.json({ success: true, jobs, total: rawJobs.length });
  } catch (err) {
    console.error('Job search error:', err.message);
    res.status(500).json({ error: 'Job search failed.', details: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'JobFit server is running ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 JobFit server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});