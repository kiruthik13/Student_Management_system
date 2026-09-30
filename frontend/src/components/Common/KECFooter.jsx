import React from 'react';
import './KECFooter.css';

const KECFooter = () => {
  return (
    <footer className="kec-official-footer">
      <div className="kec-footer-left">
        © 2026 Kongu Engineering College. All rights reserved.
      </div>
      <div className="kec-footer-right">
        <a href="#about" className="kec-footer-link">About</a>
        <span className="kec-footer-sep">|</span>
        <a href="#privacy" className="kec-footer-link">Privacy</a>
        <span className="kec-footer-sep">|</span>
        <a href="#help" className="kec-footer-link">Help</a>
        <span className="kec-footer-sep">|</span>
        <a href="#contact" className="kec-footer-link">Contact</a>
      </div>
    </footer>
  );
};

export default KECFooter;
