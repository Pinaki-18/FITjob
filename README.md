# JobFit — AI Resume Analyzer

Know your chances before you apply.

JobFit is an AI-powered platform that helps IT professionals maximize their interview chances by analyzing how well their resume matches a job description.

## The Problem
Everyone in the IT field faces the same problem — not getting interview calls. People waste time applying to jobs where their resume doesn't match the requirements at all.

## The Solution
JobFit solves this by giving you:
- **ATS Match Score** — Know exactly how well your resume matches the JD (0-100%)
- **Keyword Suggester** — AI finds missing keywords to boost your chances
- **Live Job Search** — Find real matching jobs from 50+ portals instantly

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express |
| AI | Groq AI (Llama 3.3 70B) |
| PDF Parsing | pdf-parse |
| Job Search | JSearch API (RapidAPI) |

## Features
- Resume PDF upload with drag and drop
- Job Description input
- AI-powered ATS match score
- Matching and missing keyword analysis
- Strengths and improvement suggestions
- Live job listings from 50+ portals
- Fully responsive UI

## Run Locally

### Prerequisites
- Node.js v18+
- Groq API Key (free at [console.groq.com](https://console.groq.com))
- RapidAPI Key (free at [rapidapi.com](https://rapidapi.com))

### Setup

**Backend:**
```bash
cd server
npm install
```
Create `.env` file:
```
GROQ_API_KEY=your_groq_key
RAPID_API_KEY=your_rapidapi_key
PORT=5000
```
```bash
node server.js
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000`

## Built By
**Pinaki Mishra**
- GitHub:(https://github.com/Pinaki-18)
- LinkedIn: (linkedin.com/in/pinaki18mishra)

---
Star this repo if you found it helpful!
