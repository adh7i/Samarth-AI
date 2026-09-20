'use client';

import React, { useState, useEffect } from 'react';
import {
  Quiz,
  MCQQuestion,
  QuizAttempt,
  User
} from '@/lib/types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizRunnerProps {
  quiz: Quiz;
  user: User;
  onAssessmentCompleted: (attempt: QuizAttempt, score: number, passed: boolean) => void;
  onExit: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  quiz,
  user,
  onAssessmentCompleted,
  onExit,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, 'A' | 'B' | 'C' | 'D'>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState((quiz.time_limit_mins || 15) * 60);

  const questions = quiz.questions_json;
  const currentQ: MCQQuestion = questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (results) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [results]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (results) return; // Locked if submitted
    const updated = new Map(userAnswers);
    updated.set(currentQ.id, key);
    setUserAnswers(updated);
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);

    const formattedAnswers = questions.map((q) => ({
      question_id: q.id,
      selected_key: userAnswers.get(q.id) || 'NONE'
    }));

    try {
      const res = await fetch('/api/v1/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          quiz_id: quiz.id,
          answers: formattedAnswers
        })
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        onAssessmentCompleted(data.data.attempt, data.data.score_percentage, data.data.passed);

        if (data.data.passed) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        alert(data.error || 'Failed to submit quiz');
      }
    } catch (err: any) {
      alert(err.message || 'Error processing answers');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Quiz Top Header Bar */}
      <div className="bg-white rounded-xl border border-slatecool-200 p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-electric-100 text-electric-700">
              Bloom Level: {quiz.blooms_level}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Pass Mark: {quiz.pass_percentage || 70}%
            </span>
          </div>
          <h2 className="text-base font-bold text-slatenavy-900 mt-1">
            {quiz.title}
          </h2>
        </div>

        {/* Timer & Officer Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-sand-100 px-3 py-1.5 rounded-lg border border-slatecool-200 text-xs font-mono font-bold text-slatenavy-900">
            <Clock className={`w-4 h-4 ${timeLeft < 180 ? 'text-crimsonsoft-600 animate-pulse' : 'text-electric-500'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={onExit}
            className="text-xs font-semibold text-slate-500 hover:text-slatenavy-900 px-2 py-1"
          >
            Exit Assessment
          </button>
        </div>
      </div>

      {!results ? (
        /* Test-Taking Active Screen */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Question Panel (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slatecool-200 p-6 shadow-card space-y-6">
            
            <div className="flex items-center justify-between border-b border-slatecool-200 pb-3">
              <span className="text-xs font-bold text-electric-600">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {userAnswers.has(currentQ.id) ? '✓ Answered' : 'Pending Choice'}
              </span>
            </div>

            {/* Question Text */}
            <div className="text-sm sm:text-base font-bold text-slatenavy-900 leading-relaxed">
              {currentQ.question}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option) => {
                const isSelected = userAnswers.get(currentQ.id) === option.key;
                return (
                  <div
                    key={option.key}
                    onClick={() => handleSelectOption(option.key)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'border-electric-500 bg-electric-50/70 text-slatenavy-900 shadow-sm'
                        : 'border-slatecool-200 hover:border-slatecool-300 bg-sand-50/20 text-slatenavy-900'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-electric-500 text-white'
                          : 'bg-slatecool-200 text-slate-700'
                      }`}
                    >
                      {option.key}
                    </div>
                    <div className="text-xs sm:text-sm font-medium pt-0.5 leading-normal">
                      {option.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slatecool-200">
              <button
                onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                disabled={currentIdx === 0}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slatecool-100 disabled:opacity-30"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((p) => Math.min(questions.length - 1, p + 1))}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slatenavy-900 text-white text-xs font-bold hover:bg-slatenavy-800 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-electric-500 text-white text-xs font-bold hover:bg-electric-600 transition-colors shadow-hover"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Evaluating...' : 'Submit Assessment'}</span>
                </button>
              )}
            </div>

          </div>

          {/* Question Matrix Navigator (1 col) */}
          <div className="bg-white rounded-xl border border-slatecool-200 p-4 shadow-card h-fit space-y-4">
            <h4 className="text-xs font-bold text-slatenavy-900">
              Question Navigator
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = userAnswers.has(q.id);
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'ring-2 ring-electric-500 ring-offset-2 bg-slatenavy-900 text-white'
                        : isAnswered
                        ? 'bg-emeralddeep-50 text-emeralddeep-700 border border-emeralddeep-300'
                        : 'bg-sand-100 text-slate-600 hover:bg-slatecool-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slatecool-200 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-emeralddeep-100 border border-emeralddeep-300" />
                <span>Answered ({userAnswers.size})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-sand-100" />
                <span>Unanswered ({questions.length - userAnswers.size})</span>
              </div>
            </div>

            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="w-full mt-2 py-2 rounded-lg bg-electric-500 text-white text-xs font-bold hover:bg-electric-600 transition-colors shadow-sm"
            >
              Submit Now
            </button>
          </div>

        </div>
      ) : (
        /* Results & Explanations Screen with Citations */
        <div className="space-y-6">
          
          {/* Result Banner */}
          <div
            className={`rounded-2xl p-6 border shadow-card flex flex-col sm:flex-row items-center justify-between gap-6 ${
              results.passed
                ? 'bg-emeralddeep-50/80 border-emeralddeep-200'
                : 'bg-crimsonsoft-50/80 border-crimsonsoft-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  results.passed
                    ? 'bg-emeralddeep-600 text-white shadow-lg'
                    : 'bg-crimsonsoft-600 text-white shadow-lg'
                }`}
              >
                {results.passed ? <Award className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-extrabold text-slatenavy-900">
                    {results.passed ? 'Assessment Passed!' : 'Assessment Not Met'}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      results.passed
                        ? 'bg-emeralddeep-600 text-white'
                        : 'bg-crimsonsoft-600 text-white'
                    }`}
                  >
                    Score: {results.score_percentage}%
                  </span>
                </div>
                <p className="text-xs text-slatenavy-900/70 mt-1">
                  {results.passed
                    ? 'Official FRAC benchmark successfully achieved. Competency score elevated.'
                    : 'Did not meet 70% threshold. Review detailed source manual citations below.'}
                </p>
              </div>
            </div>

            {/* Competency Advancement Pill */}
            {results.competency_advancement && (
              <div className="p-3 bg-white rounded-xl border border-emeralddeep-300 shadow-sm text-xs">
                <div className="text-[11px] font-bold text-emeralddeep-700 uppercase tracking-wider">
                  ✓ Competency Level Upgraded
                </div>
                <div className="font-bold text-slatenavy-900 mt-0.5">
                  {results.competency_advancement.competency_name}
                </div>
                <div className="text-emeralddeep-700 font-bold mt-1">
                  Level {results.competency_advancement.old_level} → Level {results.competency_advancement.new_level} (Mastery)
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slatenavy-900">
              Detailed Questions & Source Citations Review
            </h3>
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-lg bg-slatenavy-900 text-white text-xs font-semibold hover:bg-slatenavy-800"
            >
              Return to FRAC Dashboard
            </button>
          </div>

          {/* Detailed Question Review Cards */}
          <div className="space-y-4">
            {results.detailed_results.map((res: any, idx: number) => (
              <div
                key={res.question_id}
                className={`bg-white rounded-xl border p-5 shadow-card ${
                  res.is_correct ? 'border-emeralddeep-200' : 'border-crimsonsoft-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center space-x-2">
                    {res.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emeralddeep-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-crimsonsoft-600 flex-shrink-0" />
                    )}
                    <span className="font-bold text-xs text-slatenavy-900">
                      Question {idx + 1}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sand-100 font-mono text-slate-600">
                      Bloom: {res.blooms_level}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      res.is_correct
                        ? 'bg-emeralddeep-50 text-emeralddeep-700'
                        : 'bg-crimsonsoft-50 text-crimsonsoft-600'
                    }`}
                  >
                    {res.is_correct ? 'Correct' : 'Incorrect Choice'}
                  </span>
                </div>

                <div className="text-sm font-semibold text-slatenavy-900 mb-3 pl-7">
                  {res.question}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pl-7 mb-3">
                  <div className={`p-2 rounded-lg ${res.is_correct ? 'bg-emeralddeep-50 text-emeralddeep-800 font-semibold' : 'bg-crimsonsoft-50 text-crimsonsoft-800'}`}>
                    Your Answer: <strong>Option {res.selected_key || 'Skipped'}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-sand-100 text-slatenavy-900 font-semibold border border-slatecool-200">
                    Correct Official Key: <strong>Option {res.correct_key}</strong>
                  </div>
                </div>

                {/* Explanation */}
                <div className="pl-7 pt-2 border-t border-slatecool-100 space-y-2">
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong>Methodological Explanation: </strong>
                    {res.explanation}
                  </div>

                  {/* Exact Source Citation */}
                  {res.source_citation && (
                    <div className="p-2.5 bg-sand-50 rounded-lg border border-sand-200 text-[11px] text-slatenavy-900 space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-electric-700">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Source Manual Citation:</span>
                      </div>
                      <div className="font-semibold text-slatenavy-900">
                        {res.source_citation.manual_title}
                      </div>
                      <div className="text-slate-600">
                        {res.source_citation.section} • {res.source_citation.page_or_para}
                      </div>
                      {res.source_citation.exact_quote && (
                        <div className="italic text-slate-500 bg-white/70 p-1.5 rounded border border-slatecool-200 mt-1">
                          "{res.source_citation.exact_quote}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
