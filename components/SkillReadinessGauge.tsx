'use client';

import React from 'react';
import { Award, AlertTriangle, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

interface SkillReadinessGaugeProps {
  readinessIndex: number;
  totalCompetencies: number;
  verifiedCount: number;
  gapCount: number;
  unassessedCount?: number;
  onSyncApar?: () => void;
  isSyncing?: boolean;
}

export const SkillReadinessGauge: React.FC<SkillReadinessGaugeProps> = ({
  readinessIndex,
  totalCompetencies,
  verifiedCount,
  gapCount,
  unassessedCount,
  onSyncApar,
  isSyncing = false,
}) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (readinessIndex / 100) * circumference;

  const getStatusDetails = () => {
    if (readinessIndex >= 85) {
      return {
        label: 'Exemplary Readiness',
        color: 'text-emeralddeep-600',
        badgeBg: 'bg-emeralddeep-50 text-emeralddeep-700 border-emeralddeep-200',
        desc: 'Officer exceeds core statistical mandate benchmarks.',
      };
    } else if (readinessIndex >= 70) {
      return {
        label: 'Proficient (Minor Gaps)',
        color: 'text-electric-500',
        badgeBg: 'bg-electric-50 text-electric-600 border-electric-200',
        desc: 'Meets primary field requirements; bridge 1-2 competencies.',
      };
    } else {
      return {
        label: 'Capacity Action Required',
        color: 'text-crimsonsoft-600',
        badgeBg: 'bg-crimsonsoft-50 text-crimsonsoft-600 border-crimsonsoft-200',
        desc: 'Key domain gaps detected. Urgent iGOT training required.',
      };
    }
  };

  const status = getStatusDetails();

  return (
    <div className="bg-white rounded-xl p-6 border border-slatecool-200 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slatenavy-900 flex flex-wrap items-center gap-2">
            <span>Skill Readiness Index (SRI)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sand-100 text-slatenavy-900/80 font-mono border border-slatecool-200 whitespace-nowrap flex-shrink-0">
              FRAC V2
            </span>
          </h3>
          <p className="text-xs text-slatenavy-900/60 mt-1">
            Automated compliance score across official statistical roles
          </p>
        </div>
        <span className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border text-center flex-shrink-0 h-fit ${status.badgeBg}`}>
          {status.label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4">
        {/* Radial Circular Progress Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#E2E8F0"
              strokeWidth="8"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={readinessIndex >= 75 ? '#0D9488' : '#3B82F6'}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Readout */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slatenavy-900 tracking-tight">
              {readinessIndex}%
            </span>
            <span className="text-[10px] uppercase font-bold text-slatenavy-900/50">
              Readiness
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Metrics */}
        <div className="flex-1 grid grid-cols-2 gap-2 w-full">
          
          <div className="p-2 bg-sand-50 rounded-lg border border-slatecool-200 flex flex-col justify-between">
            <div className="flex items-start space-x-1 text-emeralddeep-600 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[10px] font-bold leading-tight break-words">Verified</span>
            </div>
            <div className="text-xl font-extrabold text-slatenavy-900 flex items-baseline space-x-1">
              <span>{verifiedCount}</span>
              <span className="text-[10px] font-normal text-slate-500">/ {totalCompetencies}</span>
            </div>
            <div className="text-[10px] text-slate-500 leading-tight mt-0.5">Benchmarks Met</div>
          </div>

          <div className="p-2 bg-sand-50 rounded-lg border border-slatecool-200 flex flex-col justify-between overflow-hidden">
            {unassessedCount && unassessedCount > 0 ? (
              <>
                <div className="flex items-start space-x-1 text-slatenavy-600 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-[10px] font-bold leading-tight break-words">Unassessed</span>
                </div>
                <div className="text-xl font-extrabold text-slatenavy-900 flex items-baseline space-x-1">
                  <span>{unassessedCount}</span>
                  <span className="text-[10px] font-normal text-slate-500">pending</span>
                </div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5 break-words">Needs AI Eval</div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-1 text-crimsonsoft-600 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-[10px] font-bold leading-tight break-words">Skill Gaps</span>
                </div>
                <div className="text-xl font-extrabold text-crimsonsoft-600 flex items-baseline space-x-1">
                  <span>{gapCount}</span>
                  <span className="text-[10px] font-normal text-slate-500">gaps</span>
                </div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5 break-words">Under Target</div>
              </>
            )}
          </div>

          <div className="col-span-2 p-2.5 bg-electric-50 rounded-lg border border-electric-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-start sm:items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-electric-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-xs font-medium text-slatenavy-900 leading-tight">
                Next Promotion Threshold: <strong>80% SRI</strong>
              </span>
            </div>
            <span className="text-[11px] font-bold text-electric-600 sm:text-right">
              {readinessIndex >= 80 ? '✓ Eligible' : `${80 - readinessIndex}% needed`}
            </span>
          </div>

        </div>
      </div>

      <div className="pt-3 border-t border-slatecool-200 text-xs text-slatenavy-900/70 flex items-center justify-between">
        <span>{status.desc}</span>
        {onSyncApar && (
          <button
            onClick={onSyncApar}
            disabled={isSyncing}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slatenavy-900 text-white font-medium hover:bg-slatenavy-800 transition-colors disabled:opacity-50 text-xs"
          >
            <Award className="w-3.5 h-3.5 text-electric-500" />
            <span>{isSyncing ? 'Syncing to APAR...' : 'Sync to iGOT Passbook'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
