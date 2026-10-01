# 🏛️ Kongu Engineering College — Student Attendance & Academic Management System (Backend)

An institutional-grade Node.js and Express.js RESTful API powering the Student Attendance & Academic Management System for **Kongu Engineering College (Autonomous)**. Built with MongoDB, JWT authentication, Nodemailer, and comprehensive reporting pipelines.

---

## 🌟 Key Modules & Capabilities

### 1. 👥 Student Lifecycle & Profile Management
- **Full Student Directory:** Complete CRUD operations with search, filtering by class, section, roll number, and semester.
- **Extended Semester Architecture:** Built-in support for **Semester 1 through Semester 10** (accommodating 5-year integrated programs like MSc SS at KEC).
- **Student Profile Self-Service:** Secure portal endpoint allowing students to update their contact coordinates (`phoneNumber`, `parentName`, `parentPhone`, `address`, `academicYear`, and `semester`).
- **Batch CSV Import & Export:** Bulk ingest student records with automatic validation and export student registries.

### 2. 📋 Period-Wise Attendance Engine
- **Period Tracking (P1 to P7):** Granular period-by-period tracking adhering to official KEC time slots (8:45 AM to 4:15 PM).
- **Status Classification:** `Present`, `Absent`, `Late`, and `Half-Day` calculation with period remarks.
- **Daily Attendance Reports:** Full class/section period grids with attendance rates and day statuses.
- **Date Range & Longitudinal Reports:** Aggregated attendance statistics, percentage calculations, and minimum requirement checks (≥75% criteria).
- **Automated Email Dispatch:** Generates formatted CSV attachments and delivers institutional email notifications to faculty and parents.

### 3. 📚 Subject & Curriculum Management
- **Semester Association:** Every subject is classified with an assigned semester (`Semester 1` – `Semester 10`), subject code, name, and maximum marks.
- **Curriculum Filtering:** Fast queries to filter subjects by semester for mark entry, syllabus records, and student dashboards.

### 4. 📊 Continuous Assessment & Marks System
- **Comprehensive Exam Types:** Continuous Assessment Tests (CAT), `Internal 1`, `Internal 2`, `Assignment`, and `Semester` examinations.
- **Bulk Mark Entry:** High-efficiency batch submission endpoint for entering marks across an entire section.
- **Consolidated Marks View:** Computes total scores, percentages, and grade classifications (`O`, `A+`, `A`, `B+`, `B`, `RA`).
- **Student Marks Portal:** Authenticated student access to view continuous evaluation and download PDF grade sheets.

### 5. 📧 Institutional Email Engine
- **Nodemailer SMTP Delivery:** Robust Gmail integration with automatic port failover (587 STARTTLS / 465 SSL).
- **Dynamic Report Sizing:** Context-aware records labeling (`X periods` for student reports, `X students` for daily/range reports).
- **KEC Institutional Branding:** Responsive HTML email templates aligned with KEC navy-teal brand identity, NAAC accreditation notices, and direct dashboard access links.

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js (v18+) | Server-side JavaScript runtime |
| **Framework** | Express.js 4.x | Fast, unopinionated REST API framework |
| **Database** | MongoDB | Document database for unstructured & structured records |
| **ODM** | Mongoose 8.x | Schema modeling, hooks, and relationships |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | Stateless token-based auth |
| **Security** | `bcryptjs` | Salted password hashing (12 rounds) |
| **Email Service** | `nodemailer` | SMTP transport for reports and security alerts |
| **Validation** | `express-validator` | Request sanitization and input validation |
| **Utilities** | `cors`, `dotenv` | Cross-origin headers and configuration management |

---

## 🗄️ Database Models

### `Student` Model
```javascript
{
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  rollNumber: { type: String, required: true, unique: true, trim: true },
  className: { type: String, required: true, trim: true },
  section: { type: String, required: true, trim: true },
  semester: { type: String, default: 'Semester 4' }, // 'Semester 1' to 'Semester 10'
  academicYear: { type: String, trim: true },         // e.g. "2022 - 2026"
  phoneNumber: { type: String, match: /^[0-9]{10}$/ },
  parentName: { type: String, trim: true },
  parentPhone: { type: String, match: /^[0-9]{10}$/ },
  address: { type: String, trim: true },
  createdAt: Date,
  updatedAt: Date
}
```

### `Subject` Model
```javascript
{
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  semester: { type: String, default: 'Semester 1', trim: true }, // 'Semester 1' to 'Semester 10'
  maxMarks: { type: Number, required: true, default: 100 },
  createdAt: Date,
  updatedAt: Date
}
```

