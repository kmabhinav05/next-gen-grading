import React, { useRef } from 'react';
import { AttendanceBadge } from '../common/AttendanceBadge';
import { reportsService } from '../../api/reports';
import { Printer, Download, GraduationCap, Award, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProgressCard = ({ data, showActions = true }) => {
  const cardRef = useRef(null);

  if (!data) return null;

  const { student, subjects, summary } = data;

  const handleDownloadPdf = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-toast' });
      const response = await reportsService.downloadProgressCardPdf(student.id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ProgressCard_${student.reg_no}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Downloaded PDF successfully!', { id: 'pdf-toast' });
    } catch (err) {
      toast.error('Failed to download PDF.', { id: 'pdf-toast' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      {showActions && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs no-print">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Digital Progress Card</h3>
            <p className="text-xs text-slate-500">Official Student Progress Report for Parent-Teacher Meeting</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Card</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Printable Progress Card */}
      <div
        ref={cardRef}
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm print-card-container print:border-none print:shadow-none print:p-0"
      >
        {/* Institutional Header */}
        <div className="text-center pb-6 border-b-2 border-primary-900 mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/logo.png" alt="Next Gen Grading" className="h-9 object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-primary-900 tracking-tight uppercase">
            National Institute of Engineering & Technology
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">
            Department of {student.department} | Academic Year {student.academic_year}
          </p>
          <div className="inline-block mt-3 px-4 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-800 uppercase tracking-wider">
            Student Performance & Attendance Progress Card
          </div>
        </div>

        {/* Student Meta Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-xs">
          <div>
            <span className="text-slate-500 block">Student Name:</span>
            <strong className="text-slate-900 text-sm font-semibold">{student.name}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Register Number:</span>
            <strong className="text-slate-900 text-sm font-mono font-semibold">{student.reg_no}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Semester & Section:</span>
            <strong className="text-slate-900 font-semibold">Semester {student.semester} - Section {student.section}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Cumulative Score:</span>
            <strong className="text-primary-700 font-semibold text-sm">
              {summary.total_scored} / {summary.total_max} ({summary.overall_marks_percentage}%)
            </strong>
          </div>
        </div>

        {/* Subject-wise Marks & Attendance Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-primary-900 text-white font-semibold">
                <th rowSpan="2" className="px-3 py-2.5 text-center border border-primary-800 w-16">Code</th>
                <th rowSpan="2" className="px-3 py-2.5 border border-primary-800">Subject Name & Faculty</th>
                <th colSpan="4" className="px-3 py-1.5 text-center border border-primary-800">Internal Marks</th>
                <th colSpan="3" className="px-3 py-1.5 text-center border border-primary-800">Attendance Record</th>
              </tr>
              <tr className="bg-primary-800 text-white font-medium text-[11px]">
                <th className="px-2 py-1.5 text-center border border-primary-700 w-12">IA 1</th>
                <th className="px-2 py-1.5 text-center border border-primary-700 w-12">IA 2</th>
                <th className="px-2 py-1.5 text-center border border-primary-700 w-12">IA 3</th>
                <th className="px-2 py-1.5 text-center border border-primary-700 w-16">Average</th>
                <th className="px-2 py-1.5 text-center border border-primary-700 w-14">Held</th>
                <th className="px-2 py-1.5 text-center border border-primary-700 w-14">Attended</th>
                <th className="px-2 py-1.5 text-center border border-primary-700 w-24">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border-b border-slate-200">
              {subjects.map((s) => (
                <tr key={s.code} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-3 py-3 font-mono font-bold text-slate-900 text-center border border-slate-200">
                    {s.code}
                  </td>
                  <td className="px-3 py-3 border border-slate-200">
                    <p className="font-semibold text-slate-900">{s.name}</p>
                    <p className="text-[11px] text-slate-500">Faculty: {s.staff_name}</p>
                  </td>
                  <td className="px-2 py-3 text-center border border-slate-200 font-mono text-slate-700">
                    {s.ia1 !== null ? s.ia1 : '-'}
                  </td>
                  <td className="px-2 py-3 text-center border border-slate-200 font-mono text-slate-700">
                    {s.ia2 !== null ? s.ia2 : '-'}
                  </td>
                  <td className="px-2 py-3 text-center border border-slate-200 font-mono text-slate-700">
                    {s.ia3 !== null ? s.ia3 : '-'}
                  </td>
                  <td className="px-2 py-3 text-center font-bold font-mono text-slate-900 border border-slate-200 bg-slate-50/50">
                    {s.average} <span className="text-[10px] text-slate-400">/{s.max_internal_marks}</span>
                  </td>
                  <td className="px-2 py-3 text-center border border-slate-200 text-slate-600">{s.classes_held}</td>
                  <td className="px-2 py-3 text-center border border-slate-200 text-slate-600">{s.classes_attended}</td>
                  <td className="px-2 py-3 text-center border border-slate-200">
                    <AttendanceBadge percentage={s.attendance_percentage} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remarks & Performance Assessment Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Faculty Counselor Evaluation & Remarks
            </h4>
          </div>
          <p className="text-xs text-slate-700 italic leading-relaxed">
            "{summary.remarks}"
          </p>
          {summary.overall_attendance_status === 'CRITICAL' && (
            <div className="mt-3 flex items-center gap-2 text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>CRITICAL ATTENDANCE ALERT: Parents are requested to consult the HOD immediately.</span>
            </div>
          )}
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-3 gap-4 pt-10 border-t border-dashed border-slate-300 text-center text-xs text-slate-600">
          <div>
            <div className="h-10"></div>
            <p className="font-semibold text-slate-800 border-t border-slate-400 pt-2 mx-4">Class Counselor</p>
          </div>
          <div>
            <div className="h-10"></div>
            <p className="font-semibold text-slate-800 border-t border-slate-400 pt-2 mx-4">Head of Department (HOD)</p>
          </div>
          <div>
            <div className="h-10"></div>
            <p className="font-semibold text-slate-800 border-t border-slate-400 pt-2 mx-4">Parent / Guardian Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};
