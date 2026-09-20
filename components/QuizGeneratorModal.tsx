'use client';

import React, { useState } from 'react';
import { X, Sparkles, Sliders, BookOpen, Layers, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { BloomsTaxonomyLevel, LearningMaterial, Quiz } from '@/lib/types';

interface QuizGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: LearningMaterial[];
  selectedMaterial?: LearningMaterial | null;
  onQuizReady: (quiz: Quiz) => void;
  preselectedCompetencyId?: string;
  preselectedCompetencyName?: string;
}

export const QuizGeneratorModal: React.FC<QuizGeneratorModalProps> = ({
  isOpen,
  onClose,
  materials,
  selectedMaterial,
  onQuizReady,
  preselectedCompetencyId,
  preselectedCompetencyName,
}) => {
  const [materialId, setMaterialId] = useState(selectedMaterial?.id || materials[0]?.id || '');
  const [bloomsLevel, setBloomsLevel] = useState<BloomsTaxonomyLevel>('Apply');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [targetTopic, setTargetTopic] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch('/api/v1/rag/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_id: materialId,
          blooms_level: bloomsLevel,
          question_count: questionCount,
          competency_id: preselectedCompetencyId,
          target_topic: targetTopic || preselectedCompetencyName || ''
        })
      });

      const data = await res.json();
      if (data.success && data.quiz) {
        onQuizReady(data.quiz);
        onClose();
      } else {
        alert(data.error || 'Failed to generate assessment quiz');
      }
    } catch (err: any) {
      alert(err.message || 'Quiz generation error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slatenavy-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slatecool-200 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slatenavy-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-electric-500/20 flex items-center justify-center text-electric-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">MoSPI AI Assessment & MCQ Generator</h3>
              <p className="text-xs text-slate-300">
                RAG Pipeline aligned with iGOT Bloom's Taxonomy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slatenavy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleGenerate} className="p-6 space-y-5">
          
          {preselectedCompetencyName && (
            <div className="p-3 bg-electric-50 rounded-lg border border-electric-200 text-xs">
              <span className="font-bold text-electric-700">Target Competency Bridge: </span>
              <span className="text-slatenavy-900 font-semibold">{preselectedCompetencyName}</span>
            </div>
          )}

          {/* Source Document Selection */}
          <div>
            <label className="block text-xs font-bold text-slatenavy-900 mb-1.5 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-electric-500" />
              <span>Reference MoSPI Manual (RAG Knowledge Base) *</span>
            </label>
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slatecool-200 bg-sand-50/50 text-slatenavy-900 font-medium focus:ring-2 focus:ring-electric-500 focus:outline-none"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.category})
                </option>
              ))}
            </select>
          </div>

          {/* Bloom's Taxonomy Level Selector */}
          <div>
            <label className="block text-xs font-bold text-slatenavy-900 mb-2 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-electric-500" />
              <span>Bloom's Taxonomy Cognitive Level *</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  level: 'Remember' as BloomsTaxonomyLevel,
                  title: '1. Remember',
                  desc: 'Formulas, Base Years & Mandates',
                  color: 'hover:border-blue-400',
                },
                {
                  level: 'Apply' as BloomsTaxonomyLevel,
                  title: '2. Apply',
                  desc: 'Index Computations & Sampling Intervals',
                  color: 'hover:border-electric-500',
                },
                {
                  level: 'Analyze' as BloomsTaxonomyLevel,
                  title: '3. Analyze',
                  desc: 'Imputation Protocols & Outlier Audits',
                  color: 'hover:border-purple-400',
                },
              ].map((item) => {
                const isSelected = bloomsLevel === item.level;
                return (
                  <div
                    key={item.level}
                    onClick={() => setBloomsLevel(item.level)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-electric-500 bg-electric-50/60 shadow-sm'
                        : `border-slatecool-200 bg-white ${item.color}`
                    }`}
                  >
                    <div className="font-bold text-xs text-slatenavy-900">{item.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1 leading-tight">{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Count Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slatenavy-900 flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-electric-500" />
                <span>Question Count:</span>
              </label>
              <span className="text-xs font-extrabold text-electric-600 bg-electric-50 px-2 py-0.5 rounded border border-electric-200">
                {questionCount} Questions ({Math.round(questionCount * 2.5)} mins)
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              step={1}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full h-2 bg-slatecool-200 rounded-lg appearance-none cursor-pointer accent-electric-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>3 Qs (Sprint)</span>
              <span>5 Qs (Standard)</span>
              <span>10 Qs (In-depth)</span>
              <span>15 Qs (Comprehensive)</span>
            </div>
          </div>

          {/* Optional Topic Keyword Query */}
          <div>
            <label className="block text-xs font-bold text-slatenavy-900 mb-1">
              Focal Topic / Section Query (Optional)
            </label>
            <input
              type="text"
              value={targetTopic}
              onChange={(e) => setTargetTopic(e.target.value)}
              placeholder="e.g., Jevons Index vs Carli, FSU Selection, GVA FISIM"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slatecool-200 bg-sand-50/50 text-slatenavy-900 focus:ring-2 focus:ring-electric-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slatecool-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slatenavy-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating}
              className="px-5 py-2.5 rounded-xl bg-electric-500 text-white text-xs font-bold hover:bg-electric-600 transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-hover"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Retrieving Chunks & Synthesizing MCQs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Assessment</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
