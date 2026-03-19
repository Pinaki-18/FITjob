import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ── Score Circle Component ─────────────────────────────────────────────────────
function ScoreCircle({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  const color = score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#ff6b6b';
  const label = score >= 75 ? 'Excellent Match' : score >= 50 ? 'Good Match' : score >= 30 ? 'Weak Match' : 'Poor Match';

  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayed(score); clearInterval(timer); }
      else setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={180} height={180} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={90} cy={90} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
          <circle
            cx={90} cy={90} r={radius} fill="none"
            stroke={color} strokeWidth={10}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.05s ease', filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color }}>
            {displayed}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Match
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 12,
        padding: '6px 20px',
        borderRadius: 999,
        background: `${color}15`,
        border: `1px solid ${color}40`,
        color,
        fontSize: '0.85rem',
        fontWeight: 600,
        display: 'inline-block',
      }}>
        {label}
      </div>
    </div>
  );
}

// ── Job Card Component ─────────────────────────────────────────────────────────
function JobCard({ job }) {
  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 22px' }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Logo */}
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          {job.logo
            ? <img src={job.logo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.textContent = '🏢'; }} />
            : <span style={{ fontSize: 20 }}>🏢</span>
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>
            {job.title}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{job.company}</div>
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {timeAgo(job.postedAt)}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {job.location && (
          <span className="tag tag-blue" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
            📍 {job.location}
          </span>
        )}
        {job.type && (
          <span className="tag" style={{
            fontSize: '0.72rem', padding: '4px 10px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-muted)'
          }}>
            {job.type}
          </span>
        )}
        {job.isRemote && (
          <span className="tag tag-green" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
            🌐 Remote
          </span>
        )}
        {job.salary && (
          <span className="tag" style={{
            fontSize: '0.72rem', padding: '4px 10px',
            background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24'
          }}>
            💰 {job.salary}
          </span>
        )}
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
        {job.description}
      </p>

      <a
        href={job.applyLink}
        target="_blank"
        rel="noreferrer"
        className="btn btn-outline"
        style={{ fontSize: '0.82rem', padding: '9px 16px', textDecoration: 'none', alignSelf: 'flex-start' }}
      >
        Apply Now →
      </a>
    </div>
  );
}

// ── Main Results Page ──────────────────────────────────────────────────────────
export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, fileName, jd } = location.state || {};

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if no data
  useEffect(() => {
    if (!analysis) navigate('/');
  }, [analysis]);

  // Fetch matching jobs
  useEffect(() => {
    if (!analysis?.jobTitle) return;
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs?query=${encodeURIComponent(analysis.jobTitle)}`);
        setJobs(res.data.jobs || []);
      } catch (err) {
        setJobsError('Could not load jobs. Check your RapidAPI key.');
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, [analysis]);

  if (!analysis) return null;

  const atsColors = {
    'Excellent': '#4ade80',
    'Good': '#fbbf24',
    'Average': '#fb923c',
    'Poor': '#ff6b6b',
  };
  const atsColor = atsColors[analysis.atsRating] || 'var(--accent)';

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'keywords', label: '🔑 Keywords' },
    { id: 'jobs', label: `💼 Jobs ${jobs.length > 0 ? `(${jobs.length})` : ''}` },
  ];

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', padding: '48px 0 80px' }}>
      <div className="container">

        {/* Page Header */}
        <div className="animate-fadeUp" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>Analysis Results</h1>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                📄 {fileName} &nbsp;·&nbsp; Role: <span style={{ color: 'var(--accent)' }}>{analysis.jobTitle}</span>
              </div>
            </div>
            <div style={{
              padding: '8px 18px',
              borderRadius: 999,
              background: `${atsColor}10`,
              border: `1px solid ${atsColor}30`,
              color: atsColor,
              fontSize: '0.82rem',
              fontWeight: 600,
            }}>
              ATS Rating: {analysis.atsRating}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="animate-fadeUp delay-1" style={{
          display: 'flex', gap: 4,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 32,
          width: 'fit-content',
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '8px 20px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
              background: activeTab === tab.id ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'transparent',
              color: activeTab === tab.id ? '#05070f' : 'var(--text-muted)',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ─────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="animate-fadeIn">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

              {/* Score Card */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '36px 24px' }}>
                <ScoreCircle score={analysis.score} />
                <div style={{
                  textAlign: 'center',
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  width: '100%',
                }}>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    "{analysis.analysis}"
                  </p>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Strengths */}
                <div className="card">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 14, color: '#4ade80' }}>
                    ✅ Strengths
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {analysis.strengths?.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: '#4ade80', fontSize: '0.8rem', marginTop: 3, flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div className="card">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 14, color: '#fb923c' }}>
                    🔧 Improvements
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {analysis.improvements?.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: '#fb923c', fontSize: '0.8rem', marginTop: 3, flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: KEYWORDS ─────────────────────────────────────────────────── */}
        {activeTab === 'keywords' && (
          <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Matching Keywords */}
            <div className="card">
              <div style={{ marginBottom: 18 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#4ade80' }}>
                  ✅ Matching Keywords
                  <span style={{ marginLeft: 10, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    Found in both your resume and the JD
                  </span>
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {analysis.matchingKeywords?.length > 0
                  ? analysis.matchingKeywords.map((kw, i) => (
                    <span key={i} className="tag tag-green">{kw}</span>
                  ))
                  : <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No matching keywords found.</span>
                }
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="card">
              <div style={{ marginBottom: 18 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#ff6b6b' }}>
                  ⚠️ Missing Keywords
                  <span style={{ marginLeft: 10, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    Add these to your resume to boost your score!
                  </span>
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {analysis.missingKeywords?.length > 0
                  ? analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="tag tag-red">+ {kw}</span>
                  ))
                  : <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Great! No major missing keywords.</span>
                }
              </div>

              {analysis.missingKeywords?.length > 0 && (
                <div style={{
                  marginTop: 20,
                  padding: '14px 18px',
                  background: 'rgba(255, 107, 107, 0.05)',
                  border: '1px solid rgba(255, 107, 107, 0.15)',
                  borderRadius: 10,
                }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    💡 <strong style={{ color: 'var(--text)' }}>Tip:</strong> Don't just copy-paste keywords. Naturally incorporate them into your experience bullet points and skills section. This improves both ATS score and recruiter readability.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: JOBS ─────────────────────────────────────────────────────── */}
        {activeTab === 'jobs' && (
          <div className="animate-fadeIn">
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 4 }}>
                  Matching Jobs for You
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Based on your role: <span style={{ color: 'var(--accent)' }}>{analysis.jobTitle}</span>
                </p>
              </div>
              {jobs.length > 0 && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {jobs.length} jobs found
                </div>
              )}
            </div>

            {jobsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div className="spinner" style={{ margin: '0 auto 16px', borderTopColor: 'var(--accent)', borderColor: 'rgba(0,217,200,0.2)' }} />
                <div>Searching jobs across 50+ portals...</div>
              </div>
            ) : jobsError ? (
              <div style={{
                background: 'rgba(255, 107, 107, 0.08)',
                border: '1px solid rgba(255, 107, 107, 0.2)',
                borderRadius: 12, padding: '24px',
                color: 'var(--danger)', textAlign: 'center',
              }}>
                ⚠️ {jobsError}
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                No jobs found. Try a different search.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                {jobs.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
