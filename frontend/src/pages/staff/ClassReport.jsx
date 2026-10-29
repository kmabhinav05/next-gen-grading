import React, { useState, useEffect } from 'react';
import { academicsService } from '../../api/academics';
import { reportsService } from '../../api/reports';
import { DataTable } from '../../components/common/DataTable';
import { AttendanceBadge } from '../../components/common/AttendanceBadge';
import { FileText, Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ClassReport = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    academicsService.getSemesters().then((res) => {
      setSemesters(res);
      if (res.length > 0) setSelectedSemester(res[0].id);
    });
  }, []);

  const fetchClassReport = async () => {
    if (!selectedSemester) return;
    setLoading(true);
    try {
      const data = await reportsService.getClassReport({
        semester: selectedSemester,
        section: selectedSection,
      });
      setStudents(data);
    } catch (err) {
      toast.error('Failed to load class report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassReport();
  }, [selectedSemester, selectedSection]);

  const handleBulkPdfDownload = async () => {
    try {
      toast.loading('Compiling merged class PDFs...', { id: 'bulk-toast' });
      const res = await reportsService.downloadBulkPdf({
        semester_id: selectedSemester,
        section: selectedSection,
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `Class_Cards_Sem${selectedSemester}_Sec${selectedSection}.pdf`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Downloaded bulk class PDF package!', { id: 'bulk-toast' });
    } catch (err) {
      toast.error('Failed to generate bulk PDF.', { id: 'bulk-toast' });
    }
  };

  const columns = [
    {
      header: 'Register No',
      accessor: 'reg_no',
      sortable: true,
      render: (r) => <span className="font-mono font-bold text-slate-900">{r.reg_no}</span>,
    },
    {
      header: 'Student Name',
      accessor: 'name',
      sortable: true,
      render: (r) => <span className="font-semibold text-slate-800">{r.name}</span>,
    },
    {
      header: 'Overall Marks %',
      accessor: 'overall_marks_percentage',
      sortable: true,
      render: (r) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          {r.overall_marks_percentage}%
        </span>
      ),
    },
    {
      header: 'Attendance %',
      accessor: 'overall_attendance_percentage',
      sortable: true,
      render: (r) => <AttendanceBadge percentage={r.overall_attendance_percentage} />,
    },
    {
      header: 'Weak Areas',
      accessor: 'weak_subjects_count',
      render: (r) =>
        r.weak_subjects_count > 0 ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            {r.weak_subjects_count} subjects &lt; 50%
          </span>
        ) : (
          <span className="text-[11px] text-emerald-600 font-semibold">Good</span>
        ),
    },
    {
      header: 'Action',
      cellClassName: 'text-right',
      render: (r) => (
        <Link
          to={`/staff/student-card/${r.id}`}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg border border-primary-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Progress Card</span>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Class Progress Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Searchable class register with instant digital progress card view and bulk PDF export
          </p>
        </div>

        <button
          onClick={handleBulkPdfDownload}
          disabled={students.length === 0}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-xl transition-colors shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Download Class Bulk PDF</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Semester:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                Semester {s.number} ({s.academic_year})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Section:</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search student by name or register number..."
        keyField="id"
      />
    </div>
  );
};
