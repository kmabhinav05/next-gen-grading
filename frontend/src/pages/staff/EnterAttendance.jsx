import React, { useState, useEffect, useMemo } from 'react';
import { academicsService } from '../../api/academics';
import { attendanceService } from '../../api/attendance';
import { AttendanceBadge } from '../../components/common/AttendanceBadge';
import HoldButton from '../../components/common/HoldButton';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Users,
  Calendar,
  Clock,
  Save,
  Check,
  X,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EnterAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Daily Marking Session States
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [sessionPeriod, setSessionPeriod] = useState('Lecture 1 (09:00 - 10:00 AM)');
  const [markingMode, setMarkingMode] = useState('session'); // 'session' (Present/Absent/Unmarked) or 'register' (raw numbers)

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
      const currentSubj = subjects.find((s) => s.id === Number(selectedSubject));
      const [stuRes, attRes] = await Promise.all([
        academicsService.getStudents({ semester: currentSubj?.semester }),
        attendanceService.getAttendance({ subject_id: selectedSubject }),
      ]);

      const students = Array.isArray(stuRes?.results) ? stuRes.results : (Array.isArray(stuRes) ? stuRes : []);
      const attMap = {};
      (attRes || []).forEach((a) => {
        attMap[a.student] = a;
      });

      const merged = students.map((s) => {
        const existing = attMap[s.id];
        const baseHeld = existing ? Number(existing.classes_held) : 40;
        const baseAttended = existing ? Number(existing.classes_attended) : 36;

        return {
          student_id: s.id,
          reg_no: s.reg_no,
          name: s.full_name,
          section: s.section,
          // Base numbers from database
          base_held: baseHeld,
          base_attended: baseAttended,
          // Current session status: 'present' | 'absent' | 'unmarked'
          status: 'unmarked',
          // Effective calculated numbers
          classes_held: baseHeld,
          classes_attended: baseAttended,
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

  // Handle setting status for a single student: 'present', 'absent', or 'unmarked'
  const handleStatusChange = (index, newStatus) => {
    setAttendanceRecords((prev) => {
      const updated = [...prev];
      const r = updated[index];
      r.status = newStatus;

      if (newStatus === 'present') {
        r.classes_held = r.base_held + 1;
        r.classes_attended = r.base_attended + 1;
      } else if (newStatus === 'absent') {
        r.classes_held = r.base_held + 1;
        r.classes_attended = r.base_attended;
      } else {
        // Unmarked reverts to base numbers
        r.classes_held = r.base_held;
        r.classes_attended = r.base_attended;
      }
      return updated;
    });
  };

  // Batch marking actions
  const handleMarkAll = (status) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => {
        let held = r.base_held;
        let attended = r.base_attended;
        if (status === 'present') {
          held += 1;
          attended += 1;
        } else if (status === 'absent') {
          held += 1;
        }
        return {
          ...r,
          status,
          classes_held: held,
          classes_attended: attended,
        };
      })
    );
    if (status === 'present') toast.success('Marked all students as Present!');
    else if (status === 'absent') toast.error('Marked all students as Absent!');
    else toast('Attendance reset to Unmarked', { icon: '↺' });
  };

  // Direct number input change (for Register Mode)
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
      prev.map((r) => ({ ...r, classes_held: val, base_held: val }))
    );
    toast.success(`Set Classes Held = ${val} for all students`);
  };

  // Computed summary counts
  const summary = useMemo(() => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((r) => r.status === 'present').length;
    const absent = attendanceRecords.filter((r) => r.status === 'absent').length;
    const unmarked = attendanceRecords.filter((r) => r.status === 'unmarked').length;
    const sessionRate = present + absent > 0 ? ((present / (present + absent)) * 100).toFixed(1) : '100.0';

    return { total, present, absent, unmarked, sessionRate };
  }, [attendanceRecords]);

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
      toast.success('Attendance records saved and committed successfully!');
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update attendance.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATTENDANCE REGISTER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Session Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Enter Subject Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mark lecture session attendance with real-time Present, Absent & Unmarked states and shortage alerts
          </p>
        </div>

        {/* Save with HoldButton */}
        <div className="self-start sm:self-auto">
          <HoldButton
            onHold={handleSave}
            onTap={() => {
              if (attendanceRecords.length === 0) {
                toast.error('No attendance records available');
              } else {
                toast('Hold button to save and commit attendance records', { icon: '👆' });
              }
            }}
            disabled={saving || attendanceRecords.length === 0}
            doneLabel="Attendance Saved!"
            backgroundColor="#0f172a"
            fillColor="#10b981"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            holdTime={1100}
            radius={14}
            size="md"
            icon={<Save className="w-4 h-4 mr-1.5" />}
          >
            {saving ? 'Saving...' : 'Hold to Save Attendance'}
          </HoldButton>
        </div>
      </div>

      {/* 2. Session Context & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Subject Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="font-bold text-slate-700">Course / Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name} (Sem {s.semester_number})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Period Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sessionPeriod}
                onChange={(e) => setSessionPeriod(e.target.value)}
                className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer"
              >
                <option>Lecture 1 (09:00 - 10:00 AM)</option>
                <option>Lecture 2 (10:00 - 11:00 AM)</option>
                <option>Lecture 3 (11:15 - 12:15 PM)</option>
                <option>Lecture 4 (01:15 - 02:15 PM)</option>
                <option>Lab Session (02:15 - 04:15 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Quick Action Strips & Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          {/* Quick Marking Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500 mr-1">Quick Mark All:</span>
            <button
              type="button"
              onClick={() => handleMarkAll('present')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold transition-all shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Mark All Present
            </button>

            <button
              type="button"
              onClick={() => handleMarkAll('absent')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold transition-all shadow-2xs"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              Mark All Absent
            </button>

            <button
              type="button"
              onClick={() => handleMarkAll('unmarked')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 font-semibold transition-all shadow-2xs"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              Clear / Unmark
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setMarkingMode('session')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                markingMode === 'session'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Marking (P / A / -)
            </button>
            <button
              type="button"
              onClick={() => setMarkingMode('register')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                markingMode === 'register'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Total Held / Attended
            </button>
          </div>
        </div>
      </div>

      {/* 4. Live Session Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Total Students</span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{summary.total}</span>
        </div>

        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 block uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present
          </span>
          <span className="text-xl font-black text-emerald-800 mt-0.5 block">{summary.present}</span>
        </div>

        <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-rose-700 block uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Absent
          </span>
          <span className="text-xl font-black text-rose-800 mt-0.5 block">{summary.absent}</span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 block uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Unmarked
          </span>
          <span className="text-xl font-black text-slate-700 mt-0.5 block">{summary.unmarked}</span>
        </div>

        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Session Rate</span>
          <span className="text-xl font-extrabold text-primary-700 mt-0.5 block font-mono">
            {summary.sessionRate}%
          </span>
        </div>
      </div>

      {/* 5. Main Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {markingMode === 'register' && (
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">Bulk Set 'Classes Held' for all:</span>
            <div className="flex items-center gap-2">
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
                className="w-24 px-3 py-1.5 border border-slate-200 rounded-xl text-center font-mono font-bold bg-white"
              />
              <span className="text-[11px] text-slate-400">Press Enter or blur to apply</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="px-4 py-3.5 w-12 text-center">#</th>
                <th className="px-4 py-3.5 w-32">Reg No</th>
                <th className="px-4 py-3.5">Student Name</th>
                <th className="px-4 py-3.5 w-20 text-center">Sec</th>
                {markingMode === 'session' ? (
                  <>
                    <th className="px-4 py-3.5 text-center min-w-[240px]">
                      Attendance Status (Present / Absent / Unmarked)
                    </th>
                    <th className="px-4 py-3.5 w-32 text-center">Attended / Held</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3.5 w-32 text-center">Classes Held</th>
                    <th className="px-4 py-3.5 w-32 text-center">Attended</th>
                  </>
                )}
                <th className="px-4 py-3.5 w-36 text-center">Overall %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((r, idx) => {
                  const pct = r.classes_held > 0 ? ((r.classes_attended / r.classes_held) * 100).toFixed(1) : '100.0';
                  const isInvalid = r.classes_attended > r.classes_held;

                  return (
                    <tr
                      key={r.student_id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        r.status === 'present'
                          ? 'bg-emerald-50/20'
                          : r.status === 'absent'
                          ? 'bg-rose-50/20'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-center">{idx + 1}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{r.reg_no}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{r.name}</td>
                      <td className="px-4 py-3.5 text-center text-slate-600 font-semibold">Sec {r.section}</td>

                      {markingMode === 'session' ? (
                        <>
                          {/* Present / Absent / Unmarked 3-Way Pill Group */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit mx-auto shadow-2xs">
                              {/* Present Button */}
                              <button
                                type="button"
                                onClick={() => handleStatusChange(idx, 'present')}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                  r.status === 'present'
                                    ? 'bg-emerald-600 text-white shadow-xs scale-102'
                                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Present</span>
                              </button>

                              {/* Absent Button */}
                              <button
                                type="button"
                                onClick={() => handleStatusChange(idx, 'absent')}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                  r.status === 'absent'
                                    ? 'bg-rose-600 text-white shadow-xs scale-102'
                                    : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/60'
                                }`}
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Absent</span>
                              </button>

                              {/* Unmarked Button */}
                              <button
                                type="button"
                                onClick={() => handleStatusChange(idx, 'unmarked')}
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                                  r.status === 'unmarked'
                                    ? 'bg-white text-slate-800 shadow-2xs font-bold border border-slate-200'
                                    : 'text-slate-400 hover:text-slate-700'
                                }`}
                              >
                                <span>Unmarked</span>
                              </button>
                            </div>
                          </td>

                          {/* Live Attended / Held count */}
                          <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700">
                            {r.classes_attended} / {r.classes_held}
                          </td>
                        </>
                      ) : (
                        <>
                          {/* Direct Number Editing */}
                          <td className="px-4 py-3.5 text-center">
                            <input
                              type="number"
                              min="0"
                              value={r.classes_held}
                              onChange={(e) => handleInputChange(idx, 'classes_held', e.target.value)}
                              className="w-20 px-2.5 py-1 text-center font-mono font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 bg-white"
                            />
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <input
                              type="number"
                              min="0"
                              value={r.classes_attended}
                              onChange={(e) => handleInputChange(idx, 'classes_attended', e.target.value)}
                              className={`w-20 px-2.5 py-1 text-center font-mono font-bold border rounded-lg focus:ring-2 focus:ring-primary-500/20 bg-white ${
                                isInvalid ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200'
                              }`}
                            />
                          </td>
                        </>
                      )}

                      {/* Percentage Badge */}
                      <td className="px-4 py-3.5 text-center">
                        {isInvalid ? (
                          <span className="text-[10px] text-rose-600 font-bold px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                            Attended &gt; Held
                          </span>
                        ) : (
                          <AttendanceBadge percentage={pct} />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    {loading ? 'Loading class list...' : 'No registered students found for this subject.'}
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

export default EnterAttendance;
