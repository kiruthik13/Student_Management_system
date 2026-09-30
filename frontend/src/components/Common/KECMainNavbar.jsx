import React, { useState, useRef } from 'react';
import { FaHome, FaChevronDown } from 'react-icons/fa';
import { KECNavBrandLogo, Badge42Years, BadgeNAAC } from './KECNavBadges';
import './KECMainNavbar.css';

const NAV_ITEMS = [
  {
    label: 'About Us',
    href: 'https://kongu.ac.in/aboutus',
    children: [
      { label: 'About KEC',            href: 'https://kongu.ac.in/aboutus' },
      { label: 'Vision, Mission & Quality Policy', href: 'https://kongu.ac.in/visionmission' },
      { label: 'Management',           href: 'https://kongu.ac.in/management' },
      { label: 'Head of the Institution', href: 'https://kongu.ac.in/principal' },
      { label: 'Governing Council',    href: 'https://kongu.ac.in/governingcouncil' },
      { label: 'Academic Council',     href: 'https://kongu.ac.in/academiccouncil' },
      { label: 'University Ranks',     href: 'https://kongu.ac.in/universityranks' },
      { label: 'Endowments',           href: 'https://kongu.ac.in/endowments' },
      { label: 'College Rules',        href: 'https://kongu.ac.in/collegerules' },
    ],
  },
  {
    label: 'Departments',
    href: 'https://kongu.ac.in/departments',
    children: [
      { label: 'Civil Engineering',                href: 'https://kongu.ac.in/civil' },
      { label: 'Mechanical Engineering',           href: 'https://kongu.ac.in/mech' },
      { label: 'Automobile Engineering',           href: 'https://kongu.ac.in/auto' },
      { label: 'Mechatronics Engineering',         href: 'https://kongu.ac.in/mech-engg' },
      { label: 'Chemical Engineering',             href: 'https://kongu.ac.in/chem' },
      { label: 'EEE',                              href: 'https://kongu.ac.in/eee' },
      { label: 'Electronics & Instrumentation',   href: 'https://kongu.ac.in/ei' },
      { label: 'ECE',                              href: 'https://kongu.ac.in/ece' },
      { label: 'CSE',                              href: 'https://kongu.ac.in/cse' },
      { label: 'Information Technology',           href: 'https://kongu.ac.in/it' },
      { label: 'Computer Science & Design',        href: 'https://kongu.ac.in/csd' },
      { label: 'AI & Machine Learning',            href: 'https://kongu.ac.in/aiml' },
      { label: 'AI & Data Science',                href: 'https://kongu.ac.in/aids' },
      { label: 'Food Technology',                  href: 'https://kongu.ac.in/ft' },
      { label: 'Management Studies',               href: 'https://kongu.ac.in/mba' },
      { label: 'Computer Applications',            href: 'https://kongu.ac.in/mca' },
      { label: 'Science & Humanities',             href: 'https://kongu.ac.in/sh' },
    ],
  },
  {
    label: 'Placement',
    href: 'https://kongu.ac.in/placement',
    children: [
      { label: 'Placement Statistics', href: 'https://kongu.ac.in/placementstatistics' },
      { label: 'Training & Placement', href: 'https://kongu.ac.in/training' },
      { label: 'Recruiters',           href: 'https://kongu.ac.in/recruiters' },
    ],
  },
  {
    label: 'Admission',
    href: 'https://kongu.ac.in/admission',
    children: [
      { label: 'Programmes Offered',   href: 'https://kongu.ac.in/programmes' },
      { label: 'Admission Process',    href: 'https://kongu.ac.in/admissionprocess' },
      { label: 'Admission Enquiry',    href: 'https://kongu.ac.in/admissionenquiry' },
    ],
  },
  {
    label: 'R&D',
    href: 'https://kongu.ac.in/research',
    children: [
      { label: 'R&D Academic',              href: 'https://kongu.ac.in/rdacademic' },
      { label: 'R&D Activities',            href: 'https://kongu.ac.in/rdactivities' },
      { label: 'Centres of Excellence',     href: 'https://kongu.ac.in/coe' },
    ],
  },
  {
    label: 'Explore',
    href: 'https://kongu.ac.in/explore',
    children: [
      { label: 'Academic',                  href: 'https://kongu.ac.in/academic' },
      { label: 'Campus Life',               href: 'https://kongu.ac.in/campuslife' },
      { label: 'Cells & Committees',        href: 'https://kongu.ac.in/cells' },
      { label: 'Student Centric Activities',href: 'https://kongu.ac.in/studentactivities' },
      { label: 'Alumni',                    href: 'https://kongu.ac.in/alumni' },
      { label: 'Accreditation & IQAC',      href: 'https://kongu.ac.in/accreditation' },
      { label: 'Blogs',                     href: 'https://kongu.ac.in/blogs' },
      { label: 'Careers',                   href: 'https://kongu.ac.in/careers' },
    ],
  },
  {
    label: 'Contact',
    href: 'https://kongu.ac.in/contact',
  },
];

const NavItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  const hasChildren = item.children && item.children.length > 0;
  const isTall = hasChildren && item.children.length > 8;

  return (
    <li
      className="kec-nav-link-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={item.href}
        className="kec-nav-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.preventDefault()}
      >
        {item.label}
        {hasChildren && (
          <FaChevronDown
            className={`kec-nav-chevron ${open ? 'open' : ''}`}
          />
        )}
      </a>

      {hasChildren && open && (
        <div className={`kec-dropdown ${isTall ? 'kec-dropdown--cols' : ''}`}>
          {item.children.map(child => (
            <a
              key={child.label}
              href={child.href}
              className="kec-dropdown-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </li>
  );
};

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
          {/* Home */}
          <li className="kec-nav-link-item active">
            <span className="kec-nav-link">
              <FaHome className="kec-home-icon" /> Home
            </span>
            <span className="kec-active-indicator"></span>
          </li>

          {/* Dynamic nav items from kongu.ac.in */}
          {NAV_ITEMS.map(item => (
            <NavItem key={item.label} item={item} />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default KECMainNavbar;
