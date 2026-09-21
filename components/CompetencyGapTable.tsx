'use client';

import React, { useState } from 'react';
import { CompetencyGapItem, CompetencyCategory } from '@/lib/types';
import { CheckCircle2, AlertCircle, ArrowUpRight, BookOpen, Sparkles, Filter } from 'lucide-react';

interface CompetencyGapTableProps {
  gaps: CompetencyGapItem[];
  onTakeAssessment: (competencyId: string, competencyName: string) => void;
  onViewCourse: (courseId?: string) => void;
}

export const CompetencyGapTable: React.FC<CompetencyGapTableProps> = ({
  gaps,
  onTakeAssessment,
  onViewCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredGaps = gaps.filter((item) => {
    const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchCategory && matchStatus;
  });

  return (
    <div className="bg-white rounded-xl border border-slatecool-200 shadow-card overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slatecool-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-sand-50/60">
        <div>
          <h3 className="text-base font-bold text-slatenavy-900 flex items-center space-x-2">
            <span>FRAC Role Competency Audit Matrix</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sand-200 text-slatenavy-900 font-medium">
              {filteredGaps.length} Competencies
            </span>
          </h3>
          <p className="text-xs text-slatenavy-900/60">
            Current assessed level vs. official MoSPI job profile benchmark
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slatecool-200 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-electric-500 text-white'
                  : 'text-slate-600 hover:bg-slatecool-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('Domain')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedCategory === 'Domain'
                  ? 'bg-electric-500 text-white'
                  : 'text-slate-600 hover:bg-slatecool-100'
              }`}
            >
              Domain
            </button>
            <button
              onClick={() => setSelectedCategory('Technical')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedCategory === 'Technical'
                  ? 'bg-electric-500 text-white'
                  : 'text-slate-600 hover:bg-slatecool-100'
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => setSelectedCategory('Behavioral')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedCategory === 'Behavioral'
                  ? 'bg-electric-500 text-white'
                  : 'text-slate-600 hover:bg-slatecool-100'
              }`}
            >
              Behavioral
            </button>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white px-3 py-1.5 rounded-lg border border-slatecool-200 text-xs font-semibold text-slatenavy-900 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="GAP_IDENTIFIED">⚠️ Gaps Identified</option>
            <option value="VERIFIED">✓ Verified</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slatecool-100/80 text-slatenavy-900/80 font-bold border-b border-slatecool-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Competency & Cadre Code</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-center">Assessed Level</th>
              <th className="py-3.5 px-4 text-center">Required Benchmark</th>
              <th className="py-3.5 px-4 text-center">Readiness %</th>
              <th className="py-3.5 px-4 text-center">Audit Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slatecool-200">
            {filteredGaps.map((item) => {
              const isVerified = item.status === 'VERIFIED';
              return (
                <tr
                  key={item.competency_id}
                  className="hover:bg-sand-50/70 transition-colors group"
                >
                  {/* Title & Info */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-slatenavy-900 group-hover:text-electric-600 transition-colors">
                      {item.competency_name}
                    </div>
                    {item.recommended_course && (
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <BookOpen className="w-3 h-3 text-electric-500" />
                        <span>iGOT: {item.recommended_course.course_title}</span>
                      </div>
                    )}
                  </td>

                  {/* Category Pill */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        item.category === 'Domain'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : item.category === 'Technical'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>

                  {/* Assessed Level */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`w-2.5 h-2.5 rounded-full ${
                            lvl <= item.current_level
                              ? 'bg-electric-500'
                              : 'bg-slatecool-200'
                          }`}
                          title={`Level ${item.current_level}`}
                        />
                      ))}
                      <span className="font-bold text-xs ml-1 text-slatenavy-900">
                        L{item.current_level}
                      </span>
                    </div>
                  </td>

                  {/* Required Level */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-xs text-slatenavy-900 bg-sand-100 px-2 py-0.5 rounded border border-slatecool-200">
                      Level {item.required_level}
                    </span>
                  </td>

                  {/* Readiness Progress Bar */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="w-24 mx-auto">
                      <div className="flex justify-between text-[10px] font-bold text-slatenavy-900 mb-1">
                        <span>{item.readiness_percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slatecool-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isVerified ? 'bg-emeralddeep-600' : 'bg-electric-500'
                          }`}
                          style={{ width: `${item.readiness_percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {item.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emeralddeep-50 text-emeralddeep-700 border border-emeralddeep-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emeralddeep-600" />
                        <span>Verified</span>
                      </span>
                    ) : item.status === 'PENDING_ASSESSMENT' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slatecool-100 text-slatenavy-600 border border-slatecool-300">
                        <AlertCircle className="w-3.5 h-3.5 text-slatenavy-500" />
                        <span>Unassessed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-crimsonsoft-50 text-crimsonsoft-600 border border-crimsonsoft-200">
                        <AlertCircle className="w-3.5 h-3.5 text-crimsonsoft-600" />
                        <span>Gap (-{item.gap} Lvl)</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center space-x-2">
                      {!isVerified && (
                        <button
                          onClick={() => onTakeAssessment(item.competency_id, item.competency_name)}
                          className="px-2.5 py-1.5 rounded-lg bg-electric-500 text-white font-semibold hover:bg-electric-600 transition-colors shadow-sm text-xs flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{item.status === 'PENDING_ASSESSMENT' ? 'Assess Now' : 'Bridge Gap'}</span>
                        </button>
                      )}

                      {isVerified ? (
                        <button
                          onClick={() => onTakeAssessment(item.competency_id, item.competency_name)}
                          className="px-2.5 py-1.5 rounded-lg bg-slatecool-100 text-slatenavy-900 font-semibold hover:bg-slatecool-200 transition-colors text-xs"
                        >
                          Re-assess
                        </button>
                      ) : (
                        <button
                          onClick={() => onViewCourse(item.recommended_course?.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slatecool-300 text-slatenavy-900 hover:bg-white transition-colors text-xs"
                          title="View on iGOT Karmayogi"
                        >
                          iGOT Course
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
