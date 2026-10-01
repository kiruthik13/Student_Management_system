import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaUser, FaIdCard, FaBuilding, FaCalendarAlt,
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaUsers,
    FaGraduationCap, FaEdit, FaCheckCircle, FaTimes,
    FaSave, FaLayerGroup, FaShieldAlt, FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
import StudentLayout from './StudentLayout';
import KECLoader from '../Common/KECLoader';
import './StudentProfile.css';

const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        academicYear: '',
        phoneNumber: '',
        parentName: '',
        parentPhone: '',
        address: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.STUDENT_PROFILE, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data.student;
            setStudent(data);
            setEditForm({
                academicYear: data.academicYear || '',
                phoneNumber: data.phoneNumber || '',
                parentName: data.parentName || '',
                parentPhone: data.parentPhone || '',
                address: data.address || ''
            });
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch profile details');
            setLoading(false);
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenEditModal = () => {
        if (student) {
            setEditForm({
                academicYear: student.academicYear || '',
                phoneNumber: student.phoneNumber || '',
                parentName: student.parentName || '',
                parentPhone: student.parentPhone || '',
                address: student.address || ''
            });
        }
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(API_ENDPOINTS.STUDENT_PROFILE, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.student) {
                setStudent(res.data.student);
                // Also sync local storage user if needed
                try {
                    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                    localStorage.setItem('user', JSON.stringify({
                        ...localUser,
                        academicYear: res.data.student.academicYear,
                        phoneNumber: res.data.student.phoneNumber
                    }));
                } catch (_) {}
            }

            toast.success('✅ Profile updated successfully!');
            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <StudentLayout activeTab="profile">
                <KECLoader fullScreen={false} message="Loading Student Profile..." />
            </StudentLayout>
        );
    }

    if (error || !student) {
        return (
            <StudentLayout activeTab="profile">
                <div className="ksp-error-container">
                    <p className="ksp-error-msg">{error || 'No profile data found'}</p>
                    <button className="ksp-btn-retry" onClick={fetchProfile}>Retry</button>
                </div>
            </StudentLayout>
        );
    }

    const initial = (student.fullName || 'S').charAt(0).toUpperCase();
    const semesterDisplay = student.semester || 'Semester 4';
    const academicYearDisplay = student.academicYear ? student.academicYear : 'Click to Set Year';

    return (
        <StudentLayout activeTab="profile">
            <div className="ksp-container">

                {/* ══════════════════════════════════════════
                    KEC CAMPUS GATE HERO PROFILE CARD
                    Matches Dashboard Hero Design
                ══════════════════════════════════════════ */}
                <div className="ksp-hero-card">
                    {/* Actual KEC Campus Gate Photo */}
                    <img
                        src="/kec-gate.webp"
                        alt="Kongu Engineering College Campus Gate"
                        className="ksp-hero-img"
                    />

                    {/* Gradient & Dot Pattern Overlays */}
                    <div className="ksp-hero-overlay" />
                    <div className="ksp-hero-dots" />

                    {/* Profile Hero Content */}
                    <div className="ksp-hero-content">
                        <div className="ksp-hero-left">
                            <div className="ksp-avatar-wrapper">
                                <div className="ksp-avatar-circle">
                                    {initial}
                                </div>
                                <span className="ksp-avatar-badge" title="Active Verified Student">
                                    <FaCheckCircle />
                                </span>
                            </div>

                            <div className="ksp-hero-info">
                                <div className="ksp-status-tag">
                                    <span className="ksp-status-pulse"></span>
                                    Autonomous | Affiliated to Anna University
                                </div>
                                <h1 className="ksp-student-name">{student.fullName}</h1>
                                
                                <div className="ksp-hero-pills">
                                    <div className="ksp-pill">
                                        <FaIdCard className="ksp-pill-ico" />
                                        <span><strong>Roll:</strong> {student.rollNumber}</span>
                                    </div>
                                    <div className="ksp-pill">
                                        <FaBuilding className="ksp-pill-ico" />
                                        <span><strong>Dept:</strong> {student.className} - {student.section}</span>
                                    </div>
                                    <div className="ksp-pill ksp-pill-semester">
                                        <FaLayerGroup className="ksp-pill-ico" />
                                        <span><strong>{semesterDisplay}</strong></span>
                                    </div>
                                    <div 
                                        className={`ksp-pill ksp-pill-year ${!student.academicYear ? 'unset' : ''}`}
                                        onClick={handleOpenEditModal}
                                        title="Click to edit Academic Year"
                                    >
                                        <FaCalendarAlt className="ksp-pill-ico" />
                                        <span><strong>Batch:</strong> {academicYearDisplay}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Right Actions & College Motto */}
                        <div className="ksp-hero-right">
                            <button 
                                type="button" 
                                className="ksp-edit-profile-btn"
                                onClick={handleOpenEditModal}
                            >
                                <FaEdit className="ksp-edit-ico" />
                                <span>Edit Profile</span>
                            </button>
                            <div className="ksp-hero-quote">
                                <span>"Transform Yourself for a Better Tomorrow"</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════
                    ACADEMIC & PERSONAL DETAILS GRID
                ══════════════════════════════════════════ */}
                <div className="ksp-details-grid">

                    {/* Card 1: Academic Information */}
                    <div className="ksp-card">
                        <div className="ksp-card-header">
                            <div className="ksp-card-icon-box blue">
                                <FaGraduationCap />
                            </div>
                            <div>
                                <h3>Academic Information</h3>
                                <p className="ksp-card-sub">Curricular classification & department records</p>
                            </div>
                        </div>

                        <div className="ksp-info-rows">
                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaIdCard className="ksp-row-ico" />
                                    <span>Roll Number</span>
                                </div>
                                <div className="ksp-row-val highlight">{student.rollNumber}</div>
                            </div>

                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaBuilding className="ksp-row-ico" />
                                    <span>Class & Department</span>
                                </div>
                                <div className="ksp-row-val">{student.className}</div>
                            </div>

                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaUsers className="ksp-row-ico" />
                                    <span>Section</span>
                                </div>
                                <div className="ksp-row-val">Section {student.section}</div>
                            </div>

                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaLayerGroup className="ksp-row-ico" />
                                    <span>Current Semester</span>
                                </div>
                                <div className="ksp-row-val">
                                    <span className="ksp-badge-sem">{semesterDisplay}</span>
                                    <small className="ksp-hint-sem">(Teacher / Dept Assigned)</small>
                                </div>
                            </div>

                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaCalendarAlt className="ksp-row-ico" />
                                    <span>Academic Year / Batch</span>
                                </div>
                                <div className="ksp-row-val">
                                    {student.academicYear ? (
                                        <span className="ksp-badge-year">{student.academicYear}</span>
                                    ) : (
                                        <button 
                                            type="button" 
                                            className="ksp-badge-fill-btn"
                                            onClick={handleOpenEditModal}
                                        >
                                            + Fill Academic Year
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaShieldAlt className="ksp-row-ico" />
                                    <span>Student Status</span>
                                </div>
                                <div className="ksp-row-val status-active">
                                    <FaCheckCircle /> Active Enrolled
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Personal & Contact Information */}
                    <div className="ksp-card">
                        <div className="ksp-card-header">
                            <div className="ksp-card-icon-box green">
                                <FaUser />
                            </div>
                            <div className="ksp-card-title-wrap">
                                <div>
                                    <h3>Personal & Contact Details</h3>
                                    <p className="ksp-card-sub">Student and guardian contact coordinates</p>
                                </div>
                                <button 
                                    type="button" 
                                    className="ksp-card-edit-btn"
                                    onClick={handleOpenEditModal}
                                    title="Edit details"
                                >
                                    <FaEdit />
                                </button>
                            </div>
                        </div>

                        <div className="ksp-info-rows">
                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaEnvelope className="ksp-row-ico" />
                                    <span>Email Address</span>
                                </div>
                                <div className="ksp-row-val email-val">{student.email}</div>
                            </div>

                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaPhone className="ksp-row-ico" />
                                    <span>Student Phone Number</span>
                                </div>
                                <div className="ksp-row-val">
                                    {student.phoneNumber || <span className="ksp-empty">Not provided</span>}
                                </div>
                            </div>

                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaUsers className="ksp-row-ico" />
                                    <span>Parent / Guardian Name</span>
                                </div>
                                <div className="ksp-row-val">
                                    {student.parentName || <span className="ksp-empty">Not provided</span>}
                                </div>
                            </div>

                            <div className="ksp-info-row">
                                <div className="ksp-row-label">
                                    <FaPhone className="ksp-row-ico" />
                                    <span>Parent Phone Number</span>
                                </div>
                                <div className="ksp-row-val">
                                    {student.parentPhone || <span className="ksp-empty">Not provided</span>}
                                </div>
                            </div>

                            <div className="ksp-info-row full-address">
                                <div className="ksp-row-label">
                                    <FaMapMarkerAlt className="ksp-row-ico" />
                                    <span>Residential Address</span>
                                </div>
                                <div className="ksp-row-val address-val">
                                    {student.address || <span className="ksp-empty">Not provided</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════
                    EDIT PROFILE MODAL
                ══════════════════════════════════════════ */}
                {isEditModalOpen && (
                    <div className="ksp-modal-backdrop" onClick={() => !saving && setIsEditModalOpen(false)}>
                        <div className="ksp-modal" onClick={e => e.stopPropagation()}>
                            <div className="ksp-modal-header">
                                <div className="ksp-modal-head-left">
                                    <div className="ksp-modal-icon">
                                        <FaEdit />
                                    </div>
                                    <div>
                                        <h2>Update Profile Details</h2>
                                        <p>Keep your academic year & contact info up to date</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="ksp-modal-close"
                                    onClick={() => !saving && setIsEditModalOpen(false)}
                                    disabled={saving}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProfile} className="ksp-modal-form">
                                <div className="ksp-form-notice">
                                    <FaInfoCircle />
                                    <span>
                                        Academic details such as <strong>Class</strong>, <strong>Section</strong>, and <strong>Semester ({semesterDisplay})</strong> are managed by teachers. You can fill and update your <strong>Academic Year</strong> and contact details.
                                    </span>
                                </div>

                                <div className="ksp-form-group">
                                    <label htmlFor="academicYear">
                                        Academic Year / Batch <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="academicYear"
                                        name="academicYear"
                                        value={editForm.academicYear}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 2022 - 2026"
                                        required
                                    />
                                    <span className="ksp-input-hint">Format: YYYY - YYYY (e.g. 2022 - 2026)</span>
                                </div>

                                <div className="ksp-form-row">
                                    <div className="ksp-form-group half">
                                        <label htmlFor="phoneNumber">Student Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={editForm.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="10-digit mobile number"
                                            maxLength={10}
                                        />
                                    </div>

                                    <div className="ksp-form-group half">
                                        <label htmlFor="parentName">Parent / Guardian Name</label>
                                        <input
                                            type="text"
                                            id="parentName"
                                            name="parentName"
                                            value={editForm.parentName}
                                            onChange={handleInputChange}
                                            placeholder="Parent's full name"
                                        />
                                    </div>
                                </div>

                                <div className="ksp-form-row">
                                    <div className="ksp-form-group half">
                                        <label htmlFor="parentPhone">Parent Phone Number</label>
                                        <input
                                            type="tel"
                                            id="parentPhone"
                                            name="parentPhone"
                                            value={editForm.parentPhone}
                                            onChange={handleInputChange}
                                            placeholder="10-digit parent number"
                                            maxLength={10}
                                        />
                                    </div>

                                    <div className="ksp-form-group half">
                                        <label>Semester (Current)</label>
                                        <input
                                            type="text"
                                            value={semesterDisplay}
                                            disabled
                                            style={{ backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                </div>

                                <div className="ksp-form-group">
                                    <label htmlFor="address">Residential Address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={editForm.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Permanent address (City, State, Pincode)"
                                    />
                                </div>

                                <div className="ksp-modal-actions">
                                    <button
                                        type="button"
                                        className="ksp-btn-cancel"
                                        onClick={() => setIsEditModalOpen(false)}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="ksp-btn-save"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <><span>Saving changes...</span></>
                                        ) : (
                                            <><FaSave /> <span>Save Profile</span></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </StudentLayout>
    );
};

export default StudentProfile;
