import React from 'react';
import { FaHome } from 'react-icons/fa';
import { KECNavBrandLogo, Badge42Years, BadgeNAAC } from './KECNavBadges';
import './KECMainNavbar.css';

const KECMainNavbar = () => {
  return (
    <nav className="kec-main-navbar">
      <div className="kec-nav-left">
        <KECNavBrandLogo />
        <div className="kec-nav-badges">
          <Badge42Years size={46} />
          <BadgeNAAC size={46} />
        </div>
      </div>

      <div className="kec-nav-right">
        <ul className="kec-nav-links">
          <li className="kec-nav-link-item active">
            <span className="kec-nav-link">
              <FaHome className="kec-home-icon" /> Home
            </span>
            <span className="kec-active-indicator"></span>
          </li>
          <li className="kec-nav-link-item">
            <span className="kec-nav-link">About Us</span>
          </li>
          <li className="kec-nav-link-item">
            <span className="kec-nav-link">Departments</span>
          </li>
          <li className="kec-nav-link-item">
            <span className="kec-nav-link">Placement</span>
          </li>
          <li className="kec-nav-link-item">
            <span className="kec-nav-link">Admission</span>
          </li>
          <li className="kec-nav-link-item">
            <span className="kec-nav-link">R&D</span>
          </li>
          <li className="kec-nav-link-item">
            <span className="kec-nav-link">Contact</span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default KECMainNavbar;
