import React, { useState, useEffect } from 'react';
import './KECTopRibbon.css';
import { FaGraduationCap, FaAward, FaCalendarAlt, FaClock } from 'react-icons/fa';

const KECTopRibbon = ({ showDate = true }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Live real-time clock update every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="kec-top-strip-wrapper">
      {/* Dual Tone Top Bar matching kongu.ac.in */}
      <div className="kec-dual-tone-bar">
        <div className="kec-bar-green">
          <span className="kec-strip-tag">
            <FaGraduationCap className="kec-strip-icon" /> Autonomous Institution
          </span>
          <span className="kec-strip-divider">|</span>
          <span className="kec-strip-text">Affiliated to Anna University</span>
        </div>
        <div className="kec-bar-cyan">
          <span className="kec-strip-link">Accreditation & IQAC</span>
          <span className="kec-strip-link">ERP Portal</span>
          <span className="kec-strip-badge">
            <FaAward /> NAAC A++ (42 Years)
          </span>
          {showDate && (
            <span className="kec-strip-date" title="Live Real-time Clock">
              <span className="kec-live-dot" aria-hidden="true"></span>
              <FaCalendarAlt />
              <span className="kec-live-date-text">{formattedDate}</span>
              <span className="kec-time-divider">|</span>
              <FaClock className="kec-time-icon" />
              <span className="kec-live-time">{formattedTime}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KECTopRibbon;
