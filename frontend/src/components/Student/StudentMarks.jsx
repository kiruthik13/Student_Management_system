import React, { useEffect, useState } from 'react';
import {
    FaChartBar, FaBook, FaTrophy, FaSearch,
    FaFilePdf, FaCheckCircle, FaExclamationTriangle,
    FaArrowUp, FaGraduationCap, FaFilter
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
import StudentLayout from './StudentLayout';
import KECLoader from '../Common/KECLoader';
import { generateStudentPDFReport } from '../../utils/studentReportGenerator';
import './StudentMarks.css';

const StudentMarks = () => {
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterExam, setFilterExam] = useState('ALL');

    useEffect(() => {
        fetchMarks();
    }, []);

    const fetchMarks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.STUDENT_MARKS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setMarks(data.marks || []);
            } else {
                toast.error('Failed to load marks');
            }
        } catch (error) {
            console.error('Error fetching marks:', error);
            toast.error('Network error loading marks');
        } finally {
            setLoading(false);
        }
    };

    // Calculate Summary Statistics
    const totalSubjects = marks.length;
    const avgScore = totalSubjects > 0
        ? (marks.reduce((sum, m) => sum + (parseFloat(m.percentage) || 0), 0) / totalSubjects).toFixed(1)
        : 0;

    const highestSubject = totalSubjects > 0
        ? [...marks].sort((a, b) => (b.marksObtained || 0) - (a.marksObtained || 0))[0]
        : null;

    // Filter marks based on search and exam type
    const filteredMarks = marks.filter(item => {
        const matchesSearch = 
            (item.subjectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.subjectCode || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesExam = filterExam === 'ALL' || item.examType === filterExam;
        return matchesSearch && matchesExam;
    });

    const examTypes = Array.from(new Set(marks.map(m => m.examType).filter(Boolean)));

    const getGradeInfo = (pct) => {
        const p = parseFloat(pct) || 0;
        if (p >= 90) return { grade: 'O', label: 'Outstanding', color: 'green' };
        if (p >= 80) return { grade: 'A+', label: 'Excellent', color: 'blue' };
        if (p >= 70) return { grade: 'A', label: 'Very Good', color: 'blue' };
        if (p >= 60) return { grade: 'B+', label: 'Good', color: 'teal' };
        if (p >= 50) return { grade: 'B', label: 'Average', color: 'amber' };
        return { grade: 'RA', label: 'Re-Appear', color: 'red' };
    };

    return (
        <StudentLayout activeTab="marks">
            <div className="ksm-container">

                {/* ═══ PAGE HEADER ═══ */}
                <div className="ksm-page-header">
                    <div className="ksm-header-left">
                        <div className="ksm-header-icon-box">
                            <FaChartBar />
                        </div>
                        <div>
                            <div className="ksm-breadcrumbs">Student Portal / Academic Evaluation</div>
                            <h1 className="ksm-title">My Marks & Assessments</h1>
                            <p className="ksm-sub">Continuous Assessment Tests (CAT), Internals, and Grade Performance</p>
                        </div>
                    </div>
                    <div className="ksm-header-right">
                        <button
                            type="button"
                            className="ksm-report-btn"
                            onClick={() => generateStudentPDFReport({ marksData: marks })}
                        >
                            <FaFilePdf />
                            <span>Download Marks Sheet</span>
                        </button>
                    </div>
                </div>

                {/* ═══ STATS KPI CARDS ═══ */}
                <div className="ksm-stats-row">
                    <div className="ksm-kpi-card">
                        <div className="ksm-kpi-icon-box blue">
                            <FaBook />
                        </div>
                        <div className="ksm-kpi-info">
                            <span className="ksm-kpi-label">Subjects Evaluated</span>
                            <div className="ksm-kpi-val">{totalSubjects}</div>
                            <span className="ksm-kpi-sub">Curriculum credits</span>
                        </div>
                    </div>

                    <div className="ksm-kpi-card">
                        <div className="ksm-kpi-icon-box green">
                            <FaGraduationCap />
                        </div>
                        <div className="ksm-kpi-info">
                            <span className="ksm-kpi-label">Average Percentage</span>
                            <div className="ksm-kpi-val">{avgScore}%</div>
                            <span className="ksm-kpi-sub text-green">
                                <FaCheckCircle /> Good Standing
                            </span>
                        </div>
                    </div>

                    <div className="ksm-kpi-card">
                        <div className="ksm-kpi-icon-box amber">
                            <FaTrophy />
                        </div>
                        <div className="ksm-kpi-info">
                            <span className="ksm-kpi-label">Highest Score</span>
                            <div className="ksm-kpi-val">
                                {highestSubject ? `${highestSubject.marksObtained}/${highestSubject.maxMarks}` : 'N/A'}
                            </div>
                            <span className="ksm-kpi-sub" title={highestSubject?.subjectName}>
                                {highestSubject ? highestSubject.subjectCode : '—'}
                            </span>
                        </div>
                    </div>

                    <div className="ksm-kpi-card">
                        <div className="ksm-kpi-icon-box purple">
                            <FaArrowUp />
                        </div>
                        <div className="ksm-kpi-info">
                            <span className="ksm-kpi-label">Academic Status</span>
                            <div className="ksm-kpi-val text-status">
                                {avgScore >= 85 ? 'Distinction' : avgScore >= 60 ? 'First Class' : 'Pass'}
                            </div>
                            <span className="ksm-kpi-sub">Kongu Engineering College</span>
                        </div>
                    </div>
                </div>

                {/* ═══ FILTER & SEARCH BAR ═══ */}
                <div className="ksm-controls-bar">
                    <div className="ksm-search-wrapper">
                        <FaSearch className="ksm-search-ico" />
                        <input
                            type="text"
                            placeholder="Search by subject name or code (e.g. DAA, 22IST04)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ksm-search-input"
                        />
                        {searchTerm && (
                            <button className="ksm-clear-search" onClick={() => setSearchTerm('')}>
                                ×
                            </button>
                        )}
                    </div>

                    <div className="ksm-filter-wrapper">
                        <FaFilter className="ksm-filter-ico" />
                        <select
                            value={filterExam}
                            onChange={(e) => setFilterExam(e.target.value)}
                            className="ksm-select"
                        >
                            <option value="ALL">All Exam Types ({marks.length})</option>
                            {examTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ═══ MARKS DATA TABLE ═══ */}
                <div className="ksm-table-card">
                    {loading ? (
                        <div className="ksm-loading-wrap">
                            <KECLoader size="medium" message="Fetching continuous assessments..." />
                        </div>
                    ) : filteredMarks.length === 0 ? (
                        <div className="ksm-empty-wrap">
                            <FaBook className="ksm-empty-icon" />
                            <h3>No Marks Found</h3>
                            <p>
                                {searchTerm || filterExam !== 'ALL'
                                    ? 'No results match your active filters. Try clearing filters.'
                                    : 'No assessment marks have been entered for this semester yet.'}
                            </p>
                            {(searchTerm || filterExam !== 'ALL') && (
                                <button
                                    type="button"
                                    className="ksm-reset-btn"
                                    onClick={() => { setSearchTerm(''); setFilterExam('ALL'); }}
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="ksm-table-responsive">
                            <table className="ksm-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px' }}>#</th>
                                        <th>Subject Details</th>
                                        <th>Assessment Type</th>
                                        <th style={{ width: '190px' }}>Marks Scored</th>
                                        <th style={{ width: '140px' }}>Percentage</th>
                                        <th style={{ width: '130px' }}>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMarks.map((mark, index) => {
                                        const grade = getGradeInfo(mark.percentage);
                                        const pct = parseFloat(mark.percentage) || 0;
                                        return (
                                            <tr key={index}>
                                                <td className="ksm-td-idx">{index + 1}</td>
                                                <td>
                                                    <div className="ksm-subject-cell">
                                                        <span className="ksm-subject-name">{mark.subjectName}</span>
                                                        <span className="ksm-subject-code">{mark.subjectCode}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="ksm-exam-badge">
                                                        {mark.examType}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="ksm-marks-cell">
                                                        <div className="ksm-marks-text">
                                                            <strong>{mark.marksObtained}</strong>
                                                            <span>/ {mark.maxMarks}</span>
                                                        </div>
                                                        <div className="ksm-progress-bg">
                                                            <div 
                                                                className={`ksm-progress-fill ${grade.color}`}
                                                                style={{ width: `${Math.min(100, pct)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`ksm-pct-pill ${grade.color}`}>
                                                        {pct.toFixed(2)}%
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`ksm-grade-tag ${grade.color}`}>
                                                        <strong>{grade.grade}</strong>
                                                        <small>{grade.label}</small>
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </StudentLayout>
    );
};

export default StudentMarks;
