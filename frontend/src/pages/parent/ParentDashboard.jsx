import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/dashboard';
import { StatCard } from '../../components/common/StatCard';
import { AttendanceBadge } from '../../components/common/AttendanceBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { Award, ClipboardCheck, GraduationCap, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
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

export const ParentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

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

  const childrenCards = data?.children || [];
  if (childrenCards.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">No student wards are currently linked to this parent account.</p>
      </div>
    );
  }

  const currentCard = childrenCards[selectedChildIndex] || childrenCards[0];
  const { student, subjects, summary } = currentCard;

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

  const attendanceChartData = {
    labels: ['Lectures Attended', 'Lectures Missed'],
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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-amber-300 uppercase tracking-wide">
            Parent-Teacher Academic Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-2">
            Ward Performance: {student.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Register No: <span className="font-mono font-semibold">{student.reg_no}</span> • Semester {student.semester} (Sec {student.section})
          </p>
        </div>

        <Link
          to={`/parent/progress-card`}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>View Digital Progress Card</span>
        </Link>
      </div>

      {/* Multiple Wards Selector if parent has multiple children */}
      {childrenCards.length > 1 && (
        <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-600">Select Ward:</span>
          {childrenCards.map((c, idx) => (
            <button
              key={c.student.id}
              onClick={() => setSelectedChildIndex(idx)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                selectedChildIndex === idx ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.student.name} ({c.student.reg_no})
            </button>
          ))}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cumulative Marks"
          value={`${summary.overall_marks_percentage}%`}
          subtitle={`${summary.total_scored} of ${summary.total_max} marks`}
          icon={Award}
          color="blue"
        />
        <StatCard
          title="Overall Attendance"
          value={`${summary.overall_attendance_percentage}%`}
          subtitle={`${summary.total_classes_attended} / ${summary.total_classes_held} held`}
          icon={ClipboardCheck}
          color={summary.overall_attendance_status === 'CRITICAL' ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Course Count"
          value={subjects.length}
          subtitle="Registered subjects"
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          title="Attendance Standing"
          value={summary.overall_attendance_status === 'CRITICAL' ? 'Shortage Warning' : 'Normal'}
          subtitle={summary.overall_attendance_status === 'CRITICAL' ? 'Parent consultation required' : 'Meets 75% rule'}
          icon={AlertTriangle}
          color={summary.overall_attendance_status === 'CRITICAL' ? 'rose' : 'emerald'}
        />
      </div>

      {/* Visual Analytics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subject-wise Continuous Marks</h3>
              <p className="text-xs text-slate-500">Internal assessment marks scored out of 50</p>
            </div>
          </div>
          <div className="h-64">
            <Bar data={marksChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Ward Attendance Ratio</h3>
            <p className="text-xs text-slate-500 mb-4">Classes attended vs missed</p>
            <div className="h-48 relative flex items-center justify-center">
              <Doughnut data={attendanceChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <AttendanceBadge percentage={summary.overall_attendance_percentage} size="md" />
          </div>
        </div>
      </div>

      {/* Counselor Remarks Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Faculty Counselor Evaluation & Remarks</h3>
        <p className="text-xs text-slate-700 italic bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
          "{summary.remarks}"
        </p>
      </div>
    </div>
  );
};
