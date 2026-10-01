import React, { useEffect, useState } from 'react';
import {
    FaCalendarCheck, FaCheckCircle, FaTimesCircle,
    FaClock, FaCalendarAlt, FaFilePdf, FaFilter,
    FaExclamationTriangle, FaPercentage, FaCheck
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
import StudentLayout from './StudentLayout';
import KECLoader from '../Common/KECLoader';
import { generateStudentPDFReport } from '../../utils/studentReportGenerator';
import './StudentAttendance.css';

/* ── SVG Donut Chart ── */
const AttendanceGauge = ({ percentage = 0, size = 76, stroke = 7 }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(100, Math.max(0, parseFloat(percentage) || 0));
    const filled = (pct / 100) * circ;
    const color = pct >= 75 ? '#10B981' : pct >= 65 ? '#F59E0B' : '#EF4444';

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke="#E2E8F0" strokeWidth={stroke}
            />
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={color} strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${filled} ${circ - filled}`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
            <text
                x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
                fontSize={size * 0.22} fontWeight="800" fill="#0B2545"
            >
                {pct}%
            </text>
        </svg>
    );
};

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.STUDENT_ATTENDANCE, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setAttendance(data.attendance || []);
            } else {
                toast.error('Failed to load attendance');
            }
        } catch (error) {
            console.error('Attendance fetch error:', error);
            toast.error('Network error loading attendance');
        } finally {
            setLoading(false);
        }
    };

    // Derived Statistics
    const totalDays = attendance.length;
    let presentDays = 0;
    let absentDays = 0;
    let halfDays = 0;
    let totalPeriodsPresent = 0;
    let totalPeriodsPossible = 0;

    attendance.forEach(rec => {
        const s = (rec.status || '').toLowerCase();
        if (s === 'present') presentDays++;
        else if (s === 'absent') absentDays++;
        else if (s === 'half-day') halfDays++;

        totalPeriodsPresent += (parseFloat(rec.periodsPresent) || 0);
        totalPeriodsPossible += (parseFloat(rec.totalPeriods) || 0);
    });

    const overallPct = totalPeriodsPossible > 0
        ? ((totalPeriodsPresent / totalPeriodsPossible) * 100).toFixed(1)
        : totalDays > 0
        ? (((presentDays + (halfDays * 0.5)) / totalDays) * 100).toFixed(1)
        : 0;

    const isEligible = parseFloat(overallPct) >= 75;

    // Filter list
    const filteredList = attendance.filter(item => {
        const status = (item.status || '').toUpperCase();
        const matchesStatus = filterStatus === 'ALL' || status === filterStatus;

        let dateStr = '';
        if (item.date) {
            const d = new Date(item.date);
            dateStr = d.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).toLowerCase();
        }

        const matchesDate = !searchDate || dateStr.includes(searchDate.toLowerCase());
        return matchesStatus && matchesDate;
    });

    return (
        <StudentLayout activeTab="attendance">
            <div className="ksa-container">

                {/* ═══ PAGE HEADER ═══ */}
                <div className="ksa-page-header">
                    <div className="ksa-header-left">
                        <div className="ksa-header-icon-box">
                            <FaCalendarCheck />
                        </div>
                        <div>
                            <div className="ksa-breadcrumbs">Student Portal / Academic Attendance</div>
                            <h1 className="ksa-title">My Attendance Record</h1>
                            <p className="ksa-sub">Daily presence tracking, hourly periods, and semester exam eligibility</p>
                        </div>
                    </div>
                    <div className="ksa-header-right">
                        <button
                            type="button"
                            className="ksa-report-btn"
                            onClick={() => generateStudentPDFReport({
                                stats: {
                                    totalDays,
                                    presentDays,
                                    absentDays,
                                    attendancePercentage: overallPct
                                }
                            })}
                        >
                            <FaFilePdf />
                            <span>Download Attendance Sheet</span>
                        </button>
                    </div>
                </div>

                {/* ═══ SUMMARY STATS CARDS ═══ */}
                <div className="ksa-stats-grid">
                    {/* Gauge Card */}
                    <div className="ksa-kpi-card gauge-card">
                        <AttendanceGauge percentage={overallPct} size={80} stroke={8} />
                        <div className="ksa-kpi-info">
                            <span className="ksa-kpi-label">Overall Attendance</span>
                            <div className="ksa-kpi-val">{overallPct}%</div>
                            {isEligible ? (
                                <span className="ksa-status-pill eligible">
                                    <FaCheck /> Eligible for Examinations
                                </span>
                            ) : (
                                <span className="ksa-status-pill warning">
                                    <FaExclamationTriangle /> Requires 75% Target
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Total Days */}
                    <div className="ksa-kpi-card">
                        <div className="ksa-kpi-icon-box blue">
                            <FaCalendarAlt />
                        </div>
                        <div className="ksa-kpi-info">
                            <span className="ksa-kpi-label">Total Days Marked</span>
                            <div className="ksa-kpi-val">{totalDays}</div>
                            <span className="ksa-kpi-sub">Academic semester sessions</span>
                        </div>
                    </div>

                    {/* Days Present */}
                    <div className="ksa-kpi-card">
                        <div className="ksa-kpi-icon-box green">
                            <FaCheckCircle />
                        </div>
                        <div className="ksa-kpi-info">
                            <span className="ksa-kpi-label">Days Present</span>
                            <div className="ksa-kpi-val text-green">{presentDays}</div>
                            <span className="ksa-kpi-sub">Full attendance days</span>
                        </div>
                    </div>

                    {/* Days Absent */}
                    <div className="ksa-kpi-card">
                        <div className="ksa-kpi-icon-box red">
                            <FaTimesCircle />
                        </div>
                        <div className="ksa-kpi-info">
                            <span className="ksa-kpi-label">Days Absent / Leave</span>
                            <div className="ksa-kpi-val text-red">{absentDays}</div>
                            <span className="ksa-kpi-sub">
                                {halfDays > 0 ? `${halfDays} half-days recorded` : 'Unexcused / excused'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ═══ FILTER CONTROLS ═══ */}
                <div className="ksa-filter-bar">
                    <div className="ksa-filter-tabs">
                        {[
                            { key: 'ALL', label: `All Sessions (${attendance.length})` },
                            { key: 'PRESENT', label: `Present (${presentDays})` },
                            { key: 'ABSENT', label: `Absent (${absentDays})` },
                            { key: 'HALF-DAY', label: `Half-Day (${halfDays})` }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                type="button"
                                className={`ksa-tab-btn ${filterStatus === tab.key ? 'active' : ''}`}
                                onClick={() => setFilterStatus(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="ksa-search-date-wrap">
                        <input
                            type="text"
                            placeholder="Filter by date (e.g. Oct 2026)..."
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            className="ksa-date-input"
                        />
                    </div>
                </div>

                {/* ═══ ATTENDANCE LOG TABLE ═══ */}
                <div className="ksa-table-card">
                    {loading ? (
                        <div className="ksa-loading-wrap">
                            <KECLoader size="medium" message="Fetching daily attendance logs..." />
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="ksa-empty-wrap">
                            <FaCalendarCheck className="ksa-empty-icon" />
                            <h3>No Attendance Records Found</h3>
                            <p>
                                {filterStatus !== 'ALL' || searchDate
                                    ? 'No records match your active search criteria.'
                                    : 'No attendance records have been registered for this account yet.'}
                            </p>
                            {(filterStatus !== 'ALL' || searchDate) && (
                                <button
                                    type="button"
                                    className="ksa-reset-btn"
                                    onClick={() => { setFilterStatus('ALL'); setSearchDate(''); }}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="ksa-table-responsive">
                            <table className="ksa-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px' }}>#</th>
                                        <th>Date & Day</th>
                                        <th>Attendance Status</th>
                                        <th>Periods Attended</th>
                                        <th>Daily Presence Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredList.map((record, index) => {
                                        const d = record.date ? new Date(record.date) : new Date();
                                        const dateFormatted = d.toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        });
                                        const dayName = d.toLocaleDateString('en-IN', { weekday: 'long' });

                                        const st = (record.status || 'Not Marked').toUpperCase();
                                        const isPres = st === 'PRESENT';
                                        const isAbs = st === 'ABSENT';
                                        const isHalf = st === 'HALF-DAY';

                                        const pPres = parseFloat(record.periodsPresent) || 0;
                                        const pTot = parseFloat(record.totalPeriods) || 7;
                                        const dayPct = pTot > 0 ? ((pPres / pTot) * 100).toFixed(0) : 0;

                                        return (
                                            <tr key={index}>
                                                <td className="ksa-td-idx">{index + 1}</td>
                                                <td>
                                                    <div className="ksa-date-cell">
                                                        <span className="ksa-date-text">{dateFormatted}</span>
                                                        <span className="ksa-day-tag">{dayName}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`ksa-badge-status ${st.toLowerCase()}`}>
                                                        {isPres && <FaCheckCircle />}
                                                        {isAbs && <FaTimesCircle />}
                                                        {isHalf && <FaClock />}
                                                        <span>{st}</span>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="ksa-periods-cell">
                                                        <div className="ksa-periods-val">
                                                            <strong>{pPres}</strong> / {pTot} Periods
                                                        </div>
                                                        <div className="ksa-period-dots">
                                                            {Array.from({ length: Math.min(7, pTot) }).map((_, pIdx) => (
                                                                <span
                                                                    key={pIdx}
                                                                    className={`ksa-p-dot ${pIdx < pPres ? 'filled' : 'empty'}`}
                                                                    title={`Period ${pIdx + 1}: ${pIdx < pPres ? 'Attended' : 'Missed'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="ksa-daypct-cell">
                                                        <span className={`ksa-daypct-badge ${isPres ? 'green' : isAbs ? 'red' : 'amber'}`}>
                                                            {dayPct}%
                                                        </span>
                                                    </div>
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

export default StudentAttendance;
