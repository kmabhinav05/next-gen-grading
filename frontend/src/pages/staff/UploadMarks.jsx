import React, { useState, useEffect, useRef } from 'react';
import { academicsService } from '../../api/academics';
import { marksService } from '../../api/marks';
import { Upload, Download, CheckCircle2, AlertTriangle, FileSpreadsheet, RefreshCw, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const UploadMarks = () => {
  const [step, setStep] = useState(1); // 1: Select -> 2: Upload & Preview -> 3: Confirmed
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('IA1');

  const [dragActive, setDragActive] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    academicsService.getSubjects().then((res) => {
      const list = Array.isArray(res) ? res : (Array.isArray(res?.results) ? res.results : []);
      setSubjects(list);
      if (list.length > 0) setSelectedSubject(list[0].id);
    }).catch(() => {
      setSubjects([{ id: 1, code: 'CS501', name: 'Database Management Systems' }]);
      setSelectedSubject(1);
    });
  }, []);

  const handleDownloadTemplate = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject first.');
      return;
    }
    try {
      toast.loading('Generating template...', { id: 'template-toast' });
      const res = await marksService.downloadTemplate(selectedSubject, selectedAssessment);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const subj = subjects.find((s) => s.id === Number(selectedSubject));
      link.setAttribute('download', `${subj?.code || 'Subject'}_${selectedAssessment}_Template.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Template downloaded!', { id: 'template-toast' });
    } catch (err) {
      toast.error('Failed to download template.', { id: 'template-toast' });
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload an Excel spreadsheet (.xlsx or .xls)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject_id', selectedSubject);
    formData.append('assessment', selectedAssessment);

    setPreviewing(true);
    try {
      const data = await marksService.uploadPreview(formData);
      const selectedSubjObj = subjects.find((s) => String(s.id) === String(selectedSubject)) || subjects[0] || { id: 1, code: 'CS501', name: 'Database Management Systems' };
      const enrichedData = {
        ...data,
        subject_code: data.subject_code || selectedSubjObj.code || 'CS501',
        subject_name: data.subject_name || selectedSubjObj.name || 'Database Management Systems',
        assessment: data.assessment || selectedAssessment || 'IA1',
        is_valid: data.is_valid !== undefined ? data.is_valid : ((data.invalid_rows || 0) === 0),
        rows: (data.rows || []).map((r, idx) => ({
          ...r,
          row_number: r.row_number || r.row_num || idx + 2,
          student_name: r.student_name || r.name || 'Student Candidate',
          is_valid: r.is_valid !== undefined ? r.is_valid : true,
          errors: Array.isArray(r.errors) ? r.errors : (r.error ? [r.error] : [])
        }))
      };
      setPreviewData(enrichedData);
      setStep(2);
      if (enrichedData.invalid_rows > 0) {
        toast.error(`Found ${enrichedData.invalid_rows} errors in the spreadsheet. Please review below.`);
      } else {
        toast.success(`Validated ${enrichedData.valid_rows || enrichedData.rows.length} rows successfully! Ready to confirm.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to parse Excel file.');
    } finally {
      setPreviewing(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData || (previewData.invalid_rows > 0 && previewData.is_valid === false)) return;

    setConfirming(true);
    try {
      const activeSubjectId = selectedSubject || subjects[0]?.id || 1;
      const activeAssessment = selectedAssessment || previewData.assessment || 'IA1';

      await marksService.uploadConfirm({
        subject_id: activeSubjectId,
        assessment: activeAssessment,
        filename: previewData.filename || 'Uploaded_Marks.xlsx',
        rows: (previewData.rows || []).map((r) => ({ reg_no: r.reg_no, marks: Number(r.marks) || 0 })),
      });
      toast.success('Marks saved to database successfully!');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save marks.');
    } finally {
      setConfirming(false);
    }
  };

  const handleReset = () => {
    setPreviewData(null);
    setStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Upload Internal Marks</h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated Excel spreadsheet ingestion with live row validation and atomic database saving
        </p>
      </div>

      {/* Stepper Wizard Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-3 rounded-xl flex items-center justify-center gap-2 font-semibold ${step >= 1 ? 'bg-primary-50 text-primary-700' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Course & Template</span>
          </div>
          <div className={`p-3 rounded-xl flex items-center justify-center gap-2 font-semibold ${step >= 2 ? 'bg-primary-50 text-primary-700' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px]">2</span>
            <span>Validate & Preview</span>
          </div>
          <div className={`p-3 rounded-xl flex items-center justify-center gap-2 font-semibold ${step === 3 ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
            <span>Confirmed Ingestion</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Select Course & Assessment & Download Template */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Step 1: Choose Course & Assessment Cycle</h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name} (Sem {s.semester_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Cycle</label>
                <select
                  value={selectedAssessment}
                  onChange={(e) => setSelectedAssessment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                >
                  <option value="IA1">Internal Assessment 1 (IA 1)</option>
                  <option value="IA2">Internal Assessment 2 (IA 2)</option>
                  <option value="IA3">Internal Assessment 3 (IA 3)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-blue-950">Pre-populated Excel Template</h4>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Downloads an .xlsx template with student register numbers and names already filled in.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 rounded-xl transition-colors shadow-2xs whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Download Sample Sheet</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Upload Completed Excel Sheet</h3>
            <p className="text-xs text-slate-500 mb-4">
              Columns must include "Register Number" and "Marks". The system will immediately validate each student and range.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                dragActive ? 'border-primary-600 bg-primary-50/50' : 'border-slate-300 hover:border-primary-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mx-auto mb-3">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {previewing ? 'Parsing and validating spreadsheet...' : 'Click or drag Excel spreadsheet here'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">Accepts .xlsx or .xls files</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Preview & Validation Table */}
      {step === 2 && previewData && (
        <div className="space-y-6">
          {/* Validation Metrics Banner */}
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total Rows Read</span>
              <span className="text-2xl font-bold text-slate-900">{previewData.total_rows}</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-emerald-700 block uppercase">Valid Rows</span>
              <span className="text-2xl font-bold text-emerald-800">{previewData.valid_rows}</span>
            </div>
            <div className={`p-4 rounded-xl border shadow-2xs ${previewData.invalid_rows > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[11px] font-semibold block uppercase ${previewData.invalid_rows > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
                Errors Flagged
              </span>
              <span className={`text-2xl font-bold ${previewData.invalid_rows > 0 ? 'text-rose-800' : 'text-slate-700'}`}>
                {previewData.invalid_rows}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Target Assessment</span>
              <span className="text-sm font-bold text-primary-700 mt-1 block">
                {previewData.subject_code || 'CS501'} ({previewData.assessment || selectedAssessment || 'IA1'})
              </span>
            </div>
          </div>

          {/* Row-by-row Table with Error Badges */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Spreadsheet Row Verification</h3>
                <p className="text-xs text-slate-500">
                  {previewData.invalid_rows > 0
                    ? 'Fix flagged errors in your Excel file and re-upload before confirming.'
                    : 'All rows verified successfully against student enrollments and mark bounds.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-upload</span>
              </button>
            </div>

            <div className="overflow-x-auto max-h-[420px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5 w-16">Row</th>
                    <th className="px-4 py-2.5 w-32">Register No</th>
                    <th className="px-4 py-2.5">Student Name</th>
                    <th className="px-4 py-2.5 w-24">Marks</th>
                    <th className="px-4 py-2.5">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewData.rows.map((row, idx) => (
                    <tr
                      key={row.row_number || row.row_num || idx}
                      className={row.is_valid ? 'hover:bg-slate-50/50' : 'bg-rose-50/50 hover:bg-rose-50'}
                    >
                      <td className="px-4 py-3 text-slate-500 font-mono">{row.row_number || row.row_num || idx + 2}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{row.reg_no}</td>
                      <td className="px-4 py-3 text-slate-800 font-medium">{row.student_name || row.name || 'Student Candidate'}</td>
                      <td className="px-4 py-3 font-mono font-semibold">
                        {row.marks !== null ? row.marks : <span className="text-rose-500 italic">Empty</span>}
                      </td>
                      <td className="px-4 py-3">
                        {row.is_valid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Valid</span>
                          </span>
                        ) : (
                          <div className="space-y-1">
                            {row.errors.map((err, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200 mr-1.5"
                              >
                                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                <span>{err}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom action bar */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {previewData.invalid_rows > 0 ? (
                  <span className="text-rose-600 font-semibold">
                    * Confirm is disabled until all row errors are resolved.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">
                    ✓ All rows valid. Ready for atomic database ingestion.
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={confirming || (previewData.invalid_rows > 0 && !previewData.is_valid)}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors shadow-xs"
                >
                  <span>{confirming ? 'Ingesting to Database...' : 'Confirm & Save Marks'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Success Confirmation */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Marks Ingested Successfully!</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            All internal marks have been recorded into the database inside an atomic transaction. Digital progress cards are automatically updated.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors"
            >
              Upload Another Assessment
            </button>
            <a
              href="/staff/class-report"
              className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-xs"
            >
              View Class Reports
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
