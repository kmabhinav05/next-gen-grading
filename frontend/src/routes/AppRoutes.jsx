import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Unauthorized } from '../pages/Unauthorized';
import { NotFound } from '../pages/NotFound';
import { SemesterResults } from '../pages/results/SemesterResults';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ManageStudents } from '../pages/admin/ManageStudents';
import { ManageStaff } from '../pages/admin/ManageStaff';
import { ManageParents } from '../pages/admin/ManageParents';
import { ManageSubjects } from '../pages/admin/ManageSubjects';
import { LinkParentStudent } from '../pages/admin/LinkParentStudent';
import { AllReports } from '../pages/admin/AllReports';

// Staff Pages
import { StaffDashboard } from '../pages/staff/StaffDashboard';
import { UploadMarks } from '../pages/staff/UploadMarks';
import { EnterAttendance } from '../pages/staff/EnterAttendance';
import { ClassReport } from '../pages/staff/ClassReport';
import { StudentProgressCard } from '../pages/staff/StudentProgressCard';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { MyProgressCard } from '../pages/student/MyProgressCard';
import { MyAttendance } from '../pages/student/MyAttendance';

// Parent Pages
import { ParentDashboard } from '../pages/parent/ParentDashboard';
import { ChildProgressCard } from '../pages/parent/ChildProgressCard';
import { ChildAttendance } from '../pages/parent/ChildAttendance';

// Root redirect handler
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'STAFF':
      return <Navigate to="/staff/dashboard" replace />;
    case 'STUDENT':
      return <Navigate to="/student/dashboard" replace />;
    case 'PARENT':
      return <Navigate to="/parent/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* App Workspace Layout */}
      <Route element={<DashboardLayout />}>
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parents"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageParents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parent-student"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <LinkParentStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AllReports />
            </ProtectedRoute>
          }
        />

        {/* Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/upload-marks"
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <UploadMarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/attendance"
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <EnterAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/class-report"
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <ClassReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/student-card/:studentId"
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <StudentProgressCard />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/progress-card"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyProgressCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyAttendance />
            </ProtectedRoute>
          }
        />

        {/* Parent Routes */}
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/progress-card"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ChildProgressCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/child-progress-card"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ChildProgressCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/attendance"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ChildAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/child-attendance"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ChildAttendance />
            </ProtectedRoute>
          }
        />

        {/* Future COE Results Module */}
        <Route
          path="/results"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'STUDENT', 'PARENT']}>
              <SemesterResults />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
