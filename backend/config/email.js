const nodemailer = require('nodemailer');

// Create transporter for Gmail with retry mechanism
const createTransporter = (usePort587 = true) => {
  // Use explicit SMTP configuration
  // Port 587 (STARTTLS) is more reliable than 465 (SSL) in many network environments
  const emailUser = process.env.EMAIL_USER || 'kiruthikbairavan13@gmail.com';
  const emailPass = process.env.EMAIL_PASSWORD || 'ytduxlufdwyfvlcm';

  const port = usePort587 ? 587 : 465;
  const secure = !usePort587;

  const config = {
    host: 'smtp.gmail.com',
    port: port,
    secure: secure, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
      // Use TLS 1.2 or higher
      minVersion: 'TLSv1.2'
    },
    // Connection timeout settings (in milliseconds) - fail fast on blocked networks
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    // Disable keepalive to avoid connection issues
    pool: false,
    // Require TLS
    requireTLS: usePort587
  };

  console.log(`📧 Creating transporter with port ${config.port} (secure: ${config.secure}, requireTLS: ${config.requireTLS})`);
  return nodemailer.createTransport(config);
};

// Email templates
const emailTemplates = {
  welcomeEmail: (adminName, email) => {
    const dashboardUrl = process.env.FRONTEND_URL || 'https://kec-student-attendance.vercel.app';
    return {
      subject: 'Welcome to Kongu Engineering College - Attendance Management System',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px 12px; background-color: #f1f5f9;">
          <div style="background: linear-gradient(135deg, #0B2545 0%, #134074 100%); padding: 32px 28px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase;">KONGU ENGINEERING COLLEGE</h1>
            <div style="margin: 10px 0 6px 0;">
              <span style="display: inline-block; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25); color: #72BE44; font-weight: 700; font-size: 12px; padding: 3px 12px; border-radius: 20px; letter-spacing: 0.5px;">
                (Autonomous) · Transform Yourself
              </span>
            </div>
            <p style="color: #93C5FD; margin: 4px 0 0 0; font-size: 13px; font-weight: 500;">Student Attendance & Academic Management System</p>
          </div>
          
          <div style="background: #ffffff; padding: 32px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 6px 20px rgba(11, 37, 69, 0.07); border: 1px solid #e2e8f0; border-top: none;">
            <div style="margin-bottom: 14px;">
              <span style="display: inline-block; background: #DCFCE7; border: 1px solid #BBF7D0; color: #15803D; font-size: 11.5px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
                ✓ Account Created Successfully
              </span>
            </div>
            <h2 style="color: #0B2545; margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">Welcome to KEC Attendance System</h2>
            
            <p style="color: #334155; line-height: 1.6; margin-bottom: 20px; font-size: 14.5px;">
              Dear <strong>${adminName}</strong>,
            </p>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px; font-size: 14px;">
              Your account has been registered successfully with the Kongu Engineering College Attendance Management System. You now have full access to manage students, mark period attendance, enter assessment marks, and generate institutional reports.
            </p>
            
            <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; padding: 18px 20px; border-radius: 12px; margin: 20px 0;">
              <h3 style="color: #0B2545; margin: 0 0 12px 0; font-size: 14.5px; font-weight: 700;">📋 Account Profile:</h3>
              <p style="margin: 6px 0; font-size: 13.5px; color: #334155;"><strong>👤 Name:</strong> ${adminName}</p>
              <p style="margin: 6px 0; font-size: 13.5px; color: #334155;"><strong>📧 Email:</strong> ${email}</p>
              <p style="margin: 6px 0; font-size: 13.5px; color: #334155;"><strong>🔐 Status:</strong> <span style="background: #DCFCE7; color: #15803D; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 12px;">Active Verified</span></p>
            </div>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${dashboardUrl}" 
                 style="background: linear-gradient(135deg, #008FD5 0%, #0B2545 100%); color: #ffffff; padding: 13px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(0, 143, 213, 0.3);">
                Access Dashboard →
              </a>
            </div>
            
            <p style="color: #94A3B8; font-size: 12.5px; margin-top: 26px; border-top: 1px solid #E2E8F0; padding-top: 18px; line-height: 1.5;">
              If you have any questions or require administrative assistance, please contact the KEC Attendance Administration team.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #64748B; font-size: 12px; line-height: 1.6;">
            <p style="margin: 0 0 4px 0; font-weight: 600; color: #475569;">© 2026 Kongu Engineering College. All rights reserved.</p>
            <p style="margin: 0 0 4px 0;">Perundurai Erode - 638060 Tamilnadu India</p>
            <p style="margin: 0; color: #94A3B8; font-size: 11.5px;">(Autonomous) · Transform Yourself</p>
          </div>
        </div>
      `
    };
  },

  loginEmail: (adminName, email, loginTime, ipAddress) => {
    const dashboardUrl = process.env.FRONTEND_URL || 'https://kec-student-attendance.vercel.app';
    return {
      subject: 'Login Notification - Kongu Engineering College Attendance System',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px 12px; background-color: #f1f5f9;">
          <div style="background: linear-gradient(135deg, #0B2545 0%, #134074 100%); padding: 32px 28px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase;">KONGU ENGINEERING COLLEGE</h1>
            <div style="margin: 10px 0 6px 0;">
              <span style="display: inline-block; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25); color: #72BE44; font-weight: 700; font-size: 12px; padding: 3px 12px; border-radius: 20px; letter-spacing: 0.5px;">
                (Autonomous) · Transform Yourself
              </span>
            </div>
            <p style="color: #93C5FD; margin: 4px 0 0 0; font-size: 13px; font-weight: 500;">Student Attendance & Academic Management System</p>
          </div>
          
          <div style="background: #ffffff; padding: 32px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 6px 20px rgba(11, 37, 69, 0.07); border: 1px solid #e2e8f0; border-top: none;">
            <div style="margin-bottom: 14px;">
              <span style="display: inline-block; background: #E0F2FE; border: 1px solid #BAE6FD; color: #0369A1; font-size: 11.5px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
                🔐 Login Notification
              </span>
            </div>
            <h2 style="color: #0B2545; margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">Account Activity Alert</h2>
            
            <p style="color: #334155; line-height: 1.6; margin-bottom: 18px; font-size: 14.5px;">
              Dear <strong>${adminName}</strong>,
            </p>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px; font-size: 14px;">
              We detected a successful login to your Attendance Management System account. If this was you, no action is needed.
            </p>
            
            <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; padding: 18px 20px; border-radius: 12px; margin: 20px 0;">
              <h3 style="color: #0B2545; margin: 0 0 12px 0; font-size: 14.5px; font-weight: 700;">📋 Login Details:</h3>
              <p style="margin: 6px 0; font-size: 13.5px; color: #334155;"><strong>👤 Account:</strong> ${adminName}</p>
              <p style="margin: 6px 0; font-size: 13.5px; color: #334155;"><strong>📧 Email:</strong> ${email}</p>
              <p style="margin: 6px 0; font-size: 13.5px; color: #334155;"><strong>🕐 Login Time:</strong> ${loginTime}</p>
              ${ipAddress ? `<p style="margin: 6px 0; font-size: 13.5px; color: #334155;"><strong>🌐 IP Address:</strong> <code style="background: #E2E8F0; padding: 2px 6px; border-radius: 4px;">${ipAddress}</code></p>` : ''}
              <p style="margin: 6px 0; font-size: 13.5px; color: #334155;"><strong>✅ Status:</strong> <span style="background: #DCFCE7; color: #15803D; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 12px;">Successful</span></p>
            </div>
            
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-left: 4px solid #F59E0B; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400E; margin: 0; font-size: 13px; line-height: 1.5;">
                <strong>⚠️ Security Notice:</strong> If you did not perform this login, please change your password immediately and contact the system administrator.
              </p>
            </div>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${dashboardUrl}" 
                 style="background: linear-gradient(135deg, #008FD5 0%, #0B2545 100%); color: white; padding: 13px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(0, 143, 213, 0.3);">
                Access Dashboard →
              </a>
            </div>
            
            <p style="color: #94A3B8; font-size: 12.5px; margin-top: 26px; border-top: 1px solid #E2E8F0; padding-top: 18px; line-height: 1.5;">
              This is an automated security notification. For security reasons, we notify you of all login activities on your account.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #64748B; font-size: 12px; line-height: 1.6;">
            <p style="margin: 0 0 4px 0; font-weight: 600; color: #475569;">© 2026 Kongu Engineering College. All rights reserved.</p>
            <p style="margin: 0 0 4px 0;">Perundurai Erode - 638060 Tamilnadu India</p>
            <p style="margin: 0; color: #94A3B8; font-size: 11.5px;">(Autonomous) · Transform Yourself</p>
          </div>
        </div>
      `
    };
  },

  passwordResetEmail: (adminName, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'https://kec-student-attendance.vercel.app'}/reset-password?token=${resetToken}`;
    return {
      subject: 'Password Reset Request - Kongu Engineering College',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px 12px; background-color: #f1f5f9;">
          <div style="background: linear-gradient(135deg, #0B2545 0%, #134074 100%); padding: 32px 28px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase;">KONGU ENGINEERING COLLEGE</h1>
            <div style="margin: 10px 0 6px 0;">
              <span style="display: inline-block; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25); color: #72BE44; font-weight: 700; font-size: 12px; padding: 3px 12px; border-radius: 20px; letter-spacing: 0.5px;">
                (Autonomous) · Transform Yourself
              </span>
            </div>
            <p style="color: #93C5FD; margin: 4px 0 0 0; font-size: 13px; font-weight: 500;">Student Attendance & Academic Management System</p>
          </div>
          
          <div style="background: #ffffff; padding: 32px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 6px 20px rgba(11, 37, 69, 0.07); border: 1px solid #e2e8f0; border-top: none;">
            <div style="margin-bottom: 14px;">
              <span style="display: inline-block; background: #FEE2E2; border: 1px solid #FECACA; color: #DC2626; font-size: 11.5px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
                🔑 Password Recovery
              </span>
            </div>
            <h2 style="color: #0B2545; margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">Password Reset Request</h2>
            
            <p style="color: #334155; line-height: 1.6; margin-bottom: 18px; font-size: 14.5px;">
              Dear <strong>${adminName}</strong>,
            </p>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 22px; font-size: 14px;">
              We received a request to reset your password for the Attendance Management System. If you didn't make this request, you can safely ignore this email.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; padding: 13px 34px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);">
                Reset Password →
              </a>
            </div>
            
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-left: 4px solid #F59E0B; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400E; margin: 0; font-size: 13px; line-height: 1.5;">
                <strong>⏱ Notice:</strong> This link will expire in 1 hour for security reasons.
              </p>
            </div>
            
            <p style="color: #94A3B8; font-size: 12.5px; margin-top: 26px; border-top: 1px solid #E2E8F0; padding-top: 18px; line-height: 1.5;">
              If you have any questions or need assistance, please contact the system administrator.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #64748B; font-size: 12px; line-height: 1.6;">
            <p style="margin: 0 0 4px 0; font-weight: 600; color: #475569;">© 2026 Kongu Engineering College. All rights reserved.</p>
            <p style="margin: 0 0 4px 0;">Perundurai Erode - 638060 Tamilnadu India</p>
            <p style="margin: 0; color: #94A3B8; font-size: 11.5px;">(Autonomous) · Transform Yourself</p>
          </div>
        </div>
      `
    };
  },

  csvReportEmail: (subject, csvContent, fileName, reportType, reportData) => {
    const currentDate = new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const rowsCount = reportData.rows ? reportData.rows.length : (reportData.totalRecords || 0);
    const totalRecords = rowsCount || 'N/A';
    const className = reportData.className || '';
    const section = reportData.section || '';
    const date = reportData.date || '';
    const startDate = reportData.startDate || '';
    const endDate = reportData.endDate || '';
    const studentName = reportData.studentName || '';
    const dashboardUrl = process.env.FRONTEND_URL || 'https://kec-student-attendance.vercel.app';

    // Tailor label & titles based on report type
    let recordsLabel = 'records';
    let reportTypeTitle = 'Attendance Report';

    if (reportType === 'student') {
      recordsLabel = totalRecords === 1 ? 'period' : 'periods';
      reportTypeTitle = 'Student Attendance Report';
    } else if (reportType === 'daily') {
      recordsLabel = totalRecords === 1 ? 'student' : 'students';
      reportTypeTitle = 'Daily Attendance Report';
    } else if (reportType === 'range') {
      recordsLabel = totalRecords === 1 ? 'student' : 'students';
      reportTypeTitle = 'Date Range Attendance Report';
    }

    let dynamicRows = '';
    if (studentName) {
      dynamicRows += `
        <tr>
          <td style="padding: 7px 0; color: #64748B; font-size: 13.5px; font-weight: 600; width: 36%;">👤 Student:</td>
          <td style="padding: 7px 0; color: #0F172A; font-size: 14px; font-weight: 700;">${studentName}</td>
        </tr>`;
    }
    if (className) {
      dynamicRows += `
        <tr>
          <td style="padding: 7px 0; color: #64748B; font-size: 13.5px; font-weight: 600; width: 36%;">🏫 Class:</td>
          <td style="padding: 7px 0; color: #0F172A; font-size: 13.5px; font-weight: 600;">${className}</td>
        </tr>`;
    }
    if (section) {
      dynamicRows += `
        <tr>
          <td style="padding: 7px 0; color: #64748B; font-size: 13.5px; font-weight: 600; width: 36%;">📚 Section:</td>
          <td style="padding: 7px 0; color: #0F172A; font-size: 13.5px; font-weight: 600;">Section ${section}</td>
        </tr>`;
    }
    if (date) {
      dynamicRows += `
        <tr>
          <td style="padding: 7px 0; color: #64748B; font-size: 13.5px; font-weight: 600; width: 36%;">📅 Date:</td>
          <td style="padding: 7px 0; color: #0F172A; font-size: 13.5px; font-weight: 600;">${date}</td>
        </tr>`;
    }
    if (startDate && endDate) {
      dynamicRows += `
        <tr>
          <td style="padding: 7px 0; color: #64748B; font-size: 13.5px; font-weight: 600; width: 36%;">📅 Period:</td>
          <td style="padding: 7px 0; color: #0F172A; font-size: 13.5px; font-weight: 600;">${startDate} to ${endDate}</td>
        </tr>`;
    }

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px 12px; background-color: #f1f5f9; -webkit-font-smoothing: antialiased;">
        <!-- Header Banner (KEC Institutional Navy Gradient) -->
        <div style="background: linear-gradient(135deg, #0B2545 0%, #134074 100%); padding: 32px 28px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase;">KONGU ENGINEERING COLLEGE</h1>
          <div style="margin: 10px 0 6px 0;">
            <span style="display: inline-block; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25); color: #72BE44; font-weight: 700; font-size: 12px; padding: 3px 12px; border-radius: 20px; letter-spacing: 0.5px;">
              (Autonomous) · Transform Yourself
            </span>
          </div>
          <p style="color: #93C5FD; margin: 4px 0 0 0; font-size: 13px; font-weight: 500;">Student Attendance & Academic Management System</p>
        </div>
        
        <!-- Main Card Body -->
        <div style="background: #ffffff; padding: 32px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 6px 20px rgba(11, 37, 69, 0.07); border: 1px solid #e2e8f0; border-top: none;">
          <!-- Status Badge -->
          <div style="margin-bottom: 14px;">
            <span style="display: inline-block; background: #DCFCE7; border: 1px solid #BBF7D0; color: #15803D; font-size: 11.5px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
              ✓ Report Generated Successfully
            </span>
          </div>

          <h2 style="color: #0B2545; margin: 0 0 14px 0; font-size: 20px; font-weight: 700;">${reportTypeTitle}</h2>
          
          <p style="color: #475569; line-height: 1.6; margin: 0 0 22px 0; font-size: 14.5px;">
            Your attendance report has been generated successfully and is attached to this email. The report contains detailed attendance information for your selected criteria.
          </p>
          
          <!-- Parameters Card -->
          <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <div style="border-bottom: 1.5px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 14px;">
              <strong style="color: #0B2545; font-size: 14.5px; letter-spacing: 0.2px;">📋 Report Details:</strong>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 7px 0; color: #64748B; font-size: 13.5px; font-weight: 600; width: 36%;">📄 Report Type:</td>
                <td style="padding: 7px 0; color: #0F172A; font-size: 13.5px; font-weight: 700;">${reportTypeTitle}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748B; font-size: 13.5px; font-weight: 600; width: 36%;">📁 File Name:</td>
                <td style="padding: 7px 0; color: #008FD5; font-size: 13px; font-weight: 700; font-family: monospace;">${fileName}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748B; font-size: 13.5px; font-weight: 600; width: 36%;">📅 Generated On:</td>
                <td style="padding: 7px 0; color: #0F172A; font-size: 13.5px; font-weight: 600;">${currentDate}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748B; font-size: 13.5px; font-weight: 600; width: 36%;">📊 Total Records:</td>
                <td style="padding: 7px 0; color: #0F172A; font-size: 13.5px; font-weight: 700;">
                  <span style="background: #E0F2FE; color: #0369A1; padding: 3px 10px; border-radius: 8px; font-size: 13px;">
                    ${totalRecords} ${recordsLabel}
                  </span>
                </td>
              </tr>
              ${dynamicRows}
            </table>
          </div>
          
          <!-- Features Box -->
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-left: 4px solid #72BE44; border-radius: 8px; padding: 16px 20px; margin: 22px 0;">
            <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 14px; font-weight: 700;">📈 Report Features:</h4>
            <ul style="color: #334155; margin: 0; padding-left: 20px; font-size: 13.5px; line-height: 1.7;">
              <li>Detailed period-wise attendance status</li>
              <li>Student-wise attendance statistics</li>
              <li>Attendance percentage calculations</li>
              <li>Exportable CSV format for analysis</li>
            </ul>
          </div>
          
          <p style="color: #475569; line-height: 1.6; margin: 20px 0; font-size: 14px;">
            <strong style="color: #0B2545;">📎 Attachment:</strong> The CSV file contains detailed attendance information that you can open in Excel, Google Sheets, or any spreadsheet application for further analysis.
          </p>
          
          <!-- Action Button -->
          <div style="text-align: center; margin: 28px 0;">
            <a href="${dashboardUrl}" 
               style="background: linear-gradient(135deg, #008FD5 0%, #0B2545 100%); color: #ffffff; padding: 13px 34px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(0, 143, 213, 0.3);">
              Access Dashboard →
            </a>
          </div>
          
          <!-- Tip Box -->
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-left: 4px solid #008FD5; padding: 14px 18px; border-radius: 8px; margin: 22px 0;">
            <p style="color: #1E40AF; margin: 0; font-size: 13px; line-height: 1.5;">
              <strong>💡 Tip:</strong> You can use this report for attendance analysis, parent communication, and academic planning.
            </p>
          </div>
          
          <p style="color: #94A3B8; font-size: 12.5px; margin-top: 26px; border-top: 1px solid #E2E8F0; padding-top: 18px; line-height: 1.5;">
            If you have any questions about this report or need assistance, please contact the system administrator.
          </p>
        </div>
        
        <!-- Institutional Footer -->
        <div style="text-align: center; margin-top: 20px; color: #64748B; font-size: 12px; line-height: 1.6;">
          <p style="margin: 0 0 4px 0; font-weight: 600; color: #475569;">© 2026 Kongu Engineering College. All rights reserved.</p>
          <p style="margin: 0 0 4px 0;">Perundurai Erode - 638060 Tamilnadu India</p>
          <p style="margin: 0; color: #94A3B8; font-size: 11.5px;">(Autonomous) · Transform Yourself</p>
        </div>
      </div>
    `;

    return {
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: fileName,
          content: csvContent,
          contentType: 'text/csv'
        }
      ]
    };
  }
};

// Send email via Brevo (Sendinblue) HTTP API (Port 443 - Bypasses Render blocked SMTP ports)
const sendViaBrevo = async (to, emailContent) => {
  const apiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || 'kiruthikbairavan13@gmail.com';
  const senderName = process.env.EMAIL_SENDER_NAME || 'Kongu Engineering College';

  console.log(`🌐 [Brevo API] Sending email to ${to} via HTTPS (Port 443)...`);

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: [
      { email: to }
    ],
    subject: emailContent.subject,
    htmlContent: emailContent.html
  };

  if (emailContent.attachments && emailContent.attachments.length > 0) {
    payload.attachment = emailContent.attachments.map(att => ({
      name: att.filename || 'attendance_report.csv',
      content: Buffer.isBuffer(att.content)
        ? att.content.toString('base64')
        : Buffer.from(String(att.content), 'utf-8').toString('base64')
    }));
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Brevo API HTTP ${response.status}`;
    console.error('❌ [Brevo API] Error sending email:', errorMsg);
    throw new Error(errorMsg);
  }

  console.log('✅ [Brevo API] Email sent successfully! MessageId:', data.messageId);
  return {
    success: true,
    messageId: data.messageId,
    provider: 'brevo'
  };
};