### `Attendance` Model
```javascript
{
  studentId: { type: ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  period1: { type: String, enum: ['Present', 'Absent', 'Late', 'Half-day', 'not-marked'] },
  period2: { type: String, enum: ['Present', 'Absent', 'Late', 'Half-day', 'not-marked'] },
  // ... period3 through period7
  remarks: { type: String, trim: true },
  markedBy: { type: ObjectId, ref: 'Admin' }
}
```

### `Mark` Model
```javascript
{
  studentId: { type: ObjectId, ref: 'Student', required: true },
  subjectId: { type: ObjectId, ref: 'Subject', required: true },
  examType: { type: String, enum: ['Internal 1', 'Internal 2', 'Assignment', 'Semester'] },
  marksObtained: { type: Number, required: true, min: 0 },
  maxMarks: { type: Number, required: true },
  term: { type: String, default: 'Current' },
  academicYear: { type: String }
}
```

### `Admin` Model
```javascript
{
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}
```

---

## 📡 REST API Reference

### 🔐 Admin Authentication (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/admin/register` | Register new administrator | No |
| `POST` | `/api/admin/login` | Authenticate admin & receive JWT | No |
| `GET` | `/api/admin/verify-token` | Verify session token validity | Yes |
| `GET` | `/api/admin/profile` | Retrieve admin profile | Yes |
| `PUT` | `/api/admin/profile` | Update profile information | Yes |
| `PUT` | `/api/admin/change-password` | Change login password | Yes |

### 👨‍🎓 Student Management (`/api/students`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/students` | Get paginated students with filters | Yes |
| `POST` | `/api/students` | Create new student record | Yes |
| `GET` | `/api/students/:id` | Get student details by ID | Yes |
| `PUT` | `/api/students/:id` | Update student record | Yes |
| `DELETE` | `/api/students/:id` | Delete student record | Yes |
| `GET` | `/api/students/classes` | Get distinct classes list | Yes |
| `GET` | `/api/students/sections` | Get distinct sections list | Yes |
| `GET` | `/api/students/profile` | **Student Portal:** Get student's own profile | Student Token |
| `PUT` | `/api/students/profile` | **Student Portal:** Self-service profile edit | Student Token |
| `GET` | `/api/students/marks` | **Student Portal:** Get student's assessment marks | Student Token |
| `GET` | `/api/students/attendance` | **Student Portal:** Get student's attendance records | Student Token |

### 📅 Attendance Records & Reporting (`/api/attendance`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/attendance/mark` | Mark single student period attendance | Yes |
| `POST` | `/api/attendance/mark-bulk` | Mark attendance for entire class/period | Yes |
| `GET` | `/api/attendance/daily-report` | Daily attendance matrix (P1–P7) | Yes |
| `GET` | `/api/attendance/range-report` | Longitudinal attendance for a date range | Yes |
| `GET` | `/api/attendance/student-report` | Individual student period breakdown | Yes |
| `POST` | `/api/attendance/send-report-email` | Compile & email CSV report attachment | Yes |

### 📖 Subject Management (`/api/subjects`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/subjects` | List all subjects (supports `?semester=Semester+3`) | Yes |
| `POST` | `/api/subjects` | Add new subject with code, semester, maxMarks | Yes |
| `PUT` | `/api/subjects/:id` | Update subject details | Yes |
| `DELETE` | `/api/subjects/:id` | Delete subject | Yes |

### 📝 Marks & Assessment (`/api/marks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/marks` | Query marks by class, subject, examType, term | Yes |
| `POST` | `/api/marks` | Save or update single mark entry | Yes |
| `POST` | `/api/marks/bulk` | Bulk save assessment marks for a class | Yes |
| `GET` | `/api/marks/consolidated` | Get consolidated performance matrix | Yes |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI
- **npm** or **yarn**

### 1. Environment Configuration
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/attendance_db?retryWrites=true&w=majority
JWT_SECRET=your-secure-production-jwt-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
FRONTEND_URL=http://localhost:5173

# Nodemailer / Gmail SMTP Configuration
EMAIL_USER=your-institutional-email@gmail.com
EMAIL_PASSWORD=your-google-app-password
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The server will boot with nodemon on `http://localhost:5000`.

### 4. Run Production Server
```bash
npm start
```

---

## 🏛️ About Kongu Engineering College
**Kongu Engineering College (Autonomous)**  
Perundurai, Erode - 638060, Tamil Nadu, India  
*Affiliated to Anna University · Accredited by NAAC with 'A++' Grade*  
*"Transform Yourself for a Better Tomorrow"*