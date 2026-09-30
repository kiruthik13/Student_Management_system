import React from 'react';

/**
 * 42 Years of Excellence Gold Circular Badge
 */
export const Badge42Years = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="kec-badge-42" aria-label="42 Years Badge">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF3B0" />
        <stop offset="25%" stopColor="#E6B800" />
        <stop offset="50%" stopColor="#C89600" />
        <stop offset="75%" stopColor="#FFDE59" />
        <stop offset="100%" stopColor="#996E00" />
      </linearGradient>
      <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="46" fill="url(#goldGrad)" filter="url(#badgeShadow)" />
    <circle cx="50" cy="50" r="41" fill="#0B2545" />
    <circle cx="50" cy="50" r="38" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3,2" />
    <text x="50" y="48" textAnchor="middle" fill="#FFDE59" fontSize="26" fontWeight="900" fontFamily="sans-serif">42</text>
    <text x="50" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700" letterSpacing="0.5" fontFamily="sans-serif">YEARS</text>
    <text x="50" y="70" textAnchor="middle" fill="#FFDE59" fontSize="6.5" fontWeight="600" letterSpacing="0.3" fontFamily="sans-serif">OF EXCELLENCE</text>
    <polygon points="50,14 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="#FFDE59" />
  </svg>
);

/**
 * NAAC A++ Circular Red Ribbon Seal Badge
 */
export const BadgeNAAC = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="kec-badge-naac" aria-label="NAAC A++ Badge">
    <defs>
      <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#B91C1C" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>
      <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFDE59" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    {/* Ribbon tails */}
    <path d="M 32 75 L 26 95 L 38 88 L 44 95 L 44 75 Z" fill="#991B1B" />
    <path d="M 68 75 L 74 95 L 62 88 L 56 95 L 56 75 Z" fill="#991B1B" />
    {/* Outer scalloped ring */}
    <circle cx="50" cy="46" r="38" fill="url(#goldRim)" />
    <circle cx="50" cy="46" r="35" fill="url(#redGrad)" />
    <circle cx="50" cy="46" r="32" fill="none" stroke="#FFDE59" strokeWidth="1" strokeDasharray="2,2" />
    <text x="50" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="19" fontWeight="900" fontFamily="sans-serif">A++</text>
    <text x="50" y="58" textAnchor="middle" fill="#FFDE59" fontSize="10" fontWeight="800" letterSpacing="1" fontFamily="sans-serif">NAAC</text>
    {/* Stars */}
    <polygon points="50,22 51.5,25 54.5,25 52,27 53,30 50,28 47,30 48,27 45.5,25 48.5,25" fill="#FFDE59" />
  </svg>
);

/**
 * Official KEC Logo with Leaf Sprout
 */
export const KECNavBrandLogo = ({ height = 48 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
    {/* Leaf + Stylized KEC */}
    <div style={{ position: 'relative', width: '56px', height: '42px', flexShrink: 0 }}>
      <svg viewBox="0 0 100 80" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="kecBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A4E4" />
            <stop offset="100%" stopColor="#0077A8" />
          </linearGradient>
          <linearGradient id="kecGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8BC34A" />
            <stop offset="100%" stopColor="#558B2F" />
          </linearGradient>
        </defs>
        {/* Leaf Sprout Icon on K */}
        <path d="M 28 20 C 24 6, 40 4, 40 4 C 40 4, 42 16, 28 20 Z" fill="url(#kecGreen)" />
        <path d="M 20 22 C 10 16, 16 4, 16 4 C 16 4, 24 10, 20 22 Z" fill="#7CB342" />
        {/* KEC Letters */}
        <text x="2" y="60" fill="url(#kecBlue)" fontSize="48" fontWeight="900" fontFamily="'Bruno Ace SC', 'Inter', sans-serif" letterSpacing="-1">
          K
        </text>
        <text x="36" y="60" fill="url(#kecBlue)" fontSize="48" fontWeight="900" fontFamily="'Bruno Ace SC', 'Inter', sans-serif" letterSpacing="-1">
          E
        </text>
        <text x="68" y="60" fill="url(#kecBlue)" fontSize="48" fontWeight="900" fontFamily="'Bruno Ace SC', 'Inter', sans-serif" letterSpacing="-1">
          C
        </text>
      </svg>
    </div>

    {/* Typography */}
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
      <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#7CB342', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
        KONGU <span style={{ color: '#0099D8' }}>ENGINEERING</span> COLLEGE
      </span>
      <span style={{ fontSize: '0.62rem', fontWeight: '700', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
        — Transform Yourself —
      </span>
    </div>
  </div>
);
