import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Components
import Login from './components/Auth/Login';
import StudentLogin from './components/Auth/StudentLogin';
import AdminLogin from './components/Auth/AdminLogin';
import Register from './components/Auth/Register';
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

  // Determine default login redirect based on deployment role
  const defaultLoginPath =
    DEPLOY_ROLE === 'student'
      ? '/student-login'
      : DEPLOY_ROLE === 'admin'
      ? '/admin-login'
      : '/login';

  return (
    <div className="App">
      <Routes>
        {/* Dynamic Root Route */}
        <Route path="/" element={<Navigate to={defaultLoginPath} replace />} />

        {/* Public / Role-specific Login Routes */}
        {(DEPLOY_ROLE === 'student' || !DEPLOY_ROLE) && (
          <Route path="/student-login" element={<StudentLogin />} />
        )}

        {(DEPLOY_ROLE === 'admin' || !DEPLOY_ROLE) && (
          <Route path="/admin-login" element={<AdminLogin />} />
        )}

        {/* Generic Login / Register */}
        <Route
          path="/login"
          element={
            DEPLOY_ROLE === 'student' ? (
              <Navigate to="/student-login" replace />
            ) : DEPLOY_ROLE === 'admin' ? (
              <Navigate to="/admin-login" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes - Protected (hidden on student deployment) */}
        {DEPLOY_ROLE !== 'student' && (
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
        {DEPLOY_ROLE !== 'admin' && (
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
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        style={{
          fontSize: '15px',
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
