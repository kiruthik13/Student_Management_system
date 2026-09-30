import React from 'react';
import './KECLogo.css';

/**
 * Official KEC Logo Component
 * Matches the official Kongu Engineering College branding:
 * - Bubble cluster motif (Teal/Cyan to Leaf Green)
 * - Dual-tone typography: "KONGU" (Green) + "ENGINEERING" (Cyan) + "COLLEGE" (Green)
 * - Autonomous & NAAC A++ credentials
 */
const KECLogo = ({ size = 'medium', showCredentials = true, align = 'center', light = false }) => {
  return (
    <div className={`kec-brand-container ${size} ${align} ${light ? 'light-mode' : ''}`}>
      {/* Official Bubble Motif SVG */}
      <div className="kec-bubble-emblem">
        <svg viewBox="0 0 100 100" className="kec-bubble-svg" aria-label="KEC Emblem">
          <defs>
            <linearGradient id="kecGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0099D8" />
              <stop offset="100%" stopColor="#26A69A" />
            </linearGradient>
            <linearGradient id="kecGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#26A69A" />
              <stop offset="100%" stopColor="#7CB342" />
            </linearGradient>
            <linearGradient id="kecGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A4E4" />
              <stop offset="100%" stopColor="#8BC34A" />
            </linearGradient>
          </defs>
          {/* Main interconnected bubbles matching KEC splash screen */}
          <circle cx="48" cy="38" r="18" fill="url(#kecGrad1)" />
          <circle cx="56" cy="54" r="14" fill="url(#kecGrad2)" opacity="0.95" />
          <circle cx="44" cy="68" r="9" fill="url(#kecGrad1)" opacity="0.9" />
          <circle cx="68" cy="58" r="7" fill="url(#kecGrad3)" opacity="0.85" />
          <circle cx="70" cy="34" r="5" fill="#7CB342" opacity="0.9" />
        </svg>
      </div>

      <div className="kec-brand-text">
        <div className="kec-title-row">
          <span className="kec-word-kongu">KONGU</span>
          <span className="kec-word-eng">ENGINEERING</span>
          <span className="kec-word-college">COLLEGE</span>
        </div>
        <div className="kec-tagline">
          <span className="kec-autonomous">(Autonomous)</span>
          <span className="kec-divider">•</span>
          <span className="kec-motto">Transform Yourself</span>
        </div>
        {showCredentials && (
          <div className="kec-credentials">
            <span className="kec-badge-pill naac">NAAC A++</span>
            <span className="kec-badge-pill nba">NBA</span>
            <span className="kec-badge-pill anna">Anna Univ. Affiliated</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KECLogo;
