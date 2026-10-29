import React, { useState, useEffect } from 'react';
import { marksService } from '../../api/marks';
import { reportsService } from '../../api/reports';
import { academicsService } from '../../api/academics';
import { DataTable } from '../../components/common/DataTable';
import { AttendanceBadge } from '../../components/common/AttendanceBadge';
import { FileSpreadsheet, Eye, Download, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AllReports = () => {
  const [activeTab, setActiveTab] = useState('class'); // 'class' or 'logs'
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [classData, setClassData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    academicsService.getSemesters().then((res) => {
      setSemesters(res);
      if (res.length > 0) setSelectedSemester(res[0].id);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'class' && selectedSemester) {
      setLoading(true);
      reportsService
        .getClassReport({ semester: selectedSemester, section: selectedSection })
        .then((res) => setClassData(res))
        .catch(() => toast.error('Failed to load class report'))
        .finally(() => setLoading(false));
    } else if (activeTab === 'logs') {
      setLoading(true);
      marksService
        .getUploadLogs()
        .then((res) => setLogs(res.results || res))
        .catch(() => toast.error('Failed to load upload logs'))
        .finally(() => setLoading(false));
    }
  }, [activeTab, selectedSemester, selectedSection]);

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
      a.setAttribute('download', `Class_Progress_Sem${selectedSemester}_Sec${selectedSection}.pdf`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Downloaded bulk class PDF package!', { id: 'bulk-toast' });
    } catch (err) {
      toast.error('Failed to generate bulk PDF.', { id: 'bulk-toast' });
    }
  };

  const classColumns = [
    {
      header: 'Reg No',
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
      header: 'Class / Sec',
      accessor: 'section',
      render: (r) => <span>Sem {r.semester} - {r.section}</span>,
    },
    {
      header: 'Overall Marks %',
      accessor: 'overall_marks_percentage',
      sortable: true,
      render: (r) => (
        <span className="font-bold text-slate-900 font-mono">
          {r.overall_marks_percentage}%
        </span>
      ),
    },
    {
      header: 'Overall Attendance',
      accessor: 'overall_attendance_percentage',
      sortable: true,
      render: (r) => <AttendanceBadge percentage={r.overall_attendance_percentage} />,
    },
    {
      header: 'Action',
      cellClassName: 'text-right',
      render: (r) => (
        <Link
          to={`/staff/student-card/${r.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg border border-primary-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Card</span>
        </Link>
      ),
    },
  ];

  const logColumns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      sortable: true,
      render: (r) => <span className="text-slate-600 text-xs">{new Date(r.timestamp).toLocaleString()}</span>,
    },
    {
      header: 'Subject',
      accessor: 'subject_code',
      render: (r) => <span className="font-bold text-slate-900 font-mono">{r.subject_code}</span>,
    },
    {
      header: 'Assessment',
      accessor: 'assessment',
    },
    {
      header: 'Faculty',
      accessor: 'staff_name',
    },
    {
      header: 'Filename',
      accessor: 'filename',
      render: (r) => <span className="font-mono text-slate-500 text-xs">{r.filename}</span>,
    },
    {
      header: 'Valid Rows',
      accessor: 'valid_rows',
      render: (r) => <span className="font-mono font-semibold">{r.valid_rows} / {r.total_rows}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            r.status === 'SUCCESS'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Reports & Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-1">Class progress consolidation and faculty Excel upload audit logs</p>
        </div>

        {activeTab === 'class' && (
          <button
            onClick={handleBulkPdfDownload}
            disabled={classData.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Class Bulk PDF</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('class')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'class' ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Class Progress Reports</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'logs' ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Excel Upload Audit Logs</span>
        </button>
      </div>

      {activeTab === 'class' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700">Filter Semester:</span>
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
            <div className="flex items-center gap-2 text-xs">
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
            columns={classColumns}
            data={classData}
            searchPlaceholder="Search students in class..."
            keyField="id"
          />
        </div>
      )}

      {activeTab === 'logs' && (
        <DataTable
          columns={logColumns}
          data={logs}
          searchPlaceholder="Search upload audit logs..."
          keyField="id"
        />
      )}
    </div>
  );
};
