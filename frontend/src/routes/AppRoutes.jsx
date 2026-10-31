import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Skeleton } from '../components/common/Skeleton';

// Optimized Page Skeleton Fallback
const PageLoadingSkeleton = () => (
  <div className="space-y-5 p-2 animate-in fade-in duration-150">
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-10 w-48 rounded-2xl" />
      <Skeleton className="h-10 w-28 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
    </div>
    <Skeleton className="h-72 w-full rounded-3xl" />
  </div>
);

// Lazy Loaded Auth & Public Pages
const Login = lazy(() => import('../pages/auth/Login').then(m => ({ default: m.Login })));
const Unauthorized = lazy(() => import('../pages/Unauthorized').then(m => ({ default: m.Unauthorized })));
const NotFound = lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })));
const SemesterResults = lazy(() => import('../pages/results/SemesterResults').then(m => ({ default: m.SemesterResults })));

// Lazy Loaded Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ManageStudents = lazy(() => import('../pages/admin/ManageStudents').then(m => ({ default: m.ManageStudents })));
const ManageStaff = lazy(() => import('../pages/admin/ManageStaff').then(m => ({ default: m.ManageStaff })));
const ManageParents = lazy(() => import('../pages/admin/ManageParents').then(m => ({ default: m.ManageParents })));
const ManageSubjects = lazy(() => import('../pages/admin/ManageSubjects').then(m => ({ default: m.ManageSubjects })));
const LinkParentStudent = lazy(() => import('../pages/admin/LinkParentStudent').then(m => ({ default: m.LinkParentStudent })));
const AllReports = lazy(() => import('../pages/admin/AllReports').then(m => ({ default: m.AllReports })));

// Lazy Loaded Staff Pages
const StaffDashboard = lazy(() => import('../pages/staff/StaffDashboard').then(m => ({ default: m.StaffDashboard })));
const UploadMarks = lazy(() => import('../pages/staff/UploadMarks').then(m => ({ default: m.UploadMarks })));
const EnterAttendance = lazy(() => import('../pages/staff/EnterAttendance').then(m => ({ default: m.EnterAttendance })));
const ClassReport = lazy(() => import('../pages/staff/ClassReport').then(m => ({ default: m.ClassReport })));
const StudentProgressCard = lazy(() => import('../pages/staff/StudentProgressCard').then(m => ({ default: m.StudentProgressCard })));

// Lazy Loaded Student Pages
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const MyProgressCard = lazy(() => import('../pages/student/MyProgressCard').then(m => ({ default: m.MyProgressCard })));
const MyAttendance = lazy(() => import('../pages/student/MyAttendance').then(m => ({ default: m.MyAttendance })));

// Lazy Loaded Parent Pages
const ParentDashboard = lazy(() => import('../pages/parent/ParentDashboard').then(m => ({ default: m.ParentDashboard })));
const ChildProgressCard = lazy(() => import('../pages/parent/ChildProgressCard').then(m => ({ default: m.ChildProgressCard })));
const ChildAttendance = lazy(() => import('../pages/parent/ChildAttendance').then(m => ({ default: m.ChildAttendance })));

// Lazy Loaded Shared Pages (Profile ID & Settings)
const Profile = lazy(() => import('../pages/profile/Profile').then(m => ({ default: m.Profile })));
const Settings = lazy(() => import('../pages/settings/Settings').then(m => ({ default: m.Settings })));

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
      <Route
        path="/login"
        element={
          <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/unauthorized"
        element={
          <Suspense fallback={null}>
            <Unauthorized />
          </Suspense>
        }
      />

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
            path="/parent/attendance"
            element={
              <ProtectedRoute allowedRoles={['PARENT']}>
                <ChildAttendance />
              </ProtectedRoute>
            }
          />

          {/* User Profile & Credentials across all 4 portals (3D card auto-restricted to Faculty & Students inside) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'STUDENT', 'PARENT']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/results" element={<SemesterResults />} />
        </Route>

        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
  );
};

export default AppRoutes;
