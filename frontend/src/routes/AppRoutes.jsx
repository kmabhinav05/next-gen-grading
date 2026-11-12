import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Skeleton } from '../components/common/Skeleton';

const lazyNamed = (importer, exportName) =>
  lazy(() => importer().then((mod) => ({ default: mod[exportName] || mod.default })));

// Route-split page chunks so heavy dependencies (Three.js, PDF/Excel reports) load on demand
const Login = lazyNamed(() => import('../pages/auth/Login'), 'Login');
const Unauthorized = lazyNamed(() => import('../pages/Unauthorized'), 'Unauthorized');
const NotFound = lazyNamed(() => import('../pages/NotFound'), 'NotFound');
const SemesterResults = lazyNamed(() => import('../pages/results/SemesterResults'), 'SemesterResults');

// Admin Pages
const AdminDashboard = lazyNamed(() => import('../pages/admin/AdminDashboard'), 'AdminDashboard');
const ManageStudents = lazyNamed(() => import('../pages/admin/ManageStudents'), 'ManageStudents');
const ManageStaff = lazyNamed(() => import('../pages/admin/ManageStaff'), 'ManageStaff');
const ManageParents = lazyNamed(() => import('../pages/admin/ManageParents'), 'ManageParents');
const ManageSubjects = lazyNamed(() => import('../pages/admin/ManageSubjects'), 'ManageSubjects');
const LinkParentStudent = lazyNamed(() => import('../pages/admin/LinkParentStudent'), 'LinkParentStudent');
const AllReports = lazyNamed(() => import('../pages/admin/AllReports'), 'AllReports');

// Staff Pages
const StaffDashboard = lazyNamed(() => import('../pages/staff/StaffDashboard'), 'StaffDashboard');
const UploadMarks = lazyNamed(() => import('../pages/staff/UploadMarks'), 'UploadMarks');
const EnterAttendance = lazyNamed(() => import('../pages/staff/EnterAttendance'), 'EnterAttendance');
const ClassReport = lazyNamed(() => import('../pages/staff/ClassReport'), 'ClassReport');
const StudentProgressCard = lazyNamed(() => import('../pages/staff/StudentProgressCard'), 'StudentProgressCard');

// Student Pages
const StudentDashboard = lazyNamed(() => import('../pages/student/StudentDashboard'), 'StudentDashboard');
const MyProgressCard = lazyNamed(() => import('../pages/student/MyProgressCard'), 'MyProgressCard');
const MyAttendance = lazyNamed(() => import('../pages/student/MyAttendance'), 'MyAttendance');
const StudentResources = lazyNamed(() => import('../pages/student/StudentResources'), 'StudentResources');

// Parent Pages
const ParentDashboard = lazyNamed(() => import('../pages/parent/ParentDashboard'), 'ParentDashboard');
const ChildProgressCard = lazyNamed(() => import('../pages/parent/ChildProgressCard'), 'ChildProgressCard');
const ChildAttendance = lazyNamed(() => import('../pages/parent/ChildAttendance'), 'ChildAttendance');

// Profile & Settings
const Profile = lazyNamed(() => import('../pages/profile/Profile'), 'Profile');
const Settings = lazyNamed(() => import('../pages/settings/Settings'), 'Settings');

const RouteFallback = () => (
  <div className="space-y-4 py-4">
    <Skeleton className="h-16 rounded-3xl" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Skeleton className="h-56 rounded-3xl" count={4} />
    </div>
  </div>
);

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
    <Suspense fallback={<RouteFallback />}>
      <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* App Workspace Layout (Maintains persistent outer shell & navbar without flickering) */}
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
        <Route
          path="/student/resources"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentResources />
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

        {/* View Profile & 3D Physics Lanyard ID Badge (All 4 Portals) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'STUDENT', 'PARENT']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Settings & System Preferences (All 4 Portals) */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'STUDENT', 'PARENT']}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