// Send email via Resend HTTP API (Port 443)
const sendViaResend = async (to, emailContent) => {
  const apiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const senderName = process.env.EMAIL_SENDER_NAME || 'Kongu Engineering College';

  console.log(`🌐 [Resend API] Sending email to ${to} via HTTPS (Port 443)...`);

  const payload = {
    from: `${senderName} <${senderEmail}>`,
    to: [to],
    subject: emailContent.subject,
    html: emailContent.html
  };

  if (emailContent.attachments && emailContent.attachments.length > 0) {
    payload.attachments = emailContent.attachments.map(att => ({
      filename: att.filename || 'attendance_report.csv',
      content: Buffer.isBuffer(att.content)
        ? att.content.toString('base64')
        : Buffer.from(String(att.content), 'utf-8').toString('base64')
    }));
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Resend API HTTP ${response.status}`;
    console.error('❌ [Resend API] Error sending email:', errorMsg);
    throw new Error(errorMsg);
  }

  console.log('✅ [Resend API] Email sent successfully! ID:', data.id);
  return {
    success: true,
    messageId: data.id,
    provider: 'resend'
  };
};

// Send email via Nodemailer SMTP (Default for localhost development)
const sendViaSmtp = async (mailOptions) => {
  const isRender = !!(process.env.RENDER || process.env.IS_RENDER);
  const timeoutMs = 12000; // 12-second timeout to fail fast
  const ports = [587, 465];
  let lastError = null;

  for (const port of ports) {
    try {
      const usePort587 = port === 587;
      console.log(`📧 Attempting to send email using SMTP port ${port}...`);
      const transporter = createTransporter(usePort587);

      const info = await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`SMTP timeout after ${timeoutMs / 1000}s on port ${port}`)), timeoutMs)
        )
      ]);

      console.log('✅ ===== Email Sent Successfully via SMTP =====');
      console.log('✅ Port used:', port);
      console.log('✅ Message ID:', info.messageId);

      if (transporter.close) {
        transporter.close();
      }

      return { success: true, messageId: info.messageId, response: info.response, port: port, provider: 'smtp' };
    } catch (error) {
      lastError = error;
      console.log(`⚠️ Failed with port ${port}, error:`, error.message);

      // Render blocks all outbound SMTP ports (25, 465, 587)
      if (isRender) {
        break;
      }

      if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED' || error.message.includes('timeout')) {
        if (port === 587) {
          console.log('🔄 Retrying with port 465 (SSL)...');
          continue;
        }
      }
      break;
    }
  }

  if (isRender || lastError?.message?.includes('timeout') || lastError?.code === 'ETIMEDOUT') {
    const helpfulMsg = 'Render free tier blocks SMTP ports 25, 465, & 587. Please add BREVO_API_KEY to Render Environment Variables (free 300 emails/day at brevo.com) to send emails via HTTPS.';
    console.error('❌ ' + helpfulMsg);
    throw new Error(helpfulMsg);
  }

  throw lastError || new Error('All email ports failed');
};

// Main send email function
const sendEmail = async (to, template, data = []) => {
  try {
    console.log('📧 ===== Email Sending Process Started =====');
    console.log('📧 To:', to);
    console.log('📧 Template:', template);

    // Check if template exists
    if (!emailTemplates[template]) {
      console.error('❌ Email template not found:', template);
      return { success: false, error: `Template '${template}' not found` };
    }

    // Generate email content from template
    console.log('📧 Generating email content from template...');
    const emailContent = emailTemplates[template](...data);

    if (!emailContent || !emailContent.subject || !emailContent.html) {
      console.error('❌ Invalid email content generated');
      return { success: false, error: 'Invalid email content' };
    }

    console.log('✅ Email content generated successfully');
    console.log('📧 Subject:', emailContent.subject);
    console.log('📧 Has attachments:', !!emailContent.attachments);

    // Method 1: Check for Brevo REST API Key (Recommended for Render)
    if (process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY) {
      return await sendViaBrevo(to, emailContent);
    }

    // Method 2: Check for Resend REST API Key
    if (process.env.RESEND_API_KEY) {
      return await sendViaResend(to, emailContent);
    }

    // Method 3: Fallback to Nodemailer SMTP (Works on localhost)
    console.log('📧 No REST API key configured. Using Nodemailer SMTP (Note: Render blocks outbound SMTP ports)...');
    const senderEmail = process.env.EMAIL_USER || 'kiruthikbairavan13@gmail.com';
    const mailOptions = {
      from: `"Kongu Engineering College" <${senderEmail}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    if (emailContent.attachments) {
      mailOptions.attachments = emailContent.attachments;
      console.log('📧 Attachments added:', emailContent.attachments.length);
    }

    return await sendViaSmtp(mailOptions);
  } catch (error) {
    console.error('❌ ===== Email Sending Failed =====');
    console.error('❌ Error message:', error.message);

    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

module.exports = {
  sendEmail,
  emailTemplates
}; 