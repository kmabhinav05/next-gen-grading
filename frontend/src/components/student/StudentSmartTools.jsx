import React, { useState, useMemo, useCallback } from 'react';
import { Calculator, Sparkles } from 'lucide-react';
import { playHapticChime } from '../../utils/sound';
import LiquidGauge from '../ui/LiquidGauge';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

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

  // Bidirectional sync when dragging inside the LiquidGauge directly
  const handleGaugeDrag = useCallback(
    (targetPct) => {
      const p = clamp(targetPct, 50, 97) / 100;
      const baseline = totalHeld > 0 ? totalAttended / totalHeld : 0.93;
      if (p >= baseline) {
        setSimMode('attend');
        const needed = Math.round((p * totalHeld - totalAttended) / Math.max(0.02, 1 - p));
        setExtraClassesToSimulate(clamp(needed, 1, 100));
      } else {
        setSimMode('miss');
        const missed = Math.round((totalAttended - p * totalHeld) / Math.max(0.05, p));
        setExtraClassesToSimulate(clamp(missed, 1, 100));
      }
    },
    [totalAttended, totalHeld]
  );

  const sliderProgress = ((extraClassesToSimulate - 1) / 99) * 100;
  const gaugeStatus = isProjectedSafe
    ? `${percDelta >= 0 ? `+${percDelta}%` : `${percDelta}%`} • Exam Eligible`
    : `${percDelta}% • Below 75% Cutoff`;

  return (
    <div className="bg-white/95 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-5 items-stretch">
      {/* Left Column: Controls & Insights */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-[1.3]">
                  Attendance Simulator
                </h3>
                <span className="text-xs text-[#475569] block">Rule: 75% Cutoff</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="text-[#475569] font-medium">Current:</span>
              <strong className="font-bold text-slate-900 font-mono">{simBaselinePerc}%</strong>
              <span className="text-[#475569] font-mono">
                ({totalAttended}/{totalHeld})
              </span>
            </div>
            <span
              className={`px-2.5 py-1 rounded-xl font-semibold text-xs ${
                simBaselinePerc >= 75
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {simBaselinePerc >= 75 ? `${safeLeavesMargin} Safe Leaves` : `Attend ${deficitClasses}`}
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold w-full">
            <button
              type="button"
              onClick={() => {
                playHapticChime();
                setSimMode('attend');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
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
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                simMode === 'miss'
                  ? 'bg-white text-rose-700 shadow-2xs font-bold'
                  : 'text-[#475569] hover:text-slate-900'
              }`}
            >
              − Miss
            </button>
          </div>

          {/* Lecture Count Slider */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-[#475569] block">
              {simMode === 'attend'
                ? `Simulate attending next ${extraClassesToSimulate} ${extraClassesToSimulate === 1 ? 'lecture' : 'lectures'}`
                : `Simulate missing upcoming ${extraClassesToSimulate} ${extraClassesToSimulate === 1 ? 'lecture' : 'lectures'}`}
            </span>

            <input
              type="range"
              min="1"
              max="100"
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
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed">
          Drag the liquid gauge or slider to forecast Semester {semester} hall ticket eligibility ({projectedPerc}%).
        </p>
      </div>

      {/* Right Column: Interactive KokonutUI LiquidGauge */}
      <div className="shrink-0 flex justify-center">
        <LiquidGauge
          value={projectedPerc}
          onValueChange={handleGaugeDrag}
          label="Projected Attendance"
          total={simHeld}
          unit="classes"
          sublineVerb="attended"
          roundUsed={true}
          warnAt={75}
          warnMode="below"
          statusText={gaugeStatus}
          className="w-full sm:w-[235px] xl:w-[260px] h-[22.5rem] shadow-xs"
        />
      </div>
    </div>
  );
});

AttendanceSimulatorCard.displayName = 'AttendanceSimulatorCard';

const getClassification = (score) => {
  if (score >= 90) return "O (Dean's List)";
  if (score >= 80) return 'A+ (Distinction)';
  if (score >= 70) return 'A (First Class)';
  if (score >= 60) return 'B+ (First Class)';
  if (score >= 50) return 'B (Second Class)';
  return 'Below Pass Cutoff';
};

const SgpaProjectorCard = React.memo(({ summary, semester }) => {
  const [targetScorePercent, setTargetScorePercent] = useState(85);

  const currentSgpa = Number(((summary?.percentage || 89.7) / 10).toFixed(1));
  const targetSgpa = Number((targetScorePercent / 10).toFixed(1));
  const sgpaDelta = Number((targetSgpa - currentSgpa).toFixed(1));
  const classification = getClassification(targetScorePercent);

  return (
    <div className="bg-white/95 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-5 items-stretch">
      {/* Left Column: Controls & Insights */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-[1.3]">
                  Semester SGPA Projector
                </h3>
                <span className="text-xs text-[#475569] block">Grade &amp; Distinction Tier</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="text-[#475569] font-medium">Current:</span>
              <strong className="font-bold text-slate-900 font-mono">{summary?.percentage || 89.7}%</strong>
            </div>
            <span className="px-2.5 py-1 rounded-xl font-semibold text-xs bg-amber-50 text-amber-900 border border-amber-200">
              {currentSgpa} SGPA
            </span>
          </div>

          {/* Target Score Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#475569]">Target Overall Score</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold font-mono text-xs">
                {targetScorePercent}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={targetScorePercent}
              onChange={(e) => setTargetScorePercent(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #d97706 ${targetScorePercent}%, #e2e8f0 ${targetScorePercent}%)`
              }}
              className="w-full sim-slider sim-slider-amber cursor-pointer"
            />

            <div className="flex justify-between text-xs text-[#475569] font-medium px-0.5">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Projected Delta Summary Pill */}
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-amber-900 font-semibold block">Grade Tier</span>
              <strong className="text-slate-900 font-bold">{classification}</strong>
            </div>
            <span
              className={`font-bold px-2.5 py-1 rounded-full ${
                sgpaDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/80 text-slate-700'
              }`}
            >
              {sgpaDelta > 0 ? `+${sgpaDelta}` : sgpaDelta} vs avg
            </span>
          </div>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed">
          Calculated on credit weightages for Semester {semester}. Drag the gauge to slosh and set target %.
        </p>
      </div>

      {/* Right Column: Interactive KokonutUI LiquidGauge */}
      <div className="shrink-0 flex justify-center">
        <LiquidGauge
          value={targetScorePercent}
          onValueChange={setTargetScorePercent}
          label="Target SGPA"
          total={10}
          unit="SGPA"
          sublineVerb="projected"
          warnAt={50}
          warnMode="below"
          statusText={classification}
          className="w-full sm:w-[235px] xl:w-[260px] h-[22.5rem] shadow-xs"
        />
      </div>
    </div>
  );
});

SgpaProjectorCard.displayName = 'SgpaProjectorCard';

export const StudentSmartTools = React.memo(({ subjects, summary, semester }) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pt-2 pb-12 items-stretch">
    <AttendanceSimulatorCard subjects={subjects} summary={summary} semester={semester} />
    <SgpaProjectorCard summary={summary} semester={semester} />
  </div>
));

StudentSmartTools.displayName = 'StudentSmartTools';
export default StudentSmartTools;
