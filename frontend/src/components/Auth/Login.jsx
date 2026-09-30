import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaGraduationCap,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaUserGraduate,
  FaBookOpen,
  FaUniversity,
  FaSignInAlt
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { API_ENDPOINTS } from '../../config/api';
import KECTopRibbon from '../Common/KECTopRibbon';
import KECMainNavbar from '../Common/KECMainNavbar';
import KECFooter from '../Common/KECFooter';
import './KECLoginHero.css';

const Login = ({ fixedRole }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: fixedRole || 'student'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const endpoint = API_ENDPOINTS.LOGIN;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Login successful! Redirecting...');
        localStorage.setItem('token', data.token);

        const user = data.user;

        if (formData.role !== user.role) {
          console.warn(`Warning: Login role ${formData.role} does not match user role ${user.role}`);

          if (fixedRole) {
            const roleLabel = fixedRole === 'admin' ? 'Admin' : 'Student';
            setErrors({ general: `Invalid credentials for ${roleLabel} login. Please use the correct login page.` });
            setIsLoading(false);
            return;
          }
        }

        if (user.role === 'admin') {
          localStorage.setItem('admin', JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('adminId', user.id || user._id);

          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1200);
        } else {
          localStorage.setItem('user', JSON.stringify(user));

          setTimeout(() => {
            navigate('/student/dashboard', { replace: true });
          }, 1200);
        }
      } else {
        setErrors({ general: data.message || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection.' });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kec-page-container">
      {/* 1. Official KEC Dual-Tone Ribbon */}
      <KECTopRibbon />

      {/* 2. Official KEC Main Navigation Bar with Logo & Badges */}
      <KECMainNavbar />

      {/* 3. Hero Section with 2-Column Layout matching the mockup */}
      <main className="kec-hero-section">
        {/* Ambient Bokeh circles behind right card */}
        <div className="kec-bokeh-circle bokeh-cyan-1"></div>
        <div className="kec-bokeh-circle bokeh-green-1"></div>
        <div className="kec-bokeh-circle bokeh-cyan-2"></div>

        <div className="kec-hero-grid">
          {/* LEFT COLUMN: Welcome, Titles, Accreditations & Gate Photo */}
          <div className="kec-hero-left">
            <div className="kec-dot-matrix"></div>
            <p className="hero-welcome-tag">Welcome to</p>
            <h1 className="hero-main-title">
              <span className="title-kongu">KONGU</span> <span className="title-eng">ENGINEERING COLLEGE</span>
            </h1>
            <p className="hero-tagline">Transform Yourself</p>

            {/* 3 Accreditation Cards Row */}
            <div className="kec-accreditation-row">
              <div className="kec-acc-card">
                <div className="kec-acc-icon-box">
                  <FaGraduationCap />
                </div>
                <div className="kec-acc-texts">
                  <span className="kec-acc-title">NAAC A++</span>
                  <span className="kec-acc-subtitle">Accreditation</span>
                </div>
              </div>

              <div className="kec-acc-card">
                <div className="kec-acc-icon-box">
                  <FaBookOpen />
                </div>
                <div className="kec-acc-texts">
                  <span className="kec-acc-title">NBA</span>
                  <span className="kec-acc-subtitle">Accredited</span>
                </div>
              </div>

              <div className="kec-acc-card">
                <div className="kec-acc-icon-box">
                  <FaUniversity />
                </div>
                <div className="kec-acc-texts">
                  <span className="kec-acc-title">NIRF</span>
                  <span className="kec-acc-subtitle">Ranked</span>
                </div>
              </div>
            </div>

            {/* Official KEC Gate Photo */}
            <div className="kec-gate-frame">
              <img
                src="/kec-gate.webp"
                alt="Kongu Engineering College Arch Gate"
                className="kec-gate-image"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: The Floating White Login Card */}
          <div className="kec-hero-right">
            <div className="kec-login-card">
              {/* Card Brand Header */}
              <div className="kec-card-header">
                {/* Official KEC Bubble cluster motif */}
                <div className="kec-card-bubble-emblem">
                  <svg width="60" height="60" viewBox="0 0 100 100" aria-label="KEC Emblem">
                    <defs>
                      <linearGradient id="bubbleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0099D8" />
                        <stop offset="100%" stopColor="#26A69A" />
                      </linearGradient>
                      <linearGradient id="bubbleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#26A69A" />
                        <stop offset="100%" stopColor="#7CB342" />
                      </linearGradient>
                      <linearGradient id="bubbleGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00A4E4" />
                        <stop offset="100%" stopColor="#8BC34A" />
                      </linearGradient>
                    </defs>
                    <circle cx="48" cy="38" r="18" fill="url(#bubbleGrad1)" />
                    <circle cx="56" cy="54" r="14" fill="url(#bubbleGrad2)" opacity="0.95" />
                    <circle cx="44" cy="68" r="9" fill="url(#bubbleGrad1)" opacity="0.9" />
                    <circle cx="68" cy="58" r="7" fill="url(#bubbleGrad3)" opacity="0.85" />
                    <circle cx="70" cy="34" r="5" fill="#7CB342" opacity="0.9" />
                  </svg>
                </div>

                <div className="kec-card-title-row">
                  <span style={{ fontWeight: 800, color: '#7CB342' }}>KONGU</span>
                  <span style={{ fontWeight: 800, color: '#0099D8' }}>ENGINEERING</span>
                  <span style={{ fontWeight: 800, color: '#7CB342' }}>COLLEGE</span>
                </div>

                <h2 className="kec-portal-heading">Attendance Portal</h2>
                <p className="kec-portal-subtitle">Sign in to manage and track attendance</p>
              </div>

              {/* Status / Error Alerts */}
              {errors.general && (
                <div className="kec-alert-box kec-alert-error">
                  <span>⚠️</span>
                  <span>{errors.general}</span>
                </div>
              )}

              {successMessage && (
                <div className="kec-alert-box kec-alert-success">
                  <span>✅</span>
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Role Toggle Pill Bar */}
              {!fixedRole && (
                <div className="kec-role-pill-bar">
                  <button
                    type="button"
                    className={`kec-role-pill-btn ${formData.role === 'student' ? 'active student' : ''}`}
                    onClick={() => handleRoleChange('student')}
                  >
                    <FaUserGraduate /> Student
                  </button>
                  <button
                    type="button"
                    className={`kec-role-pill-btn ${formData.role === 'admin' ? 'active admin' : ''}`}
                    onClick={() => handleRoleChange('admin')}
                  >
                    <FaUserShield /> Admin
                  </button>
                </div>
              )}

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="kec-form-group">
                  <label className="kec-form-label" htmlFor="login-email">
                    Email Address
                  </label>
                  <div className="kec-input-container">
                    <MdEmail className="kec-field-icon" />
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      className={`kec-form-input ${errors.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Your Email Address"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <small style={{ color: '#EF4444', marginTop: '4px', fontSize: '0.78rem' }}>
                      {errors.email}
                    </small>
                  )}
                </div>

                <div className="kec-form-group">
                  <label className="kec-form-label" htmlFor="login-password">
                    Password
                  </label>
                  <div className="kec-input-container">
                    <FaLock className="kec-field-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      name="password"
                      className={`kec-form-input ${errors.password ? 'error' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="kec-pwd-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <small style={{ color: '#EF4444', marginTop: '4px', fontSize: '0.78rem' }}>
                      {errors.password}
                    </small>
                  )}
                  <div className="kec-forgot-link-wrapper">
                    <a href="#forgot" className="kec-forgot-link" onClick={(e) => { e.preventDefault(); toast.info('Please contact KEC Admin for password reset.'); }}>
                      Forgot Password?
                    </a>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="kec-signin-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Signing In...'
                  ) : (
                    <>
                      <FaSignInAlt /> Sign In as {formData.role === 'admin' ? 'Admin' : 'Student'}
                    </>
                  )}
                </button>

                {/* Bottom Motto Divider */}
                <div className="kec-card-motto-divider">
                  <span>Transform Yourself</span>
                </div>

                {/* Registration link */}
                <div className="kec-card-register-footer">
                  Don't have an account?
                  <button
                    type="button"
                    className="kec-card-register-link"
                    onClick={() => navigate('/register')}
                  >
                    Create one here
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Official KEC Footer */}
      <KECFooter />
    </div>
  );
};

export default Login;