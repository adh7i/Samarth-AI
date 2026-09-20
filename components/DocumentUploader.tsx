'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { LearningMaterial } from '@/lib/types';

interface DocumentUploaderProps {
  onDocumentUploaded: (material: LearningMaterial) => void;
  onGenerateQuizForDoc: (material: LearningMaterial) => void;
  existingMaterials: LearningMaterial[];
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentUploaded,
  onGenerateQuizForDoc,
  existingMaterials,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [category, setCategory] = useState('Official Survey Manual');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset Sample Official Statistical Manual Texts for quick demo
  const sampleManuals = [
    {
      title: 'MoSPI Guidelines on Non-Sampling Errors in Field Surveys (2025)',
      category: 'Quality Audit & Field Methods',
      content: `Non-sampling errors in MoSPI sample surveys encompass response errors, non-response biases, and processing inaccuracies. 
      Enumerators must follow the standard respondent-recall protocols for 30-day reference periods. 
      In household surveys, if a respondent refuses to provide consumption data, class-mean imputation using adjacent sample households in the same Second Stage Stratum (SSS) must be utilized. 
      Outliers detected in reported per capita expenditure (> 3 standard deviations from the stratum median) must be flagged for supervisory re-verification within 48 hours of tablet upload.`
    },
    {
      title: 'Compilation Protocols for Services Sector Production Index (SPPI)',
      category: 'Economic Statistics',
      content: `The Services Sector Production Index (SPPI) tracks output volume across Transportation, Telecommunication, and Banking services.
      Elementary indices are compiled using the Fisher Ideal Index formula to balance quantity relatives with revenue weights.
      For banking services, FISIM deflators are applied against commercial lending margins. 
      Data sources include Reserve Bank of India regulatory filings and Telecom Regulatory Authority of India subscriber statistics.`
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDocContent(text);
    };
    reader.readAsText(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;

    setUploading(true);
    setUploadSuccess(null);

    try {
      const res = await fetch('/api/v1/rag/upload-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle,
          content: docContent,
          category,
          fileName: `${docTitle.toLowerCase().replace(/\s+/g, '_')}.txt`
        })
      });

      const data = await res.json();
      if (data.success) {
        setUploadSuccess(`Indexed into vector namespace '${data.material.vector_namespace}' with ${data.chunks_indexed} chunks!`);
        onDocumentUploaded(data.material);
        setDocTitle('');
        setDocContent('');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error processing document');
    } finally {
      setUploading(false);
    }
  };

  const handleLoadSample = (sample: typeof sampleManuals[0]) => {
    setDocTitle(sample.title);
    setCategory(sample.category);
    setDocContent(sample.content);
  };

  return (
    <div className="space-y-6">
      
      {/* Upload Zone Container */}
      <div className="bg-white rounded-xl border border-slatecool-200 p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slatenavy-900 flex items-center space-x-2">
              <UploadCloud className="w-5 h-5 text-electric-500" />
              <span>MoSPI Statistical Manual Ingestion (RAG Pipeline)</span>
            </h3>
            <p className="text-xs text-slatenavy-900/60 mt-0.5">
              Upload official manuals (NSSO, CPI, IIP, NAS) to chunk, embed, and generate verified MCQs with exact source citations.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sand-100 text-slatenavy-900 border border-slatecool-200">
            Vector Store Ready
          </span>
        </div>

        {/* Quick Demo Preloader */}
        <div className="mb-4 p-3 bg-sand-50 rounded-lg border border-sand-200">
          <div className="text-xs font-bold text-slatenavy-900 mb-1.5 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-electric-500" />
            <span>Load Quick MoSPI Sample Manual:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleManuals.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(s)}
                className="text-xs px-2.5 py-1 rounded-md bg-white border border-slatecool-300 text-slatenavy-900 hover:border-electric-500 hover:text-electric-600 transition-colors shadow-sm"
              >
                + {s.title.substring(0, 38)}...
              </button>
            ))}
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-electric-500 bg-electric-50/50'
                : 'border-slatecool-300 hover:border-electric-500 bg-sand-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <UploadCloud className="w-10 h-10 text-electric-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-slatenavy-900">
              Drag & Drop Statistical Manual PDF / TXT
            </div>
            <p className="text-xs text-slatenavy-900/60 mt-1">
              Supports NSSO Round Guidelines, CPI Methodologies, IIP Handbooks, and National Accounts manuals
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slatenavy-900 mb-1">
                Document Title / Manual Name *
              </label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g., NSSO 81st Round Domestic Tourism Survey Manual"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slatecool-200 bg-white text-slatenavy-900 focus:outline-none focus:ring-2 focus:ring-electric-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slatenavy-900 mb-1">
                Subject Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slatecool-200 bg-white text-slatenavy-900 focus:outline-none focus:ring-2 focus:ring-electric-500"
              >
                <option value="Sampling & Field Methods">Sampling & Field Methods (NSSO FOD)</option>
                <option value="Price Statistics">Price Statistics (CPI / WPI)</option>
                <option value="Industrial Statistics">Industrial Statistics (IIP / ASI)</option>
                <option value="Macroeconomic Aggregates">Macroeconomic Aggregates (NAS / GVA)</option>
                <option value="Quality Audit & Field Methods">Quality Audit & Non-Sampling Errors</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slatenavy-900 mb-1">
                Manual Extract / Content for Vector Chunking *
              </label>
              <textarea
                rows={4}
                required
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Paste official manual sections, survey chapters, formulas, or operational guidelines..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slatecool-200 bg-white text-slatenavy-900 focus:outline-none focus:ring-2 focus:ring-electric-500 font-mono"
              />
            </div>
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-emeralddeep-50 border border-emeralddeep-200 text-emeralddeep-700 rounded-lg text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emeralddeep-600 flex-shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !docTitle || !docContent}
              className="px-4 py-2 rounded-lg bg-electric-500 text-white text-xs font-bold hover:bg-electric-600 transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-sm"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Chunking & Embedding Vectors...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ingest & Index Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Pre-Loaded Official MoSPI Manuals Library */}
      <div className="bg-white rounded-xl border border-slatecool-200 p-6 shadow-card">
        <h4 className="text-sm font-bold text-slatenavy-900 mb-3 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-slatenavy-900" />
            <span>Indexed Official MoSPI Manuals ({existingMaterials.length})</span>
          </span>
          <span className="text-xs text-slate-500 font-normal">
            Ready for instant MCQ Generation
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {existingMaterials.map((mat) => (
            <div
              key={mat.id}
              className="p-3.5 rounded-lg border border-slatecool-200 bg-sand-50/40 hover:bg-white hover:border-electric-500 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sand-200 text-slatenavy-900">
                    {mat.category || 'MoSPI Manual'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {mat.file_size || '3.2 MB'}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-slatenavy-900 mt-2 line-clamp-2 group-hover:text-electric-600 transition-colors">
                  {mat.title}
                </h5>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  {mat.summary || 'Official procedural guide for Indian Statistical Service cadres.'}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slatecool-200 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  ns: {mat.vector_namespace}
                </span>
                <button
                  onClick={() => onGenerateQuizForDoc(mat)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-electric-500 hover:text-electric-600"
                >
                  <span>Generate MCQs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
