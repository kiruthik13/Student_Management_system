const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');
const Subject = require('../models/Subject');

// Helper to finding student profile from logged in User
const getStudentProfile = async (email) => {
    return await Student.findOne({ email: email.toLowerCase() });
};

// GET /student/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const student = await getStudentProfile(req.user.email);
        if (!student) {
            return res.status(404).json({ message: 'Student profile not linked to this account' });
        }

        // 1. Attendance % (Overall)
        // Calculate from all attendance records
        const attendanceRecords = await Attendance.find({ student: student._id });
        let totalPeriods = 0;
        let present = 0;
        let absent = 0;
        const uniqueDates = new Set();
        let presentDays = 0;
        let absentDays = 0;
        let halfDays = 0;

        attendanceRecords.forEach(record => {
            const dateStr = record.date ? new Date(record.date).toISOString().split('T')[0] : null;
            if (dateStr) uniqueDates.add(dateStr);

            let dayMarked = 0;
            let dayAttended = 0;

            const processPeriod = (p) => {
                const st = (p.status || '').toLowerCase();
                if (st && st !== 'not-marked') {
                    totalPeriods++;
                    dayMarked++;
                    if (st === 'present' || st === 'late') {
                        present += 1;
                        dayAttended += 1;
                    } else if (st === 'half-day') {
                        present += 0.5;
                        dayAttended += 0.5;
                    } else if (st === 'absent') {
                        absent++;
                    }
                }
            };

            if (record.forenoon && record.forenoon.periods) {
                record.forenoon.periods.forEach(processPeriod);
            }
            if (record.afternoon && record.afternoon.periods) {
                record.afternoon.periods.forEach(processPeriod);
            }

            if (dayMarked > 0) {
                if (dayAttended === dayMarked) {
                    presentDays++;
                } else if (dayAttended === 0) {
                    absentDays++;
                } else {
                    halfDays++;
                }
            }
        });

        const totalDays = uniqueDates.size;
        const attendancePercentage = totalPeriods > 0 ? ((present / totalPeriods) * 100).toFixed(1) : 0;

        // 2. Total Subjects
        const totalSubjects = await Subject.countDocuments();

        // 3. Total Marks Received
        const marks = await Mark.find({ studentId: student._id });
        const totalMarks = marks.reduce((sum, mark) => sum + (mark.marksObtained || 0), 0);

        // Build monthly attendance breakdown for the line chart
        const monthlyMap = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        attendanceRecords.forEach(record => {
            if (!record.date) return;
            const d = new Date(record.date);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            if (!monthlyMap[key]) {
                monthlyMap[key] = { month: monthNames[d.getMonth()], year: d.getFullYear(), present: 0, total: 0 };
            }
            const processPeriodMonthly = (p) => {
                const st = (p.status || '').toLowerCase();
                if (st && st !== 'not-marked') {
                    monthlyMap[key].total++;
                    if (st === 'present' || st === 'late') monthlyMap[key].present += 1;
                    else if (st === 'half-day') monthlyMap[key].present += 0.5;
                }
            };
            if (record.forenoon && record.forenoon.periods) record.forenoon.periods.forEach(processPeriodMonthly);
            if (record.afternoon && record.afternoon.periods) record.afternoon.periods.forEach(processPeriodMonthly);
        });

        const monthlyAttendance = Object.values(monthlyMap)
            .sort((a, b) => (a.year * 12 + monthNames.indexOf(a.month)) - (b.year * 12 + monthNames.indexOf(b.month)))
            .map(m => ({
                month: m.month,
                percentage: m.total > 0 ? ((m.present / m.total) * 100).toFixed(1) : '0'
            }));

        // Derive default academic year from rollNumber pattern if student hasn't entered one
        const rollYear = student.rollNumber ? `20${student.rollNumber.substring(0, 2)}` : null;
        const gradYear = rollYear ? parseInt(rollYear) + 4 : null;
        const computedAcademicYear = rollYear && gradYear ? `${rollYear} - ${gradYear}` : '2022 - 2026';
        const academicYear = student.academicYear || computedAcademicYear;
        const semester = student.semester || 'Semester 4';

        res.json({
            studentName: student.fullName,
            rollNumber: student.rollNumber,
            studentInfo: {
                rollNumber: student.rollNumber,
                department: student.className || 'N/A',
                section: student.section || 'N/A',
                email: student.email,
                academicYear,
                semester,
                phoneNumber: student.phoneNumber,
            },
            monthlyAttendance,
            stats: {
                attendancePercentage,
                totalDays,
                presentDays,
                absentDays,
                halfDays,
                totalPeriods,
                presentPeriods: present,
                totalSubjects,
                totalMarks
            }
        });

    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /student/attendance
