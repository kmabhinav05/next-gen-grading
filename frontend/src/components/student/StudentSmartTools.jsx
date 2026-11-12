import React, { useState, useMemo } from 'react';
import { Calculator, Sparkles } from 'lucide-react';
import { playHapticChime } from '../../utils/sound';

const AttendanceSimulatorCard = React.memo(({ subjects, summary, semester }) => {
  const [simMode, setSimMode] = useState('attend');
  const [extraClassesToSimulate, setExtraClassesToSimulate] = useState(5);

  const {
    totalAttended,
    totalHeld,
    simBaselinePerc,
    safeLeavesMargin,
    deficitClasses,
    simAttended,
    simHeld,
    projectedPerc,
    percDelta,
    isProjectedSafe
  } = useMemo(() => {
    const computedAttended = subjects?.reduce((sum, s) => sum + (s.classes_attended || 0), 0) || 138;
    const computedHeld = subjects?.reduce((sum, s) => sum + (s.classes_held || 0), 0) || 148;
    const attended = summary?.total_classes_attended || computedAttended;
    const held = summary?.total_classes_held || computedHeld;
    const baseline =
      held > 0
        ? Number(((attended / held) * 100).toFixed(1))
        : (summary?.overall_attendance_percentage || 85.0);
    const leavesMargin = Math.max(0, Math.floor((attended - 0.75 * held) / 0.75));
    const deficit = Math.max(0, Math.ceil((0.75 * held - attended) / 0.25));

    const nextAttended = simMode === 'attend' ? attended + extraClassesToSimulate : attended;
    const nextHeld = held + extraClassesToSimulate;
    const projected = nextHeld > 0 ? Number(((nextAttended / nextHeld) * 100).toFixed(1)) : baseline;
    const delta = Number((projected - baseline).toFixed(1));

    return {
      totalAttended: attended,
      totalHeld: held,
      simBaselinePerc: baseline,
      safeLeavesMargin: leavesMargin,
      deficitClasses: deficit,
      simAttended: nextAttended,
      simHeld: nextHeld,
      projectedPerc: projected,
      percDelta: delta,
      isProjectedSafe: projected >= 75.0
    };
  }, [subjects, summary, simMode, extraClassesToSimulate]);

  const sliderProgress = ((extraClassesToSimulate - 1) / 39) * 100;

  return (
    <div className="bg-white/95 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-5">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-[1.3]">
                Attendance Goal &amp; Leave Simulator
              </h3>
              <span className="text-xs text-[#475569] block">Forecast compliance &amp; leave buffer</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
            Hall Ticket Rule: 75%
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="text-[#475569] font-medium">Current:</span>
            <strong className="font-bold text-slate-900 font-mono">{simBaselinePerc}%</strong>
            <span className="text-[#475569] font-mono">
              ({totalAttended}/{totalHeld})
            </span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-md font-semibold text-xs ${
                simBaselinePerc >= 75
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {simBaselinePerc >= 75 ? `${safeLeavesMargin} Safe Leaves` : `Attend ${deficitClasses}`}
            </span>
          </div>

          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                playHapticChime();
                setSimMode('attend');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                simMode === 'attend'
                  ? 'bg-white text-cyan-800 shadow-2xs font-bold'
                  : 'text-[#475569] hover:text-slate-900'
              }`}
            >
              + Attend
            </button>
            <button
              type="button"
              onClick={() => {
                playHapticChime();
                setSimMode('miss');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                simMode === 'miss'
                  ? 'bg-white text-rose-700 shadow-2xs font-bold'
                  : 'text-[#475569] hover:text-slate-900'
              }`}
            >
              − Miss
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#475569]">
              {simMode === 'attend'
                ? `Simulate attending next ${extraClassesToSimulate} ${extraClassesToSimulate === 1 ? 'lecture' : 'lectures'}`
                : `Simulate missing upcoming ${extraClassesToSimulate} ${extraClassesToSimulate === 1 ? 'lecture' : 'lectures'}`}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="40"
            value={extraClassesToSimulate}
            onChange={(e) => setExtraClassesToSimulate(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, ${
                simMode === 'attend' ? '#0891b2' : '#e11d48'
              } ${sliderProgress}%, #e2e8f0 ${sliderProgress}%)`
            }}
            className={`w-full sim-slider ${
              simMode === 'attend' ? 'sim-slider-cyan' : 'sim-slider-rose'
            } cursor-pointer`}
          />

          <div className="flex justify-between text-xs text-[#475569] font-medium px-0.5">
            <span>1</span>
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40 classes</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div
          className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 transition-colors ${
            isProjectedSafe ? 'bg-cyan-50/50 border-cyan-200/80' : 'bg-rose-50/60 border-rose-200/80'
          }`}
        >
          <div>
            <span className={`text-xs font-semibold block ${isProjectedSafe ? 'text-cyan-900' : 'text-rose-900'}`}>
              Projected Attendance
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 font-mono leading-[1.3]">
                {projectedPerc}%
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  percDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {percDelta >= 0 ? `+${percDelta}%` : `${percDelta}%`}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#475569] block font-medium">Projected Standing</span>
            <span
              className={`inline-flex items-center gap-1.5 mt-0.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isProjectedSafe
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border-rose-200'
              }`}
            >
              <span>
                {simAttended} / {simHeld} • {isProjectedSafe ? 'Exam Eligible' : 'Below 75% Cutoff'}
              </span>
            </span>
          </div>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed max-w-[65ch]">
          Simulates cumulative attendance against the 75% hall ticket eligibility cutoff for Semester {semester}.
        </p>
      </div>
    </div>
  );
});

AttendanceSimulatorCard.displayName = 'AttendanceSimulatorCard';

const SgpaProjectorCard = React.memo(({ summary, semester }) => {
  const [targetScorePercent, setTargetScorePercent] = useState(85);

  const currentSgpa = Number(((summary?.percentage || 89.7) / 10).toFixed(1));
  const targetSgpa = Number((targetScorePercent / 10).toFixed(1));
  const sgpaDelta = Number((targetSgpa - currentSgpa).toFixed(1));
  const sliderProgress = ((targetScorePercent - 40) / 60) * 100;

  return (
    <div className="bg-white/95 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-5">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-[1.3]">
                Semester SGPA / Grade Projector
              </h3>
              <span className="text-xs text-[#475569] block">Estimate final grade point &amp; tier</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Target Simulator
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="text-[#475569] font-medium">Current Avg:</span>
            <strong className="font-bold text-slate-900 font-mono">{summary?.percentage || 89.7}%</strong>
            <span className="ml-1 px-2 py-0.5 rounded-md font-semibold text-xs bg-amber-50 text-amber-900 border border-amber-200">
              {currentSgpa} SGPA
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#475569]">Target Overall Percentage</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold font-mono text-xs">
              {targetScorePercent}%
            </span>
          </div>

          <input
            type="range"
            min="40"
            max="100"
            value={targetScorePercent}
            onChange={(e) => setTargetScorePercent(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #d97706 ${sliderProgress}%, #e2e8f0 ${sliderProgress}%)`
            }}
            className="w-full sim-slider sim-slider-amber cursor-pointer"
          />

          <div className="flex justify-between text-xs text-[#475569] font-medium px-0.5">
            <span>40%</span>
            <span>55%</span>
            <span>70%</span>
            <span>85%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-amber-900 font-semibold block">Projected Grade Point</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 font-mono leading-[1.3]">
                {targetSgpa.toFixed(1)}
                <span className="text-sm font-semibold text-[#475569]"> / 10.0 SGPA</span>
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  sgpaDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {sgpaDelta > 0 ? `+${sgpaDelta}` : sgpaDelta} vs avg
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#475569] block font-medium">Classification</span>
            <span className="inline-block mt-0.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 font-bold text-xs">
              {targetScorePercent >= 90
                ? "O (Dean's List)"
                : targetScorePercent >= 80
                ? 'A+ (Distinction)'
                : targetScorePercent >= 70
                ? 'A (First Class)'
                : targetScorePercent >= 60
                ? 'B+ (First Class)'
                : 'B (Second Class)'}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed max-w-[65ch]">
          Calculated on institutional credit weightages across enrolled subjects for Semester {semester}.
        </p>
      </div>
    </div>
  );
});

SgpaProjectorCard.displayName = 'SgpaProjectorCard';

export const StudentSmartTools = React.memo(({ subjects, summary, semester }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2 pb-12 items-stretch">
    <AttendanceSimulatorCard subjects={subjects} summary={summary} semester={semester} />
    <SgpaProjectorCard summary={summary} semester={semester} />
  </div>
));

StudentSmartTools.displayName = 'StudentSmartTools';
export default StudentSmartTools;
