import React from 'react';
import './KECLoader.css';

/**
 * Official KEC Loading Animation Component
 * Features:
 * - 5 interconnected KEC bubble dots that zoom in and zoom out (scale pulse)
 * - Official KEC typography: "KONGU" (Green) + "ENGINEERING" (Cyan) + "COLLEGE" (Green)
 * - 3 sequential pulsing loading dots at the bottom
 * - Can be rendered inline or as a full-screen overlay
 */
const KECLoader = ({ 
  fullScreen = false, 
  message = '', 
  size = 'medium' 
}) => {
  const content = (
    <div className={`kec-loader-wrapper ${size}`}>
      {/* 5-Bubble Cluster SVG matching official KEC splash screen */}
      <div className="kec-loader-emblem">
        <svg 
          viewBox="0 0 120 110" 
          className="kec-loader-svg" 
          aria-label="KEC Loading Animation"
        >
          <defs>
            <linearGradient id="kecLoadGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0099D8" />
              <stop offset="100%" stopColor="#26A69A" />
            </linearGradient>
            <linearGradient id="kecLoadGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#26A69A" />
              <stop offset="100%" stopColor="#7CB342" />
            </linearGradient>
            <linearGradient id="kecLoadGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A4E4" />
              <stop offset="100%" stopColor="#8BC34A" />
            </linearGradient>
          </defs>

          {/* 1. Large Top-Left Teal Bubble */}
          <circle 
            cx="46" 
            cy="38" 
            r="19" 
            fill="url(#kecLoadGrad1)" 
            className="kec-zoom-dot dot-main" 
          />

          {/* 2. Center Green-Teal Gradient Bubble */}
          <circle 
            cx="58" 
            cy="56" 
            r="15" 
            fill="url(#kecLoadGrad2)" 
            className="kec-zoom-dot dot-center" 
          />

          {/* 3. Top-Right Small Green Bubble */}
          <circle 
            cx="84" 
            cy="32" 
            r="5.5" 
            fill="#7CB342" 
            className="kec-zoom-dot dot-tr" 
          />

          {/* 4. Bottom-Left Small Cyan Bubble */}
          <circle 
            cx="34" 
            cy="74" 
            r="8" 
            fill="#00A4E4" 
            className="kec-zoom-dot dot-bl" 
          />

          {/* 5. Bottom-Right Leaf Green Bubble */}
          <circle 
            cx="82" 
            cy="72" 
            r="11" 
            fill="url(#kecLoadGrad3)" 
            className="kec-zoom-dot dot-br" 
          />
        </svg>
      </div>

      {/* College Brand Text in exact KEC Colors */}
      <div className="kec-loader-brand-title">
        <span className="brand-word-kongu">KONGU</span>
        <span className="brand-word-eng">ENGINEERING</span>
        <span className="brand-word-college">COLLEGE</span>
      </div>

      {/* 3 Sequential Zooming Dots at the bottom */}
      <div className="kec-loader-dots" aria-hidden="true">
        <span className="pulse-dot p-dot-1"></span>
        <span className="pulse-dot p-dot-2"></span>
        <span className="pulse-dot p-dot-3"></span>
      </div>

      {/* Optional Status message */}
      {message && (
        <p className="kec-loader-message">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="kec-loader-overlay">
        {content}
      </div>
    );
  }

  return content;
};

export default KECLoader;
