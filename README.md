<div align="center">

<img src="https://img.shields.io/badge/JobFit-AI%20Resume%20Analyzer-00d9c8?style=for-the-badge&logoColor=white" />

# JobFit

### Know Your Chances Before You Apply

AI-powered resume analyzer that helps IT professionals stop wasting time on wrong applications and start landing more interview calls.

**[Live Demo](https://fi-tjob.vercel.app)** · **[Report Bug](https://github.com/Pinaki-18/FITjob/issues)** · **[Request Feature](https://github.com/Pinaki-18/FITjob/issues)**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logoColor=white)](https://groq.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://fi-tjob.vercel.app)

</div>

---

## The Problem

99% of IT job seekers face the same issue — sending out dozens of applications and hearing nothing back. The reason? Their resume doesn't align with the job description, and they have no way of knowing that before applying.

## The Solution

JobFit gives you instant clarity. Upload your resume, paste a job description, and know exactly where you stand — before you hit apply.

---

## Features

<table>
  <tr>
    <td><strong>ATS Match Score</strong></td>
    <td>Get a 0-100% match score showing how well your resume aligns with the job description</td>
  </tr>
  <tr>
    <td><strong>Keyword Suggester</strong></td>
    <td>AI identifies missing keywords from the JD so you know exactly what to add to your resume</td>
  </tr>
  <tr>
    <td><strong>Strengths & Improvements</strong></td>
    <td>Understand what you're doing right and what needs work for that specific role</td>
  </tr>
  <tr>
    <td><strong>Live Job Search</strong></td>
    <td>Automatically finds real matching jobs from 50+ portals based on your resume</td>
  </tr>
</table>

---

## Tech Stack

<table>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>React.js, Vite, React Router</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Node.js, Express.js</td>
  </tr>
  <tr>
    <td><strong>AI</strong></td>
    <td>Groq AI — Llama 3.3 70B</td>
  </tr>
  <tr>
    <td><strong>PDF Parsing</strong></td>
    <td>pdf-parse</td>
  </tr>
  <tr>
    <td><strong>Job Search</strong></td>
    <td>JSearch API via RapidAPI</td>
  </tr>
  <tr>
    <td><strong>Deployment</strong></td>
    <td>Vercel (Frontend) + Render (Backend)</td>
  </tr>
</table>

---

## Getting Started

### Prerequisites
- Node.js v18+
- Groq API Key — free at [console.groq.com](https://console.groq.com)
- RapidAPI Key — free at [rapidapi.com](https://rapidapi.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Pinaki-18/FITjob.git
cd FITjob
```

**2. Setup the backend**
```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:
```
GROQ_API_KEY=your_groq_api_key
RAPID_API_KEY=your_rapidapi_key
PORT=5000
```

Start the server:
```bash
node server.js
```

**3. Setup the frontend**
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## How It Works

| Step | Action |
|------|--------|
| 1 | Upload your resume as a PDF |
| 2 | Paste the job description from any job portal |
| 3 | Groq AI analyzes both and generates your match score |
| 4 | Use keyword suggestions and browse matching live jobs |

---

## Built By

**Pinaki Mishra**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Pinaki-18)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/pinaki18mishra)

---

<div align="center">
If you found this helpful, consider giving it a star!
</div>
