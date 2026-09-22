import React from 'react';
import { notFound } from 'next/navigation';
import { ExternalLink, CheckCircle, Clock, Star, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function IGotMockCoursePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const id = searchParams.id as string;
  const title = searchParams.title as string || 'iGOT Karmayogi Course';
  const provider = searchParams.provider as string || 'Karmayogi Bharat';

  if (!id) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Mock iGOT Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Fake iGOT Logo */}
            <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">iGOT</span>
            </div>
            <div>
              <div className="font-bold text-slate-800 leading-none">कर्मयोगी भारत</div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide">KARMAYOGI BHARAT</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm font-medium text-slate-600">
            <span className="hidden sm:inline-block hover:text-orange-600 cursor-pointer transition-colors">Explore</span>
            <span className="hidden sm:inline-block hover:text-orange-600 cursor-pointer transition-colors">Dashboard</span>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
              AV
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to अध्ययन Dashboard</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Banner */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-orange-600 to-amber-500 relative">
            <div className="absolute bottom-4 left-4 sm:left-8 flex items-center space-x-2 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>Available</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Course ID: {id}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                  {title}
                </h1>
                <p className="text-sm text-slate-600 mb-6">
                  Offered by: <strong className="text-slate-800">{provider}</strong>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-8 pb-8 border-b border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span className="font-semibold text-slate-800">4.8</span>
                    <span className="text-slate-400">(1.2k reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Self-paced</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>5,400+ enrolled</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3">About this course</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                    This is a simulated course page integrated with the अध्ययन (Adhyayan) platform for MoSPI officers. 
                    In a production environment, you would be accessing this course directly on the official iGOT Karmayogi portal. 
                    This training module covers key statistical methodologies, bridging identified FRAC competency gaps to meet official cadence requirements.
                  </p>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="w-full md:w-80 flex-shrink-0 bg-slate-50 rounded-xl p-6 border border-slate-100">
                <div className="mb-6">
                  <div className="text-xs text-slate-500 font-medium mb-1">Status</div>
                  <div className="flex items-center space-x-2 text-green-600 font-bold">
                    <CheckCircle className="w-5 h-5" />
                    <span>Enrolled</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Enrollment synced via FRAC engine</div>
                </div>

                <button className="w-full py-3 px-4 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors shadow-sm flex items-center justify-center space-x-2 mb-3">
                  <span>Start Learning</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="w-full py-2 px-4 rounded-lg bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
                  View Syllabus
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
