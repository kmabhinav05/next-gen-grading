import React, { useState, useEffect } from 'react';
import { academicsService } from '../../api/academics';
import { attendanceService } from '../../api/attendance';
import { AttendanceBadge } from '../../components/common/AttendanceBadge';
import { ClipboardCheck, Save, Users, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export const EnterAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    academicsService.getSubjects().then((res) => {
      setSubjects(res);
      if (res.length > 0) setSelectedSubject(res[0].id);
    });
  }, []);

  const fetchAttendance = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    try {
      // First get all students in this subject's semester
      const currentSubj = subjects.find((s) => s.id === Number(selectedSubject));
      const [stuRes, attRes] = await Promise.all([
        academicsService.getStudents({ semester: currentSubj?.semester }),
        attendanceService.getAttendance({ subject_id: selectedSubject }),
      ]);

      const students = stuRes.results || stuRes;
      const attMap = {};
      (attRes || []).forEach((a) => {
        attMap[a.student] = a;
      });

      const merged = students.map((s) => {
        const existing = attMap[s.id];
        return {
          student_id: s.id,
          reg_no: s.reg_no,
          name: s.full_name,
          section: s.section,
          classes_held: existing ? existing.classes_held : 40,
          classes_attended: existing ? existing.classes_attended : 35,
        };
      });

      setAttendanceRecords(merged);
    } catch (err) {
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSubject) fetchAttendance();
  }, [selectedSubject, subjects]);

  const handleInputChange = (index, field, value) => {
    const updated = [...attendanceRecords];
    const val = parseInt(value, 10);
    updated[index][field] = isNaN(val) ? 0 : val;
    setAttendanceRecords(updated);
  };

  const handleSetHeldForAll = (heldCount) => {
    const val = parseInt(heldCount, 10);
    if (isNaN(val) || val < 0) return;
    setAttendanceRecords((prev) =>
      prev.map((r) => ({ ...r, classes_held: val }))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await attendanceService.bulkUpdate({
        subject_id: selectedSubject,
        records: attendanceRecords.map((r) => ({
          student_id: r.student_id,
          classes_held: r.classes_held,
          classes_attended: r.classes_attended,
        })),
      });
      toast.success('Attendance records saved successfully!');
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update attendance.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Enter Subject Attendance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain lecture attendance registers with dynamic shortage warning thresholds
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || attendanceRecords.length === 0}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-xl transition-colors shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
        </button>
      </div>

      {/* Subject Filter & Quick Fill */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <label className="font-semibold text-slate-700">Course / Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name} (Sem {s.semester_number})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Set 'Classes Held' for all:</span>
          <input
            type="number"
            min="0"
            placeholder="e.g. 42"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSetHeldForAll(e.currentTarget.value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value) handleSetHeldForAll(e.target.value);
            }}
            className="w-20 px-2.5 py-1.5 border border-slate-200 rounded-lg text-center font-mono"
          />
        </div>
      </div>

      {/* Attendance Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 uppercase text-[10px]">
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3 w-32">Reg No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3 w-20 text-center">Sec</th>
                <th className="px-4 py-3 w-32 text-center">Classes Held</th>
                <th className="px-4 py-3 w-32 text-center">Attended</th>
                <th className="px-4 py-3 w-36 text-center">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((r, idx) => {
                  const pct = r.classes_held > 0 ? ((r.classes_attended / r.classes_held) * 100).toFixed(1) : '100.0';
                  const isInvalid = r.classes_attended > r.classes_held;

                  return (
                    <tr key={r.student_id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{r.reg_no}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{r.name}</td>
                      <td className="px-4 py-3 text-center text-slate-600 font-semibold">Sec {r.section}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={r.classes_held}
                          onChange={(e) => handleInputChange(idx, 'classes_held', e.target.value)}
                          className="w-20 px-2 py-1 text-center font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={r.classes_attended}
                          onChange={(e) => handleInputChange(idx, 'classes_attended', e.target.value)}
                          className={`w-20 px-2 py-1 text-center font-mono border rounded-lg focus:ring-2 focus:ring-primary-500/20 ${
                            isInvalid ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200'
                          }`}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isInvalid ? (
                          <span className="text-[10px] text-rose-600 font-bold">Attended &gt; Held</span>
                        ) : (
                          <AttendanceBadge percentage={pct} />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    {loading ? 'Loading class list...' : 'No students found in this course semester.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
