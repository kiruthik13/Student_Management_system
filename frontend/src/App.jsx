import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Components
import Login from './components/Auth/Login';
import StudentLogin from './components/Auth/StudentLogin';
import AdminLogin from './components/Auth/AdminLogin';
import Register from './components/Auth/Register';
import StudentRegister from './components/Auth/StudentRegister';
import AdminRegister from './components/Auth/AdminRegister';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Admin Components
import AdminDashboard from './components/Dashboard/AdminDashboard';

// Student Components
import StudentDashboard from './components/Student/StudentDashboard';
import StudentAttendance from './components/Student/StudentAttendance';
import StudentMarks from './components/Student/StudentMarks';
import StudentProfile from './components/Student/StudentProfile';

import './App.css';

function App() {
  const DEPLOY_ROLE = import.meta.env.VITE_APP_ROLE;
  const isStudentHost = typeof window !== 'undefined' && window.location.hostname.includes('student');
  const isAdminHost = typeof window !== 'undefined' && window.location.hostname.includes('admin');
  const resolvedRole = DEPLOY_ROLE || (isStudentHost ? 'student' : isAdminHost ? 'admin' : null);

  // Determine default login redirect based on deployment role
  const defaultLoginPath =
    resolvedRole === 'student'
      ? '/student-login'
      : resolvedRole === 'admin'
      ? '/admin-login'
      : '/login';

  const defaultRegisterPath =
    resolvedRole === 'student'
      ? '/student-register'
      : resolvedRole === 'admin'
      ? '/admin-register'
      : '/register';

  return (
    <div className="App">
      <Routes>
        {/* Dynamic Root Route */}
        <Route path="/" element={<Navigate to={defaultLoginPath} replace />} />

        {/* Public / Role-specific Login Routes */}
        {(resolvedRole === 'student' || !resolvedRole) && (
          <Route path="/student-login" element={<StudentLogin />} />
        )}

        {(resolvedRole === 'admin' || !resolvedRole) && (
          <Route path="/admin-login" element={<AdminLogin />} />
        )}

        {/* Public / Role-specific Register Routes */}
        {(resolvedRole === 'student' || !resolvedRole) && (
          <Route path="/student-register" element={<StudentRegister />} />
        )}

        {(resolvedRole === 'admin' || !resolvedRole) && (
          <Route path="/admin-register" element={<AdminRegister />} />
        )}

        {/* Generic Login / Register */}
        <Route
          path="/login"
          element={
            resolvedRole === 'student' ? (
              <Navigate to="/student-login" replace />
            ) : resolvedRole === 'admin' ? (
              <Navigate to="/admin-login" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            resolvedRole === 'student' ? (
              <Navigate to="/student-register" replace />
            ) : resolvedRole === 'admin' ? (
              <Navigate to="/admin-register" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Admin Routes - Protected (hidden on student deployment) */}
        {resolvedRole !== 'student' && (
          <>
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* Student Routes - Protected (hidden on admin deployment) */}
        {resolvedRole !== 'admin' && (
          <>
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/marks"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentMarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/subjects"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentMarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={defaultLoginPath} replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        theme="light"
        limit={3}
        style={{
          fontSize: '14px',
          fontWeight: '500',
        }}
      />
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
