'use client';

import React, { useState } from 'react';
import { IGotCourse } from '@/lib/types';
import { ExternalLink, Star, Clock, Award, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: IGotCourse & { match_score?: number; gap_level?: number; competency_name?: string };
  onTakeQuizForCourse?: (competencyId: string, competencyName: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onTakeQuizForCourse,
}) => {
  const [enrolled, setEnrolled] = useState(false);

  const matchScore = course.match_score || 85;

  const handleEnroll = () => {
    setEnrolled(true);
  };

  return (
    <div className="bg-white rounded-xl border border-slatecool-200 p-5 shadow-card hover:shadow-hover hover:border-electric-500 transition-all flex flex-col justify-between group">
      <div>
        {/* Card Header: Match Score & iGOT ID */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              matchScore >= 90
                ? 'bg-electric-50 text-electric-600 border-electric-200'
                : 'bg-emeralddeep-50 text-emeralddeep-700 border-emeralddeep-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matchScore}% Semantic Match</span>
          </span>

          <span className="text-[11px] font-mono font-semibold text-slate-500 bg-sand-100 px-2 py-0.5 rounded border border-slatecool-200">
            {course.igot_course_id}
          </span>
        </div>

        {/* Competency Tag */}
        <div className="text-[11px] font-bold text-electric-600 uppercase tracking-wider mb-1">
          {course.competency_name || 'MoSPI Statistical Cadre'}
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-slatenavy-900 group-hover:text-electric-600 transition-colors line-clamp-2 leading-snug">
          {course.course_title}
        </h4>

        {/* Provider */}
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
          Offered by: <strong className="text-slatenavy-900 font-semibold">{course.provider}</strong>
        </p>

        {/* Tags */}
        {course.tags && (
          <div className="flex flex-wrap gap-1 mt-3">
            {course.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slatecool-100 text-slate-600 px-2 py-0.5 rounded font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta Bar & CTA */}
      <div className="mt-5 pt-3 border-t border-slatecool-200">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
          <div className="flex items-center space-x-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.duration_mins} mins</span>
          </div>

          <div className="flex items-center space-x-1 font-semibold text-amber-600">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{course.rating.toFixed(1)}</span>
          </div>

          <div className="text-xs font-semibold text-slatenavy-900">
            Target: <span className="text-electric-600">Level {course.target_level}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEnroll}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
              enrolled
                ? 'bg-emeralddeep-600 text-white'
                : 'bg-electric-500 text-white hover:bg-electric-600'
            }`}
          >
            {enrolled ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Enrolled on iGOT</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Enroll on iGOT</span>
              </>
            )}
          </button>

          {onTakeQuizForCourse && (
            <button
              onClick={() => onTakeQuizForCourse(course.competency_id, course.competency_name || '')}
              className="py-2 px-3 rounded-lg bg-sand-100 text-slatenavy-900 hover:bg-sand-200 border border-slatecool-200 text-xs font-semibold"
              title="Test Competency Directly"
            >
              Test Skill
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
