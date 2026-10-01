import { jsPDF } from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../config/api';

try {
  applyPlugin(jsPDF);
} catch (_) {}

export const generateStudentPDFReport = async ({ studentInfo: passedInfo, stats: passedStats, marksData: passedMarks } = {}) => {
  try {
    toast.info('Generating official PDF report...');

    let studentInfo = passedInfo;
    let stats = passedStats;
    let marksData = passedMarks;
    const token = localStorage.getItem('token');
    const stored = JSON.parse(localStorage.getItem('user') || '{}');

    // If data not passed, fetch from dashboard & marks endpoints
    if (!studentInfo || !stats) {
      try {
        const res = await fetch(API_ENDPOINTS.STUDENT_DASHBOARD, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const d = await res.json();
          studentInfo = d.studentInfo || {};
          stats = d.stats || {};
        }
      } catch (err) {
        console.error('Failed to fetch dashboard info for report', err);
      }
    }

    if (!marksData) {
      try {
        const res = await fetch(API_ENDPOINTS.STUDENT_MARKS, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const d = await res.json();
          marksData = d.marks || [];
        }
      } catch (err) {
        console.error('Failed to fetch marks for report', err);
      }
    }

    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const C = [0, 143, 213];
    const N = [11, 43, 76];
    const D = [30, 41, 59];
    const M = [100, 116, 139];

    // Header banner
    doc.setFillColor(...N);
    doc.rect(0, 0, pw, 45, 'F');
    doc.setFillColor(...C);
    doc.rect(0, 42.5, pw, 2.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('KONGU ENGINEERING COLLEGE', pw / 2, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('(Autonomous)', pw / 2, 22, { align: 'center' });
    doc.text('Affiliated to Anna University | NAAC A++ Grade', pw / 2, 28, { align: 'center' });
    doc.text('Perundurai, Erode – 638060, Tamil Nadu', pw / 2, 34, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT ACADEMIC REPORT', pw / 2, 42, { align: 'center' });

    let y = 55;
    const sec = (t) => {
      doc.setFillColor(240, 245, 252);
      doc.rect(10, y, pw - 20, 8, 'F');
      doc.setTextColor(...D);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(t, 15, y + 5.5);
      y += 12;
    };

    const row = (l, v) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(l, 15, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(v || 'N/A'), 65, y);
      y += 6;
    };

    sec('Student Information');
    row('Full Name:', stored.fullName || stored.name || studentInfo?.fullName || 'N/A');
    row('Roll Number:', studentInfo?.rollNumber || stored.rollNumber || 'N/A');
    row('Department:', studentInfo?.department || stored.className || 'N/A');
    row('Section:', studentInfo?.section || stored.section || 'N/A');
    row('Semester:', studentInfo?.semester || 'Semester 4');
    row('Academic Year:', studentInfo?.academicYear || '2022 - 2026');
    row('Email:', studentInfo?.email || stored.email || 'N/A');
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
      startY: y,
      head: [['Metric', 'Value']],
      body: [
        ['Total Days', stats?.totalDays || 0],
        ['Present Days', stats?.presentDays || 0],
        ['Absent Days', stats?.absentDays || 0],
        ['Attendance %', `${stats?.attendancePercentage || 0}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: C, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 249, 252] },
      margin: { left: 15, right: 15 }
    });
    y = (doc.lastAutoTable?.finalY || y + 35) + 10;
    if (y > ph - 60) {
      doc.addPage();
      y = 20;
    }

    sec('Academic Performance');
    const mb = (marksData && marksData.length > 0)
      ? marksData.map(m => [
          `${m.subjectName} (${m.subjectCode || '—'})`,
          m.examType || 'Internal',
          m.marksObtained ?? 0,
          m.maxMarks ?? 100,
          `${m.percentage ?? 0}%`
        ])
      : [['No examination marks recorded yet', '—', '—', '—', '—']];

    renderTable({
      startY: y,
      head: [['Subject', 'Exam', 'Marks', 'Max', '%']],
      body: mb,
      theme: 'grid',
      headStyles: { fillColor: C, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 249, 252] },
      margin: { left: 15, right: 15 }
    });

    const fy = ph - 22;
    doc.setDrawColor(200, 210, 220);
    doc.setLineWidth(0.5);
    doc.line(15, fy - 5, pw - 15, fy - 5);
    doc.setFontSize(8);
    doc.setTextColor(...M);
    doc.setFont('helvetica', 'normal');
    const ts = new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generated on: ${ts}`, 15, fy);
    doc.text('© 2026 Kongu Engineering College. All rights reserved.', pw / 2, fy + 5, { align: 'center' });
    doc.text('Page 1 of 1', pw - 15, fy, { align: 'right' });

    const roll = studentInfo?.rollNumber || stored.rollNumber || 'Student';
    doc.save(`KEC_Report_${roll}_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Official PDF report downloaded successfully!');
  } catch (err) {
    console.error('PDF error:', err);
    toast.error('Failed to generate PDF report.');
  }
};
