import React from 'react';
import { Award, FileUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const SemesterResults = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg border border-primary-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300 border border-white/10 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upcoming Module • Next Gen Feature</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Controller of Examinations (COE) Results Synthesizer
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Automated extraction and consolidation of external university semester grade sheets alongside internal continuous assessments.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">Planned Workflow & Architecture</h2>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Official Result PDF</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Students or Exam Cell upload official University result gazette / PDF mark sheets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">pdfplumber Parser</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Backend parses tabular records (Subject Codes, Grade Points, Credits, Pass/Fail status).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Consolidated Report</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Combines internal marks with final grades to compute accurate SGPA & CGPA rankings.
            </p>
          </div>
        </div>

        <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50">
          <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3">
            <FileUp className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">COE Result Uploader</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            This module is reserved for the upcoming Controller of Examinations integration. Models and parsing endpoints are pre-registered in the backend.
          </p>
          <button
            disabled
            className="mt-4 px-4 py-2 bg-slate-200 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
          >
            Module In Staging Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};
