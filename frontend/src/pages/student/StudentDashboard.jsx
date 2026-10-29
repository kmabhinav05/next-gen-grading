import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { StatCard } from '../../components/common/StatCard';
import { AttendanceBadge } from '../../components/common/AttendanceBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { GraduationCap, Award, ClipboardCheck, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-xl" count={4} />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const card = data?.progress_card;
  if (!card) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">No academic records found for this student account.</p>
      </div>
    );
  }

  const { student, subjects, summary } = card;

  // Chart 1: Subject Marks Bar Chart
  const marksChartData = {
    labels: subjects.map((s) => s.code),
    datasets: [
      {
        label: 'IA 1',
        data: subjects.map((s) => s.ia1 || 0),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      },
      {
        label: 'IA 2',
        data: subjects.map((s) => s.ia2 || 0),
        backgroundColor: '#6366f1',
        borderRadius: 6,
      },
      {
        label: 'Subject Average',
        data: subjects.map((s) => s.average || 0),
        backgroundColor: '#0ea5e9',
        borderRadius: 6,
      },
    ],
  };

  const marksChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
    },
    scales: {
      y: { max: 50, beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } },
    },
  };

  // Chart 2: Attendance Doughnut Chart
  const attendanceChartData = {
    labels: ['Classes Attended', 'Classes Missed'],
    datasets: [
      {
        data: [
          summary.total_classes_attended,
          Math.max(0, summary.total_classes_held - summary.total_classes_attended),
        ],
        backgroundColor: ['#10b981', '#f43f5e'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-primary-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-primary-200 uppercase tracking-wide">
            Semester {student.semester} - Section {student.section}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-2">
            Hello, {student.name}!
          </h1>
          <p className="text-xs text-primary-200 mt-1">
            Register No: <span className="font-mono font-semibold">{student.reg_no}</span> • {student.department}
          </p>
        </div>

        <Link
          to="/student/progress-card"
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-primary-900 hover:bg-primary-50 rounded-xl text-xs font-bold transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-primary-600" />
          <span>View My Digital Progress Card</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cumulative Marks"
          value={`${summary.overall_marks_percentage}%`}
          subtitle={`${summary.total_scored} of ${summary.total_max} max marks`}
          icon={Award}
          color="blue"
        />
        <StatCard
          title="Overall Attendance"
          value={`${summary.overall_attendance_percentage}%`}
          subtitle={`${summary.total_classes_attended} of ${summary.total_classes_held} lectures`}
          icon={ClipboardCheck}
          color={summary.overall_attendance_status === 'CRITICAL' ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Enrolled Courses"
          value={subjects.length}
          subtitle={`Semester ${student.semester} curriculum`}
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          title="Attendance Status"
          value={summary.overall_attendance_status === 'CRITICAL' ? 'Shortage Alert' : 'Good Standing'}
          subtitle={summary.overall_attendance_status === 'CRITICAL' ? 'Below 75% requirement' : 'Eligible for PTM'}
          icon={AlertTriangle}
          color={summary.overall_attendance_status === 'CRITICAL' ? 'rose' : 'emerald'}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Internal Assessment Score Distribution</h3>
              <p className="text-xs text-slate-500">IA1, IA2 and average scored out of 50</p>
            </div>
          </div>
          <div className="h-64">
            <Bar data={marksChartData} options={marksChartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Attendance Ratio</h3>
            <p className="text-xs text-slate-500 mb-4">Lectures attended vs missed</p>
            <div className="h-48 relative flex items-center justify-center">
              <Doughnut data={attendanceChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } } }} />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <AttendanceBadge percentage={summary.overall_attendance_percentage} size="md" />
          </div>
        </div>
      </div>

      {/* Qualitative Remarks Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Faculty Counselor Assessment & Remarks</h3>
        <p className="text-xs text-slate-700 italic bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
          "{summary.remarks}"
        </p>
      </div>
    </div>
  );
};
