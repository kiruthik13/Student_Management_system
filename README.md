# 🏛️ Kongu Engineering College — Student Attendance & Academic Management System

<div align="center">

![Kongu Engineering College](https://img.shields.io/badge/KONGU%20ENGINEERING%20COLLEGE-(Autonomous)-0B2545?style=for-the-badge)
![Accreditation](https://img.shields.io/badge/NAAC-A%2B%2B%20Accredited-72BE44?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-008FD5?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**An institutional web platform for daily period-by-period attendance tracking, student continuous assessment (CAT), curriculum semester management, and automated email reporting.**

*(Autonomous) · Transform Yourself*

</div>

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
  - [1. Student Portal & Self-Service Profile](#1-student-portal--self-service-profile)
  - [2. Period-Wise Attendance Engine (P1 to P7)](#2-period-wise-attendance-engine-p1-to-p7)
  - [3. Continuous Assessment & Marks Evaluation](#3-continuous-assessment--marks-evaluation)
  - [4. Subject & Curriculum Management (Semesters 1 to 10)](#4-subject--curriculum-management-semesters-1-to-10)
  - [5. Automated Reporting & Email Dispatch](#5-automated-reporting--email-dispatch)
- [Technology Stack](#-technology-stack)
- [Architecture & Workflow](#-architecture--workflow)
- [Project Directory Structure](#-project-directory-structure)
- [Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Environment Configuration](#-environment-configuration)
- [API Reference Summary](#-api-reference-summary)
- [Institutional Identity](#-institutional-identity)

---

## 🏫 Project Overview

The **KEC Student Attendance & Academic Management System** is a full-stack, enterprise-grade educational platform built to modernize daily campus operations at Kongu Engineering College. It bridges the gap between faculty administrative workflows and student transparency, providing real-time attendance statistics, assessment grades, semester records, and automated CSV/PDF reporting pipelines.

---

## 🌟 Key Features

### 1. 👨‍🎓 Student Portal & Self-Service Profile
- **Personalized Student Dashboard:** Welcome banner featuring actual KEC campus imagery, motivational college motto, and immediate KPIs.
- **Contact Details Self-Service:** Students can directly view and edit their own and guardian coordinates:
  - Student Phone Number
  - Parent / Guardian Name
  - Parent Phone Number
  - Residential Address
  - Academic Year / Batch (e.g., `2022 - 2026`)
  - Current Semester (`Semester 1` through `Semester 10`)
- **Direct Action Badges:** Interactive "+ Add" shortcuts for quickly updating missing profile fields.

### 2. ⏱️ Period-Wise Attendance Engine (P1 to P7)
- **Granular Period Tracking:** Records attendance for all 7 standard KEC instructional periods:
  - **P1:** `8:45 – 9:35 AM`
  - **P2:** `9:35 – 10:25 AM`
  - **P3:** `10:45 – 11:35 AM`
  - **P4:** `11:35 AM – 12:25 PM`
  - **P5:** `1:25 – 2:15 PM`
  - **P6:** `2:15 – 3:05 PM`
  - **P7:** `3:25 – 4:15 PM`
- **Flexible Status Types:** `Present`, `Absent`, `Late`, `Half-Day`, and period-level remarks.
- **Instant Calculations:** Automated calculation of scheduled hours, attended hours, day status, and percentage compliance.

### 3. 📝 Continuous Assessment & Marks Evaluation
- **Multiple Assessment Categories:** Continuous Assessment Tests (CAT), `Internal 1`, `Internal 2`, `Assignment`, and `Semester` final exams.
- **Bulk Marks Entry:** Streamlined tabular grid for faculty to input marks for entire classes rapidly.
- **Consolidated Marks View:** Matrix view displaying marks across all subjects, overall score, percentage, and Anna University grade classifications (`O`, `A+`, `A`, `B+`, `B`, `RA`).
- **PDF Report Download:** One-click generation of professional student academic grade sheets.

### 4. 📚 Subject & Curriculum Management (Semesters 1 to 10)
- **10-Semester Architecture:** Supports regular 4-year B.E./B.Tech programs and 5-year integrated post-graduate programs (e.g., MSc SS at KEC).
- **Subject Classification:** Every subject is tagged with subject code, subject title, maximum marks, and assigned semester.
- **Semester Filters:** Fast filtering by semester in subject catalogs, marks entry forms, and student portals.

### 5. 📧 Automated Reporting & Email Dispatch
- **Multi-Modal Reports:** Daily Class Reports, Date Range Reports, and Individual Student Longitudinal Reports.
- **Responsive Layout:** Clean multi-column filter card with dedicated action buttons bar (`Fetch Report`, `Export CSV`, `Send Email`).
- **Automated CSV Attachment:** Generates industry-standard `.csv` spreadsheets compatible with Excel and Google Sheets.
- **KEC Institutional Email Templates:** Professional HTML emails delivered via Gmail SMTP with dynamic record counts (`X periods` for students, `X students` for classes).

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Custom Vanilla CSS with KEC Design Tokens (Deep Navy `#0B2545`, KEC Blue `#008FD5`, KEC Green `#72BE44`)
- **Icons:** React Icons (FontAwesome)
- **PDF Generation:** jsPDF & html2canvas
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with salted `bcryptjs` password hashing
- **Email Service:** Nodemailer with Gmail SMTP and dual-port failover (587 / 465)
- **CSV Processing:** Custom CSV parser and generator

---

## 📁 Project Directory Structure

```
Student_Management_System/
├── backend/
│   ├── config/
│   │   ├── config.js               # Application configuration
│   │   ├── database.js             # MongoDB connection
│   │   └── email.js                # Nodemailer SMTP and KEC email templates
│   ├── controllers/
│   │   └── studentController.js    # Student business logic & profile update
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication middleware
│   │   └── validation.js           # Express-validator schemas
│   ├── models/
│   │   ├── Admin.js                # Admin user schema
│   │   ├── Attendance.js           # Period attendance schema (P1–P7)
│   │   ├── Mark.js                 # Assessment marks schema
│   │   ├── Student.js              # Student schema (Semesters 1–10, contact info)
│   │   └── Subject.js              # Subject schema (code, name, semester)
│   ├── routes/
│   │   ├── adminRoutes.js          # Admin auth & profile routes
│   │   ├── attendanceRoutes.js     # Marking, reports & email dispatch
│   │   ├── marksRoutes.js          # Mark entry & consolidated views
│   │   ├── studentRoutes.js        # Student directory & self-service
│   │   └── subjectRoutes.js        # Subject catalog management
│   ├── server.js                   # Express application entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Attendance/         # Attendance marking & report cards
│   │   │   ├── Marks/              # Subject management, marks entry & consolidated
│   │   │   ├── Student/            # Student dashboard, profile & marks views
│   │   │   ├── Students/           # Student directory & registration form
│   │   │   └── Common/             # KEC Loaders, navigation & headers
│   │   ├── config/                 # API endpoint constants
│   │   ├── utils/                  # API helpers & PDF generators
│   │   ├── App.jsx                 # Route declarations
│   │   ├── main.jsx                # React root mount
│   │   └── index.css               # Global CSS design system
│   ├── vite.config.js
│   └── package.json
│
└── README.md                       # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- Git

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/kiruthik13/Student_Management_system.git
cd Student_Management_system/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env # or create manually (see Environment Configuration)

# Start backend development server
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
# In a new terminal window
cd Student_Management_system/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/kec_attendance?retryWrites=true&w=majority
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
FRONTEND_URL=http://localhost:5173

# Email Reporting SMTP
EMAIL_USER=your-institutional-email@gmail.com
EMAIL_PASSWORD=your-google-app-password
```

---

## 📡 API Reference Summary

| Prefix | Resource | Description |
|---|---|---|
| `/api/admin` | Authentication | Register, login, profile, password reset |
| `/api/students` | Student Directory | Student CRUD, classes, sections, profile self-service |
| `/api/attendance` | Attendance Tracker | Mark P1–P7 attendance, daily & range reports, CSV email |
| `/api/subjects` | Curriculum | Subjects by semester (Sem 1 to 10), code, max marks |
| `/api/marks` | Academic Marks | Internal exams, CAT, bulk mark entry, consolidated view |

---

## 🏛️ Institutional Identity

**Kongu Engineering College (Autonomous)**  
Perundurai, Erode - 638060, Tamil Nadu, India  
*Affiliated to Anna University · Accredited by NAAC with 'A++' Grade*  
*"Transform Yourself for a Better Tomorrow"*  
© 2026 Kongu Engineering College. All rights reserved.
