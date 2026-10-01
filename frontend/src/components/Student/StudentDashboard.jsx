import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaCalendarCheck, FaBook, FaChartBar, FaFilePdf,
    FaUser, FaSignOutAlt, FaBolt, FaTachometerAlt,
    FaBell, FaChevronDown, FaChevronRight, FaArrowRight,
    FaGraduationCap, FaIdCard, FaBuilding, FaCalendarAlt,
    FaDownload, FaLayerGroup, FaUserAlt, FaCheckCircle,
    FaExclamationCircle, FaInfoCircle, FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
import { jsPDF } from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
try { applyPlugin(jsPDF); } catch (_) {}
import KECLogo from '../Common/KECLogo';
import KECFooter from '../Common/KECFooter';
import KECLoader from '../Common/KECLoader';
import './StudentDashboard.css';

/* ─────────────────────────────────────────────────────────
   SVG Donut Chart
───────────────────────────────────────────────────────── */
const DonutChart = ({ value = 0, color = '#008FD5', size = 84, stroke = 8 }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(100, Math.max(0, parseFloat(value) || 0));
    const filled = (pct / 100) * circ;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size/2} cy={size/2} r={r}
                fill="none" stroke="#E0EEF8" strokeWidth={stroke} />
            <circle cx={size/2} cy={size/2} r={r}
                fill="none" stroke={color} strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${filled} ${circ - filled}`}
                transform={`rotate(-90 ${size/2} ${size/2})`}
                style={{ transition: 'stroke-dasharray 0.7s ease' }}
            />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
                fontSize={size * 0.19} fontWeight="800" fill="#0B2B4C">
                {pct}%
            </text>
        </svg>
    );
};

/* ─────────────────────────────────────────────────────────
   Stacked Books Visual
───────────────────────────────────────────────────────── */
const BooksStack = () => (
    <svg viewBox="0 0 68 56" width="68" height="56">
        <ellipse cx="34" cy="53" rx="26" ry="3" fill="#E0EEF8" opacity="0.7"/>
        <rect x="5"  y="14" width="12" height="36" rx="2" fill="#0B2B4C"/>
        <rect x="5"  y="14" width="2.5" height="36" rx="1" fill="#1a3f6e"/>
        <rect x="16" y="8"  width="12" height="42" rx="2" fill="#008FD5"/>
        <rect x="16" y="8"  width="2.5" height="42" rx="1" fill="#33a8df"/>
        <rect x="27" y="4"  width="12" height="46" rx="2" fill="#72BE44"/>
        <rect x="27" y="4"  width="2.5" height="46" rx="1" fill="#8dd45f"/>
        <rect x="38" y="9"  width="12" height="41" rx="2" fill="#064C68"/>
        <rect x="38" y="9"  width="2.5" height="41" rx="1" fill="#0a6a90"/>
        <rect x="49" y="15" width="12" height="35" rx="2" fill="#075C57"/>
        <rect x="49" y="15" width="2.5" height="35" rx="1" fill="#0a8070"/>
    </svg>
);

/* ─────────────────────────────────────────────────────────
   Mini Bar Chart
───────────────────────────────────────────────────────── */
const MiniBar = ({ marks = [] }) => {
    const vals = (marks.length > 0 ? marks : [{percentage:75},{percentage:80},{percentage:70},{percentage:85},{percentage:78}])
        .slice(0, 6).map(m => parseFloat(m.percentage) || 0);
    return (
        <svg viewBox="0 0 60 40" width="60" height="40">
            {vals.map((v, i) => {
                const h = Math.max(3, (v/100) * 32);
                return <rect key={i} x={4 + i * 10} y={36 - h} width="7" height={h}
                    rx="2" fill={v >= 75 ? '#008FD5' : '#72BE44'} opacity="0.85"/>;
            })}
        </svg>
    );
};

/* ─────────────────────────────────────────────────────────
   Attendance Line Sparkline
───────────────────────────────────────────────────────── */
const AttLine = ({ data = [] }) => {
    const W = 320, H = 108;
    const pl = 30, pr = 6, pt = 6, pb = 24;
    const iW = W - pl - pr, iH = H - pt - pb;
    const pts = data.length >= 2 ? data : [
        {month:'Jan',percentage:70},{month:'Feb',percentage:68},{month:'Mar',percentage:74},
        {month:'Apr',percentage:79},{month:'May',percentage:82},{month:'Jun',percentage:80},
        {month:'Jul',percentage:84},{month:'Aug',percentage:87},{month:'Sep',percentage:90},{month:'Oct',percentage:92}
    ];
    const vals = pts.map(p => parseFloat(p.percentage) || 0);
    const mn = Math.max(0, Math.min(...vals) - 8), mx = Math.min(102, Math.max(...vals) + 5);
    const X = i => pl + (i / (pts.length-1)) * iW;
    const Y = v => pt + iH - ((v - mn) / (mx - mn)) * iH;
    const line = pts.map((p,i) => `${X(i)},${Y(vals[i])}`).join(' ');
    const area = `${X(0)},${Y(vals[0])} ${pts.slice(1).map((_,i)=>`${X(i+1)},${Y(vals[i+1])}`).join(' ')} ${X(pts.length-1)},${pt+iH} ${X(0)},${pt+iH}`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
            <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#008FD5" stopOpacity="0.22"/>
                    <stop offset="100%" stopColor="#008FD5" stopOpacity="0.01"/>
                </linearGradient>
            </defs>
            {[0,25,50,75,100].map(g => {
                const y = Y(g);
                if (y < pt-2 || y > pt+iH+2) return null;
                return <g key={g}>
                    <line x1={pl} y1={y} x2={W-pr} y2={y} stroke="#EBF4FC" strokeWidth="0.8" strokeDasharray="4,3"/>
                    <text x={pl-4} y={y+3} textAnchor="end" fontSize="7" fill="#94A3B8">{g}%</text>
                </g>;
            })}
            <polygon points={area} fill="url(#attGrad)"/>
            <polyline points={line} fill="none" stroke="#008FD5" strokeWidth="2.2" strokeLinejoin="round"/>
            {pts.map((p,i) => (
                <circle key={i} cx={X(i)} cy={Y(vals[i])} r="3.5"
                    fill="#fff" stroke="#008FD5" strokeWidth="2"/>
            ))}
            {pts.map((p,i) => (
                <text key={i} x={X(i)} y={H-3} textAnchor="middle" fontSize="7" fill="#94A3B8">{p.month}</text>
            ))}
        </svg>
    );
};

/* ─────────────────────────────────────────────────────────
   Subject Bar Chart
───────────────────────────────────────────────────────── */
const SubjectBars = ({ marks = [] }) => {
    const W = 370, H = 118;
    const pl = 6, pr = 6, pt = 20, pb = 26;
    const iW = W - pl - pr, iH = H - pt - pb;
    const data = marks.length > 0
        ? marks.slice(0,8).map(m => ({
            code: (m.subjectCode || m.subjectName || 'N/A').substring(0,4).toUpperCase(),
            val: parseFloat(m.percentage) || 0
          }))
        : [{code:'DBMS',val:85},{code:'OS',val:78},{code:'CN',val:92},
           {code:'DAA',val:88},{code:'SE',val:80},{code:'WT',val:86},{code:'AI',val:82},{code:'CC',val:90}];
    const n = data.length;
    const slotW = iW / n;
    const bw = Math.min(28, slotW * 0.55);
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
            {[0,25,50,75,100].map(g => (
                <line key={g} x1={pl} y1={pt + iH - (g/100)*iH} x2={W-pr} y2={pt + iH - (g/100)*iH}
                    stroke="#F0F6FB" strokeWidth="1"/>
            ))}
            {data.map((d,i) => {
                const bh = Math.max(3,(d.val/100)*iH);
                const x = pl + slotW*i + (slotW-bw)/2;
                const y = pt + iH - bh;
                const c = d.val >= 85 ? '#72BE44' : '#008FD5';
                return <g key={i}>
                    <text x={x+bw/2} y={y-4} textAnchor="middle" fontSize="8" fontWeight="700" fill={c}>{Math.round(d.val)}%</text>
                    <rect x={x} y={y} width={bw} height={bh} rx="3.5" fill={c} opacity="0.87"/>
                    <text x={x+bw/2} y={H-4} textAnchor="middle" fontSize="7.5" fill="#64748B">{d.code}</text>
                </g>;
            })}
        </svg>
    );
};

/* ─────────────────────────────────────────────────────────
   Sidebar Nav Item
───────────────────────────────────────────────────────── */
const SideItem = ({ icon, label, active, onClick }) => (
    <button className={`ksd-nav-item${active ? ' ksd-active' : ''}`} onClick={onClick}>
        <span className="ksd-nav-ico">{icon}</span>
        <span className="ksd-nav-lbl">{label}</span>
        {active && <span className="ksd-nav-pip"/>}
    </button>
);

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const StudentDashboard = () => {
    const navigate   = useNavigate();
    const location   = useLocation();

    const [stats,        setStats]        = useState(null);
    const [loading,      setLoading]      = useState(true);
    const [studentName,  setStudentName]  = useState('');
    const [studentInfo,  setStudentInfo]  = useState({});
    const [marksData,    setMarksData]    = useState([]);
    const [monthlyAtt,   setMonthlyAtt]   = useState([]);
    const [greeting,     setGreeting]     = useState('Good Morning');
    const [greetEmoji,   setGreetEmoji]   = useState('☀️');
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notifRef = useRef(null);

    // Auto-update dynamic notifications based on real student data
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
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const handleNotifClick = (item) => {
        markNotificationAsRead(item.id);
        setShowNotifications(false);
        if (item.isPdf) {
            handlePDF();
        } else if (item.path) {
            navigate(item.path);
        }
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    useEffect(() => {
        const h = new Date().getHours();
        if (h < 12)      { setGreeting('Good Morning');   setGreetEmoji('☀️'); }
        else if (h < 17) { setGreeting('Good Afternoon'); setGreetEmoji('🌤️'); }
        else              { setGreeting('Good Evening');   setGreetEmoji('🌙'); }
        fetchDashboard();
        fetchMarks();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_ENDPOINTS.STUDENT_DASHBOARD, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const d = await res.json();
                setStats(d.stats);
                setStudentName(d.studentName || '');
                setStudentInfo(d.studentInfo || {});
                setMonthlyAtt(d.monthlyAttendance || []);
            } else {
                toast.error('Failed to load dashboard data');
            }
        } catch (e) {
            console.error(e);
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    const fetchMarks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_ENDPOINTS.STUDENT_MARKS, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const d = await res.json();
                setMarksData(d.marks || []);
            }
        } catch (e) { console.error(e); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.info('Logged out successfully');
        navigate('/login');
    };

    const handlePDF = async () => {
        try {
            toast.info('Generating PDF report...');
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            const doc = new jsPDF();
            const pw = doc.internal.pageSize.getWidth();
            const ph = doc.internal.pageSize.getHeight();
            const C  = [0,143,213], N = [11,43,76], D = [30,41,59], M = [100,116,139];

            doc.setFillColor(...N); doc.rect(0,0,pw,45,'F');
            doc.setFillColor(...C); doc.rect(0,42.5,pw,2.5,'F');
            doc.setTextColor(255,255,255);
            doc.setFontSize(22); doc.setFont('helvetica','bold');
            doc.text('KONGU ENGINEERING COLLEGE', pw/2, 15, {align:'center'});
            doc.setFontSize(10); doc.setFont('helvetica','normal');
            doc.text('(Autonomous)', pw/2, 22, {align:'center'});
            doc.text('Affiliated to Anna University | NAAC A++ Grade', pw/2, 28, {align:'center'});
            doc.text('Perundurai, Erode – 638060, Tamil Nadu', pw/2, 34, {align:'center'});
            doc.setFontSize(14); doc.setFont('helvetica','bold');
            doc.text('STUDENT ACADEMIC REPORT', pw/2, 42, {align:'center'});

            let y = 55;
            const sec = (t) => {
                doc.setFillColor(240,245,252); doc.rect(10,y,pw-20,8,'F');
                doc.setTextColor(...D); doc.setFontSize(12); doc.setFont('helvetica','bold');
                doc.text(t,15,y+5.5); y+=12;
            };
            const row = (l,v) => {
                doc.setFontSize(10); doc.setFont('helvetica','bold');
                doc.text(l,15,y); doc.setFont('helvetica','normal');
                doc.text(String(v),65,y); y+=6;
            };

            sec('Student Information');
            row('Full Name:',       studentName || 'N/A');
            row('Roll Number:',     studentInfo.rollNumber || stored.rollNumber || 'N/A');
            row('Department:',      studentInfo.department || stored.className || 'N/A');
            row('Section:',         studentInfo.section    || stored.section   || 'N/A');
            row('Email:',           studentInfo.email      || stored.email     || 'N/A');
            row('Academic Year:',   studentInfo.academicYear || 'N/A');
            y += 4;

            sec('Attendance Summary');
            const renderTable = (opts) => {
                if (typeof doc.autoTable === 'function') {
                    doc.autoTable(opts);
                } else if (typeof autoTable === 'function') {
                    autoTable(doc, opts);
                }
            };

            renderTable({
                startY:y, head:[['Metric','Value']],
                body:[
                    ['Total Days',     stats?.totalDays   || 0],
                    ['Present Days',   stats?.presentDays || 0],
                    ['Absent Days',    stats?.absentDays  || 0],
                    ['Attendance %',  `${stats?.attendancePercentage || 0}%`]
                ],
                theme:'grid',
                headStyles:{fillColor:C,textColor:[255,255,255],fontStyle:'bold',fontSize:10},
                bodyStyles:{fontSize:9},
                alternateRowStyles:{fillColor:[245,249,252]},
                margin:{left:15,right:15}
            });
            y = (doc.lastAutoTable?.finalY || y + 35) + 10;
            if (y > ph - 60) { doc.addPage(); y = 20; }

            sec('Academic Performance');
            const mb = marksData.length > 0
                ? marksData.map(m => [`${m.subjectName} (${m.subjectCode})`,m.examType,m.marksObtained,m.maxMarks,`${m.percentage}%`])
                : [['No data','-','-','-','-']];
            renderTable({
                startY:y, head:[['Subject','Exam','Marks','Max','%']],
                body:mb, theme:'grid',
                headStyles:{fillColor:C,textColor:[255,255,255],fontStyle:'bold',fontSize:10},
                bodyStyles:{fontSize:9},
                alternateRowStyles:{fillColor:[245,249,252]},
                margin:{left:15,right:15}
            });

            const fy = ph - 22;
            doc.setDrawColor(200,210,220); doc.setLineWidth(0.5);
            doc.line(15,fy-5,pw-15,fy-5);
            doc.setFontSize(8); doc.setTextColor(...M); doc.setFont('helvetica','normal');
            const ts = new Date().toLocaleString('en-IN',{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});
            doc.text(`Generated on: ${ts}`,15,fy);
            doc.text('© 2026 Kongu Engineering College. All rights reserved.',pw/2,fy+5,{align:'center'});
            doc.text('Page 1 of 1',pw-15,fy,{align:'right'});

            doc.save(`Report_${studentInfo.rollNumber || 'Student'}_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('PDF downloaded successfully!');
        } catch (e) {
            console.error(e);
            toast.error('PDF generation failed.');
        }
    };

    if (loading) return <KECLoader fullScreen message="Loading Student Portal..." />;

    /* ── Derived Values ── */
    const stored    = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = (studentName || 'Student').split(' ')[0];
    const rollNo    = studentInfo.rollNumber || stored.rollNumber || '—';
    const dept      = studentInfo.department || stored.className  || '—';
    const acYear    = studentInfo.academicYear || '2022 – 2026';
    const sem       = studentInfo.semester || 'Semester 4';
    const attPct    = parseFloat(stats?.attendancePercentage || 0);
    const totalDays = stats?.totalDays  || 0;
    const presDays  = stats?.presentDays || 0;
    const absDays   = stats?.absentDays  || 0;
    const totSubs   = stats?.totalSubjects || 0;

    const avgPct = marksData.length > 0
        ? (marksData.reduce((s,m) => s + (parseFloat(m.percentage)||0), 0) / marksData.length).toFixed(1)
        : 0;
    const totObt = marksData.reduce((s,m) => s + (m.marksObtained||0), 0);
    const totMax = marksData.reduce((s,m) => s + (m.maxMarks||0), 0);

    const navLinks = [
        { icon:<FaTachometerAlt/>, label:'Dashboard',       path:'/student/dashboard' },
        { icon:<FaCalendarCheck/>, label:'Attendance',      path:'/student/attendance' },
        { icon:<FaChartBar/>,      label:'Marks',           path:'/student/marks' },
        { icon:<FaLayerGroup/>,    label:'Subjects',        path:'/student/subjects' },
        { icon:<FaUser/>,          label:'Profile',         path:'/student/profile' },
        { icon:<FaDownload/>,      label:'Download Report', path:null, action: handlePDF },
    ];

    return (
        <div className="ksd-root">

            {/* ═══ TOP NAVBAR ═══ */}
            <header className="ksd-topbar">
                <div className="ksd-topbar-left">
                    <KECLogo size="small" align="left" showCredentials={false}/>
                    <div className="ksd-topbar-sep"/>
                    <div className="ksd-portal-badge">
                        <FaGraduationCap className="ksd-portal-ico"/>
                        <span>Student Portal</span>
                    </div>
                </div>
                <div className="ksd-topbar-right">
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
                    <div className="ksd-user-pill" onClick={() => navigate('/student/profile')}>
                        <div className="ksd-avatar">{firstName.charAt(0).toUpperCase()}</div>
                        <div className="ksd-user-info">
                            <span className="ksd-user-name">{studentName || 'Student'}</span>
                            <span className="ksd-user-sub">{rollNo} | {dept}</span>
                        </div>
                        <FaChevronDown className="ksd-user-caret"/>
                    </div>
                </div>
            </header>

            {/* ═══ BODY ═══ */}
            <div className="ksd-body">

                {/* ── SIDEBAR ── */}
                <aside className="ksd-sidebar">
                    <nav className="ksd-sidenav">
                        {navLinks.map(n => (
                            <SideItem
                                key={n.label}
                                icon={n.icon}
                                label={n.label}
                                active={n.path && location.pathname === n.path}
                                onClick={n.action ? n.action : () => navigate(n.path)}
                            />
                        ))}
                    </nav>
                    <button className="ksd-logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt/><span>Logout</span>
                    </button>
                </aside>

                {/* ── MAIN ── */}
                <main className="ksd-main">

                    {/* ════════════════════════════════
                        HERO CARD
                    ════════════════════════════════ */}
                    <section className="ksd-hero" aria-label="Welcome Banner">

                        {/* ── Real KEC Campus Gate Photo ── */}
                        <img
                            src="/kec-gate.webp"
                            alt="Kongu Engineering College Campus Gate"
                            className="ksd-hero-img"
                        />
                        {/* ── KEC Branded Gradient Overlay (above photo) ── */}
                        <div className="ksd-hero-overlay"/>
                        {/* ── Subtle dot pattern (above overlay, below text) ── */}
                        <div className="ksd-hero-dots"/>

                        {/* Left: text content */}
                        <div className="ksd-hero-left">
                            <p className="ksd-hero-greeting">
                                {greeting.toUpperCase()} {greetEmoji}
                            </p>
                            <h1 className="ksd-hero-title">
                                Welcome back, <span className="ksd-hero-name">{firstName}!</span>
                            </h1>
                            <p className="ksd-hero-sub">
                                Here's an overview of your academic performance.
                            </p>

                            {/* Info pills */}
                            <div className="ksd-hero-pills">
                                <div className="ksd-pill">
                                    <FaUserAlt className="ksd-pill-ico"/>
                                    <div className="ksd-pill-text">
                                        <strong>{rollNo}</strong>
                                        <span>Roll Number</span>
                                    </div>
                                </div>
                                <div className="ksd-pill">
                                    <FaBuilding className="ksd-pill-ico"/>
                                    <div className="ksd-pill-text">
                                        <strong>{dept}</strong>
                                        <span>Department</span>
                                    </div>
                                </div>
                                <div className="ksd-pill">
                                    <FaCalendarAlt className="ksd-pill-ico"/>
                                    <div className="ksd-pill-text">
                                        <strong>{acYear}</strong>
                                        <span>Academic Year</span>
                                    </div>
                                </div>
                                <div className="ksd-pill">
                                    <FaLayerGroup className="ksd-pill-ico"/>
                                    <div className="ksd-pill-text">
                                        <strong>{sem}</strong>
                                        <span>Semester</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: quote */}
                        <div className="ksd-hero-right">
                            <p className="ksd-hero-quote">
                                "Transform Yourself<br/>for a Better Tomorrow"
                            </p>
                            <div className="ksd-hero-quote-line"/>
                        </div>
                    </section>

                    {/* ════════════════════════════════
                        KPI STAT CARDS
                    ════════════════════════════════ */}
                    <section className="ksd-stats-row">

                        {/* Card: Attendance */}
                        <article className="ksd-stat-card ksd-card-att"
                            onClick={() => navigate('/student/attendance')}
                            tabIndex={0} role="button"
                            onKeyDown={e => e.key==='Enter' && navigate('/student/attendance')}>
                            <div className="ksd-stat-left">
                                <div className="ksd-stat-ico-wrap ksd-ico-blue">
                                    <FaCalendarCheck/>
                                </div>
                                <div className="ksd-stat-info">
                                    <p className="ksd-stat-label">Attendance</p>
                                    <h2 className="ksd-stat-value">{attPct}%</h2>
                                    <p className="ksd-stat-sub">{presDays} / {totalDays} Classes</p>
                                    <div className="ksd-att-bar-track">
                                        <div className="ksd-att-bar-fill"
                                            style={{ width: `${Math.min(100,attPct)}%` }}/>
                                    </div>
                                    <span className={`ksd-badge ${attPct >= 75 ? 'ksd-badge-green' : 'ksd-badge-red'}`}>
                                        {attPct >= 75
                                            ? `▲ +${(attPct-75).toFixed(1)}% from last month`
                                            : `▼ Below 75% minimum`}
                                    </span>
                                </div>
                            </div>
                            <div className="ksd-stat-chart">
                                <DonutChart value={attPct} color="#008FD5"/>
                            </div>
                            <FaChevronRight className="ksd-card-arr"/>
                        </article>

                        {/* Card: Total Subjects */}
                        <article className="ksd-stat-card"
                            onClick={() => navigate('/student/marks')}
                            tabIndex={0} role="button"
                            onKeyDown={e => e.key==='Enter' && navigate('/student/marks')}>
                            <div className="ksd-stat-left">
                                <div className="ksd-stat-ico-wrap ksd-ico-green">
                                    <FaBook/>
                                </div>
                                <div className="ksd-stat-info">
                                    <p className="ksd-stat-label">Total Subjects</p>
                                    <h2 className="ksd-stat-value">{totSubs}</h2>
                                    <p className="ksd-stat-sub">
                                        {Math.max(0, totSubs-2)} Core | {Math.min(2, totSubs)} Elective
                                    </p>
                                    <span className="ksd-badge ksd-badge-blue">🎓 Semester IV</span>
                                </div>
                            </div>
                            <div className="ksd-stat-chart">
                                <BooksStack/>
                            </div>
                            <FaChevronRight className="ksd-card-arr"/>
                        </article>

                        {/* Card: Average Marks */}
                        <article className="ksd-stat-card"
                            onClick={() => navigate('/student/marks')}
                            tabIndex={0} role="button"
                            onKeyDown={e => e.key==='Enter' && navigate('/student/marks')}>
                            <div className="ksd-stat-left">
                                <div className="ksd-stat-ico-wrap ksd-ico-navy">
                                    <FaChartBar/>
                                </div>
                                <div className="ksd-stat-info">
                                    <p className="ksd-stat-label">Average Marks</p>
                                    <h2 className="ksd-stat-value">{avgPct}%</h2>
                                    <p className="ksd-stat-sub">{totObt} / {totMax} Total Marks</p>
                                    <span className={`ksd-badge ${parseFloat(avgPct)>=75?'ksd-badge-green':'ksd-badge-red'}`}>
                                        📈 {parseFloat(avgPct)>=75?'Good Performance':'Needs Improvement'}
                                    </span>
                                </div>
                            </div>
                            <div className="ksd-stat-chart">
                                <MiniBar marks={marksData}/>
                            </div>
                            <FaChevronRight className="ksd-card-arr"/>
                        </article>
                    </section>

                    {/* ════════════════════════════════
                        CHARTS ROW
                    ════════════════════════════════ */}
                    <section className="ksd-charts-row">

                        {/* Attendance Overview */}
                        <div className="ksd-chart-card">
                            <div className="ksd-chart-hdr">
                                <h3 className="ksd-chart-title">
                                    <span className="ksd-chart-title-ico">📊</span>
                                    Attendance Overview
                                </h3>
                                <button className="ksd-viewbtn"
                                    onClick={() => navigate('/student/attendance')}>
                                    View Details <FaArrowRight className="ksd-viewbtn-ico"/>
                                </button>
                            </div>
                            <div className="ksd-att-layout">
                                <div className="ksd-att-chart-wrap">
                                    <AttLine data={monthlyAtt}/>
                                </div>
                                <div className="ksd-att-legend">
                                    {[
                                        {dot:'#CBD5E1', label:'Total Classes', val: totalDays,     cls:''},
                                        {dot:'#22C55E', label:'Present',       val: presDays,      cls:'ksd-vg'},
                                        {dot:'#EF4444', label:'Absent',        val: absDays,       cls:'ksd-vr'},
                                        {dot:'#008FD5', label:'Attendance',    val: `${attPct}%`,  cls:'ksd-vb'},
                                    ].map(r => (
                                        <div key={r.label} className="ksd-legend-row">
                                            <span className="ksd-legend-dot" style={{background:r.dot}}/>
                                            <span className="ksd-legend-lbl">{r.label}</span>
                                            <span className={`ksd-legend-val ${r.cls}`}>{r.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Subject-wise Marks */}
                        <div className="ksd-chart-card">
                            <div className="ksd-chart-hdr">
                                <h3 className="ksd-chart-title">
                                    <span className="ksd-chart-title-ico">📚</span>
                                    Subject-wise Marks
                                    <span className="ksd-chart-sub"> (Current Semester)</span>
                                </h3>
                                <button className="ksd-viewbtn ksd-viewbtn-green"
                                    onClick={() => navigate('/student/marks')}>
                                    View Marks <FaArrowRight className="ksd-viewbtn-ico"/>
                                </button>
                            </div>
                            <div className="ksd-bar-wrap">
                                <SubjectBars marks={marksData}/>
                            </div>
                        </div>
                    </section>

                    {/* ════════════════════════════════
                        QUICK ACTIONS
                    ════════════════════════════════ */}
                    <section className="ksd-actions-section">
                        <h3 className="ksd-section-heading">
                            <FaBolt className="ksd-bolt-ico"/> Quick Actions
                        </h3>
                        <div className="ksd-actions-grid">

                            <button className="ksd-action-card ksd-ac-blue"
                                onClick={() => navigate('/student/attendance')}>
                                <div className="ksd-ac-icon"><FaCalendarCheck/></div>
                                <div className="ksd-ac-text">
                                    <strong>View Attendance</strong>
                                    <p>Check your daily attendance records and history</p>
                                </div>
                                <FaArrowRight className="ksd-ac-arr"/>
                            </button>

                            <button className="ksd-action-card ksd-ac-green"
                                onClick={() => navigate('/student/marks')}>
                                <div className="ksd-ac-icon"><FaChartBar/></div>
                                <div className="ksd-ac-text">
                                    <strong>View Marks</strong>
                                    <p>Check your internal and semester marks</p>
                                </div>
                                <FaArrowRight className="ksd-ac-arr"/>
                            </button>

                            <button className="ksd-action-card ksd-ac-teal"
                                onClick={() => navigate('/student/profile')}>
                                <div className="ksd-ac-icon"><FaUser/></div>
                                <div className="ksd-ac-text">
                                    <strong>My Profile</strong>
                                    <p>View and update your personal information</p>
                                </div>
                                <FaArrowRight className="ksd-ac-arr"/>
                            </button>

                            <button className="ksd-action-card ksd-ac-navy"
                                onClick={handlePDF}>
                                <div className="ksd-ac-icon"><FaFilePdf/></div>
                                <div className="ksd-ac-text">
                                    <strong>Download Report</strong>
                                    <p>Generate and download your academic report</p>
                                </div>
                                <FaArrowRight className="ksd-ac-arr"/>
                            </button>

                        </div>
                    </section>

                    <KECFooter/>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
