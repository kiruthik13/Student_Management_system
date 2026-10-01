import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaCalendarCheck, FaBook, FaChartBar, FaFilePdf,
    FaUser, FaSignOutAlt, FaBolt, FaTachometerAlt,
    FaBell, FaChevronDown, FaArrowRight,
    FaGraduationCap, FaDownload, FaLayerGroup,
    FaCheckCircle, FaExclamationCircle, FaTimes,
    FaBars
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
import KECLogo from '../Common/KECLogo';
import KECFooter from '../Common/KECFooter';
import { generateStudentPDFReport } from '../../utils/studentReportGenerator';
import './StudentDashboard.css';

/* ── Sidebar Navigation Item ── */
const SideItem = ({ icon, label, active, onClick }) => (
    <button
        type="button"
        className={`ksd-nav-item ${active ? 'ksd-active' : ''}`}
        onClick={onClick}
    >
        <span className="ksd-nav-ico">{icon}</span>
        <span className="ksd-nav-lbl">{label}</span>
        {active && <span className="ksd-nav-pip"/>}
    </button>
);

const StudentLayout = ({ children, activeTab = 'dashboard' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const notifRef = useRef(null);

    const [studentData, setStudentData] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch (_) {
            return {};
        }
    });
    const [stats, setStats] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        fetchStudentInfo();
    }, []);

    const fetchStudentInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(API_ENDPOINTS.STUDENT_DASHBOARD, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                if (data.studentInfo) {
                    setStudentData(prev => ({
                        ...prev,
                        ...data.studentInfo,
                        fullName: data.studentName || prev.fullName
                    }));
                }
            }
        } catch (err) {
            console.error('Student layout fetch error:', err);
        }
    };

    // Calculate dynamic notifications based on student academic performance
    useEffect(() => {
        const attNum = parseFloat(stats?.attendancePercentage || 0);
        const dynamicList = [];

        if (stats && attNum > 0 && attNum < 75) {
            dynamicList.push({
                id: 'kec-notif-att-critical',
                type: 'danger',
                title: 'Low Attendance Warning',
                message: `Your current attendance is ${attNum.toFixed(1)}%, which is below the mandatory 75% requirement.`,
                time: 'Requires Attention',
                unread: true,
                path: '/student/attendance',
                actionLabel: 'Check Attendance'
            });
        } else if (stats && attNum >= 75) {
            dynamicList.push({
                id: 'kec-notif-att-good',
                type: 'success',
                title: 'Attendance on Track',
                message: `Great job! Your attendance is at ${attNum.toFixed(1)}% (above the 75% required target).`,
                time: 'Verified',
                unread: false,
                path: '/student/attendance',
                actionLabel: 'View Details'
            });
        } else {
            dynamicList.push({
                id: 'kec-notif-att-notice',
                type: 'warning',
                title: 'Attendance Monitored',
                message: 'Daily attendance records are active. Regularly monitor your percentage for semester eligibility.',
                time: 'Notice',
                unread: true,
                path: '/student/attendance',
                actionLabel: 'View Attendance'
            });
        }

        dynamicList.push({
            id: 'kec-notif-rep',
            type: 'info',
            title: 'Official Academic Report',
            message: 'Your official Kongu Engineering College semester summary & progress report is ready.',
            time: 'Available now',
            unread: true,
            isPdf: true,
            actionLabel: 'Download PDF'
        });

        dynamicList.push({
            id: 'kec-notif-sem',
            type: 'success',
            title: 'Marks & Continuous Assessments',
            message: 'Continuous Assessment Tests (CAT) and internal marks are up to date.',
            time: 'Today',
            unread: true,
            path: '/student/marks',
            actionLabel: 'View Marks'
        });

        setNotifications(dynamicList);
    }, [stats]);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markNotificationAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const removeNotification = (id, e) => {
        if (e) e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast.info('Notification dismissed');
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        toast.success('All notifications marked as read');
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setShowNotifications(false);
        toast.info('All notifications cleared');
    };

    const handleNotifClick = (item) => {
        markNotificationAsRead(item.id);
        setShowNotifications(false);
        if (item.isPdf) {
            generateStudentPDFReport({ studentInfo: studentData, stats });
        } else if (item.path) {
            navigate(item.path);
        }
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.info('Logged out successfully');
        navigate('/login');
    };

    const firstName = (studentData.fullName || studentData.name || 'Student').split(' ')[0];
    const rollNo = studentData.rollNumber || studentData.rollNo || '—';
    const dept = studentData.department || studentData.className || '—';

    const navLinks = [
        { icon: <FaTachometerAlt/>, label: 'Dashboard', path: '/student/dashboard', key: 'dashboard' },
        { icon: <FaCalendarCheck/>, label: 'Attendance', path: '/student/attendance', key: 'attendance' },
        { icon: <FaChartBar/>, label: 'Marks', path: '/student/marks', key: 'marks' },
        { icon: <FaLayerGroup/>, label: 'Subjects', path: '/student/subjects', key: 'subjects' },
        { icon: <FaUser/>, label: 'Profile', path: '/student/profile', key: 'profile' },
        {
            icon: <FaDownload/>,
            label: 'Download Report',
            key: 'report',
            action: () => generateStudentPDFReport({ studentInfo: studentData, stats })
        },
    ];

    return (
        <div className="ksd-root">
            {/* ═══ TOP NAVBAR ═══ */}
            <header className="ksd-topbar">
                <div className="ksd-topbar-left">
                    <button 
                        type="button" 
                        className="ksd-mobile-menu-btn"
                        onClick={() => setMobileNavOpen(prev => !prev)}
                        aria-label="Toggle menu"
                        style={{
                            display: 'none',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.25rem',
                            color: '#0B2545',
                            cursor: 'pointer',
                            marginRight: '0.5rem'
                        }}
                    >
                        <FaBars />
                    </button>
                    <KECLogo size="small" align="left" showCredentials={false}/>
                    <div className="ksd-topbar-sep"/>
                    <div className="ksd-portal-badge">
                        <FaGraduationCap className="ksd-portal-ico"/>
                        <span>Student Portal</span>
                    </div>
                </div>

                <div className="ksd-topbar-right">
                    {/* Quick Download Report Button */}
                    <button
                        type="button"
                        className="ksd-top-pdf-btn"
                        onClick={() => generateStudentPDFReport({ studentInfo: studentData, stats })}
                        title="Download Academic Progress Report"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.42rem 0.85rem',
                            background: '#F0F9FF',
                            border: '1.5px solid #BAE6FD',
                            borderRadius: '10px',
                            color: '#0284C7',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaFilePdf style={{ color: '#0284C7' }} />
                        <span className="ksd-top-pdf-txt">Download PDF</span>
                    </button>

                    {/* Notification Dropdown Container */}
                    <div className="ksd-notif-wrapper" ref={notifRef}>
                        <button
                            type="button"
                            className={`ksd-bell-btn ${showNotifications ? 'active' : ''} ${unreadCount > 0 ? 'has-unread' : ''}`}
                            aria-label="Notifications"
                            onClick={() => setShowNotifications(prev => !prev)}
                            title="Notifications"
                        >
                            <span className="ksd-bell-icon-box">
                                <FaBell className="ksd-bell-icon"/>
                            </span>
                            {unreadCount > 0 && (
                                <span className="ksd-bell-badge">
                                    <span className="ksd-bell-ping"></span>
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Premium Notification Dropdown */}
                        {showNotifications && (
                            <div className="ksd-notif-dropdown">
                                <div className="ksd-notif-header">
                                    <div className="ksd-notif-head-title">
                                        <div className="ksd-notif-head-icon">
                                            <FaBell />
                                        </div>
                                        <div>
                                            <h4>Notifications</h4>
                                            <p className="ksd-notif-subtext">KEC Student Portal</p>
                                        </div>
                                        {unreadCount > 0 ? (
                                            <span className="ksd-notif-count-tag">{unreadCount} New</span>
                                        ) : (
                                            <span className="ksd-notif-count-tag read">All caught up</span>
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <button 
                                            type="button" 
                                            className="ksd-notif-markall-btn" 
                                            onClick={markAllNotificationsAsRead}
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="ksd-notif-body">
                                    {notifications.length === 0 ? (
                                        <div className="ksd-notif-empty">
                                            <div className="ksd-notif-empty-icon-wrap">
                                                <FaBell className="ksd-notif-empty-icon"/>
                                            </div>
                                            <p>No notifications right now</p>
                                            <span>You are all caught up with your academic updates!</span>
                                        </div>
                                    ) : (
                                        <div className="ksd-notif-list">
                                            {notifications.map(item => (
                                                <div
                                                    key={item.id}
                                                    className={`ksd-notif-item ${item.unread ? 'unread' : 'read'} type-${item.type}`}
                                                    onClick={() => handleNotifClick(item)}
                                                >
                                                    <div className={`ksd-notif-item-icon ${item.type}`}>
                                                        {item.type === 'danger' && <FaExclamationCircle/>}
                                                        {item.type === 'warning' && <FaBolt/>}
                                                        {item.type === 'success' && <FaCheckCircle/>}
                                                        {item.type === 'info' && <FaFilePdf/>}
                                                    </div>
                                                    <div className="ksd-notif-item-content">
                                                        <div className="ksd-notif-item-header">
                                                            <strong>{item.title}</strong>
                                                            <span className="ksd-notif-time">{item.time}</span>
                                                        </div>
                                                        <p>{item.message}</p>
                                                        {item.actionLabel && (
                                                            <div className="ksd-notif-action-row">
                                                                <span className="ksd-notif-action-btn">
                                                                    {item.actionLabel} <FaArrowRight className="ksd-notif-action-arr"/>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="ksd-notif-item-del"
                                                        title="Dismiss notification"
                                                        onClick={(e) => removeNotification(item.id, e)}
                                                        aria-label="Dismiss"
                                                    >
                                                        <FaTimes/>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {notifications.length > 0 && (
                                    <div className="ksd-notif-footer">
                                        <span className="ksd-notif-footer-hint">Click an alert to view details</span>
                                        <button 
                                            type="button" 
                                            className="ksd-notif-clear-btn" 
                                            onClick={clearAllNotifications}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Student User Pill */}
                    <div 
                        className="ksd-user-pill" 
                        onClick={() => navigate('/student/profile')}
                        title="View My Profile"
                    >
                        <div className="ksd-avatar">{firstName.charAt(0).toUpperCase()}</div>
                        <div className="ksd-user-info">
                            <span className="ksd-user-name">{studentData.fullName || studentData.name || 'Student'}</span>
                            <span className="ksd-user-sub">{rollNo} | {dept}</span>
                        </div>
                        <FaChevronDown className="ksd-user-caret"/>
                    </div>
                </div>
            </header>

            {/* ═══ BODY ═══ */}
            <div className="ksd-body">
                {/* ── SIDEBAR ── */}
                <aside className={`ksd-sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}>
                    <nav className="ksd-sidenav">
                        {navLinks.map(n => (
                            <SideItem
                                key={n.key}
                                icon={n.icon}
                                label={n.label}
                                active={activeTab === n.key || (n.path && location.pathname === n.path)}
                                onClick={() => {
                                    setMobileNavOpen(false);
                                    if (n.action) n.action();
                                    else if (n.path) navigate(n.path);
                                }}
                            />
                        ))}
                    </nav>
                    <button className="ksd-logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt/><span>Logout</span>
                    </button>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className="ksd-main">
                    {children}
                </main>
            </div>

            {/* ═══ FOOTER ═══ */}
            <KECFooter />
        </div>
    );
};

export default StudentLayout;
