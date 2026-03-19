import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setError('');
    } else {
      setError('Please upload a PDF file only.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return setError('Please upload your resume PDF.');
    if (jd.trim().length < 50) return setError('Please paste a job description (at least 50 characters).');

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jd);

      const res = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/results', {
        state: {
          analysis: res.data.analysis,
          fileName: file.name,
          jd
        }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', paddingBottom: 80 }}>
      {/* Hero */}
      <section className="container" style={{ paddingTop: 72, paddingBottom: 56, textAlign: 'center' }}>
        <div className="animate-fadeUp">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0, 217, 200, 0.08)',
            border: '1px solid rgba(0, 217, 200, 0.2)',
            borderRadius: 999,
            padding: '6px 16px',
            fontSize: '0.8rem',
            color: 'var(--accent)',
            fontWeight: 500,
            marginBottom: 24,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            <span>✦</span> AI-Powered Resume Analyzer
          </div>
        </div>

        <h1 className="animate-fadeUp delay-1" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', marginBottom: 20 }}>
          Know Your Chances<br />
          <span style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Before You Apply
          </span>
        </h1>

        <p className="animate-fadeUp delay-2" style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: 560,
          margin: '0 auto 48px',
          lineHeight: 1.7,
        }}>
          Upload your resume & paste a job description. Get your match score, missing keywords, and real job listings — instantly.
        </p>

        {/* Stats row */}
        <div className="animate-fadeUp delay-3" style={{
          display: 'flex',
          gap: 32,
          justifyContent: 'center',
          marginBottom: 64,
          flexWrap: 'wrap',
        }}>
          {[
            { val: 'ATS Score', label: 'Match Analysis' },
            { val: 'Keywords', label: 'Smart Suggestions' },
            { val: 'Live Jobs', label: 'From 50+ Portals' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>{s.val}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Form */}
      <section className="container animate-fadeUp delay-4">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          marginBottom: 24,
        }}>
          {/* Resume Upload */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 10, fontSize: '0.95rem' }}>
              📄 Your Resume
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? 'var(--accent)' : file ? 'rgba(74, 222, 128, 0.5)' : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: dragOver ? 'var(--accent-glow)' : file ? 'rgba(74, 222, 128, 0.04)' : 'var(--bg-card)',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 36 }}>{file ? '✅' : '📂'}</div>
              {file ? (
                <>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--success)' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)' }}>
                    Drop your resume here
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    or click to browse · PDF only
                  </div>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* JD Input */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 10, fontSize: '0.95rem' }}>
              💼 Job Description
            </label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here...&#10;&#10;Include requirements, responsibilities, skills needed, etc."
              style={{
                width: '100%',
                height: 200,
                background: 'var(--bg-card)',
                border: `1px solid ${jd.length > 50 ? 'rgba(74, 222, 128, 0.4)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '16px 18px',
                color: 'var(--text)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                minHeight: 200,
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(0, 217, 200, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = jd.length > 50 ? 'rgba(74, 222, 128, 0.4)' : 'var(--border)'}
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6, textAlign: 'right' }}>
              {jd.length} characters {jd.length < 50 && jd.length > 0 && <span style={{ color: 'var(--danger)' }}>· need at least 50</span>}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            color: 'var(--danger)',
            fontSize: '0.9rem',
            marginBottom: 20,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: '16px 48px', fontSize: '1rem', minWidth: 220 }}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Analyzing with AI...
              </>
            ) : (
              <>✦ Analyze My Resume</>
            )}
          </button>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 10 }}>
            Powered by Google Gemini AI · Usually takes 5–10 seconds
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container" style={{ marginTop: 96 }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: 48, fontFamily: 'var(--font-display)' }}>
          How <span style={{ color: 'var(--accent)' }}>JobFit</span> Works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { icon: '📄', step: '01', title: 'Upload Resume', desc: 'Upload your resume as a PDF. We extract all text automatically.' },
            { icon: '💼', step: '02', title: 'Paste Job Description', desc: 'Copy the JD from any job portal and paste it in.' },
            { icon: '🧠', step: '03', title: 'AI Analysis', desc: 'Gemini AI scans both and gives you a match score with insights.' },
            { icon: '🚀', step: '04', title: 'Apply Smarter', desc: 'Get keyword suggestions and matching job listings instantly.' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>
                STEP {item.step}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