exports.getAttendance = async (req, res) => {
    try {
        const student = await getStudentProfile(req.user.email);
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const { month, year } = req.query;

        let query = { student: student._id };
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            query.date = { $gte: startDate, $lte: endDate };
        }

        const attendance = await Attendance.find(query).sort({ date: -1 });

        // Transform for UI (Daily status with accurate academic classification)
        const history = attendance.map(record => {
            let pCount = 0;
            let total = 0;
            let absentCount = 0;

            const processPeriod = (p) => {
                const st = (p.status || '').toLowerCase();
                if (st && st !== 'not-marked') {
                    total++;
                    if (st === 'present' || st === 'late') {
                        pCount += 1;
                    } else if (st === 'half-day') {
                        pCount += 0.5;
                    } else if (st === 'absent') {
                        absentCount += 1;
                    }
                }
            };

            if (record.forenoon && record.forenoon.periods) {
                record.forenoon.periods.forEach(processPeriod);
            }
            if (record.afternoon && record.afternoon.periods) {
                record.afternoon.periods.forEach(processPeriod);
            }

            let status = 'Not Marked';
            if (total > 0) {
                if (absentCount === 0 && pCount > 0) {
                    status = 'Present';
                } else if (pCount === 0) {
                    status = 'Absent';
                } else {
                    status = 'Half-Day';
                }
            }

            return {
                date: record.date,
                status,
                periodsPresent: pCount,
                totalPeriods: total
            };
        });

        res.json({ attendance: history });

    } catch (error) {
        console.error('Attendance Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /student/marks
exports.getMarks = async (req, res) => {
    try {
        const student = await getStudentProfile(req.user.email);
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const marks = await Mark.find({ studentId: student._id })
            .populate('subjectId', 'name code maxMarks')
            .sort({ createdAt: -1 });

        const formattedMarks = marks
            .filter(m => m.subjectId)
            .map(m => ({
                subjectName: m.subjectId.name,
                subjectCode: m.subjectId.code,
                examType: m.examType,
                marksObtained: m.marksObtained,
                maxMarks: m.subjectId.maxMarks,
                percentage: m.subjectId.maxMarks > 0 ? ((m.marksObtained / m.subjectId.maxMarks) * 100).toFixed(2) : '0.00'
            }));

        res.json({ marks: formattedMarks });

    } catch (error) {
        console.error('Marks Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /student/profile
exports.getProfile = async (req, res) => {
    try {
        const student = await getStudentProfile(req.user.email);
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        res.json({ student });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT /student/profile
exports.updateProfile = async (req, res) => {
    try {
        const student = await getStudentProfile(req.user.email);
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const {
            phoneNumber,
            parentName,
            parentPhone,
            address,
            academicYear,
            semester
        } = req.body;

        if (phoneNumber !== undefined) student.phoneNumber = phoneNumber;
        if (parentName !== undefined) student.parentName = parentName;
        if (parentPhone !== undefined) student.parentPhone = parentPhone;
        if (address !== undefined) student.address = address;
        if (academicYear !== undefined) student.academicYear = academicYear.trim();
        if (semester !== undefined && semester) student.semester = semester.trim();

        await student.save();

        res.json({
            message: 'Profile updated successfully',
            student
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};
