import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(5, 7, 15, 0.85)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #00d9c8, #7c6ff7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🎯</div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.2rem', color: 'var(--text)', letterSpacing: '-0.02em',
          }}>
            Job<span style={{ color: 'var(--accent)' }}>Fit</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {location.pathname === '/results' && (
            <Link to="/" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              ← New Analysis
            </Link>
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Built with Gemini AI ✨
          </span>
        </div>
      </div>
    </nav>
  );
}
