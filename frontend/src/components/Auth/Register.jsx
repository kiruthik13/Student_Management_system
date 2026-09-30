import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUserShield, 
  FaUserGraduate, 
  FaBookOpen, 
  FaUniversity,
  FaUserPlus,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { MdEmail, MdPerson } from 'react-icons/md';
import { API_ENDPOINTS } from '../../config/api';
import KECTopRibbon from '../Common/KECTopRibbon';
import KECMainNavbar from '../Common/KECMainNavbar';
import KECFooter from '../Common/KECFooter';
import './KECLoginHero.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
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

  const validatePassword = (password) => {
    return {
      length: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password)
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'student'
        });

        // Auto switch to login after 1.5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrors({ general: data.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = validatePassword(formData.password);

  return (
    <div className="kec-page-container">
      {/* 1. Official KEC Dual-Tone Ribbon with Real-time Clock */}
      <KECTopRibbon />

      {/* 2. Official KEC Main Navigation Bar with Logo & Badges */}
      <KECMainNavbar />

      {/* 3. Hero Section with 2-Column Split Layout matching Login */}
      <main className="kec-hero-section">
        {/* Ambient Bokeh circles */}
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

          {/* RIGHT COLUMN: The Floating White Signup Card */}
          <div className="kec-hero-right">
            <div className="kec-login-card">
              {/* Card Brand Header */}
              <div className="kec-card-header">
                {/* Official KEC Bubble cluster motif */}
                <div className="kec-card-bubble-emblem">
                  <svg width="60" height="60" viewBox="0 0 100 100" aria-label="KEC Emblem">
                    <defs>
                      <linearGradient id="regBubbleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0099D8" />
                        <stop offset="100%" stopColor="#26A69A" />
                      </linearGradient>
                      <linearGradient id="regBubbleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#26A69A" />
                        <stop offset="100%" stopColor="#7CB342" />
                      </linearGradient>
                      <linearGradient id="regBubbleGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00A4E4" />
                        <stop offset="100%" stopColor="#8BC34A" />
                      </linearGradient>
                    </defs>
                    <circle cx="48" cy="38" r="18" fill="url(#regBubbleGrad1)" />
                    <circle cx="56" cy="54" r="14" fill="url(#regBubbleGrad2)" opacity="0.95" />
                    <circle cx="44" cy="68" r="9" fill="url(#regBubbleGrad1)" opacity="0.9" />
                    <circle cx="68" cy="58" r="7" fill="url(#regBubbleGrad3)" opacity="0.85" />
                    <circle cx="70" cy="34" r="5" fill="#7CB342" opacity="0.9" />
                  </svg>
                </div>

                <div className="kec-card-title-row">
                  <span style={{ fontWeight: 800, color: '#7CB342' }}>KONGU</span>
                  <span style={{ fontWeight: 800, color: '#0099D8' }}>ENGINEERING</span>
                  <span style={{ fontWeight: 800, color: '#7CB342' }}>COLLEGE</span>
                </div>

                <h2 className="kec-portal-heading">Create Account</h2>
                <p className="kec-portal-subtitle">Register to access student attendance portal</p>
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

              {/* Registration Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <div className="kec-form-group">
                  <label className="kec-form-label" htmlFor="register-name">
                    Full Name
                  </label>
                  <div className="kec-input-container">
                    <MdPerson className="kec-field-icon" />
                    <input
                      type="text"
                      id="register-name"
                      name="name"
                      className={`kec-form-input ${errors.name ? 'error' : ''}`}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Kiruthik Bairavan C"
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && (
                    <small style={{ color: '#EF4444', marginTop: '4px', fontSize: '0.78rem' }}>
                      {errors.name}
                    </small>
                  )}
                </div>

                {/* Email Address */}
                <div className="kec-form-group">
                  <label className="kec-form-label" htmlFor="register-email">
                    Email Address
                  </label>
                  <div className="kec-input-container">
                    <MdEmail className="kec-field-icon" />
                    <input
                      type="email"
                      id="register-email"
                      name="email"
                      className={`kec-form-input ${errors.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. user.22msc@kongu.edu"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <small style={{ color: '#EF4444', marginTop: '4px', fontSize: '0.78rem' }}>
                      {errors.email}
                    </small>
                  )}
                </div>

                {/* Password */}
                <div className="kec-form-group">
                  <label className="kec-form-label" htmlFor="register-password">
                    Password
                  </label>
                  <div className="kec-input-container">
                    <FaLock className="kec-field-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="register-password"
                      name="password"
                      className={`kec-form-input ${errors.password ? 'error' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password (min 6 characters)"
                      autoComplete="new-password"
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

                  {/* Password requirements indicators */}
                  {formData.password && (
                    <div className="kec-pwd-req-box">
                      <span className="kec-pwd-req-title">Requirements:</span>
                      <div className={`kec-pwd-req-item ${passwordRequirements.length ? 'met' : ''}`}>
                        <span className="kec-pwd-req-icon">
                          {passwordRequirements.length ? <FaCheck /> : <FaTimes />}
                        </span>
                        <span>At least 6 characters</span>
                      </div>
                      <div className={`kec-pwd-req-item ${passwordRequirements.hasLetter ? 'met' : ''}`}>
                        <span className="kec-pwd-req-icon">
                          {passwordRequirements.hasLetter ? <FaCheck /> : <FaTimes />}
                        </span>
                        <span>Contains at least one letter</span>
                      </div>
                      <div className={`kec-pwd-req-item ${passwordRequirements.hasNumber ? 'met' : ''}`}>
                        <span className="kec-pwd-req-icon">
                          {passwordRequirements.hasNumber ? <FaCheck /> : <FaTimes />}
                        </span>
                        <span>Contains at least one number</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="kec-form-group">
                  <label className="kec-form-label" htmlFor="register-confirm-password">
                    Confirm Password
                  </label>
                  <div className="kec-input-container">
                    <FaLock className="kec-field-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="register-confirm-password"
                      name="confirmPassword"
                      className={`kec-form-input ${errors.confirmPassword ? 'error' : ''}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="kec-pwd-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <small style={{ color: '#EF4444', marginTop: '4px', fontSize: '0.78rem' }}>
                      {errors.confirmPassword}
                    </small>
                  )}
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="kec-signin-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Creating Account...'
                  ) : (
                    <>
                      <FaUserPlus /> Create {formData.role === 'admin' ? 'Admin' : 'Student'} Account
                    </>
                  )}
                </button>

                {/* Bottom Motto Divider */}
                <div className="kec-card-motto-divider">
                  <span>Transform Yourself</span>
                </div>

                {/* Back to Login link */}
                <div className="kec-card-register-footer">
                  Already have an account?
                  <button
                    type="button"
                    className="kec-card-register-link"
                    onClick={() => navigate('/login')}
                  >
                    Sign in here
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

export default Register;