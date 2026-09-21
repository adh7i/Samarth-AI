'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar, ActiveTab } from '@/components/Sidebar';
import { CompetencyRadar } from '@/components/CompetencyRadar';
import { SkillReadinessGauge } from '@/components/SkillReadinessGauge';
import { CompetencyGapTable } from '@/components/CompetencyGapTable';
import { DocumentUploader } from '@/components/DocumentUploader';
import { QuizGeneratorModal } from '@/components/QuizGeneratorModal';
import { QuizRunner } from '@/components/QuizRunner';
import { CourseCard } from '@/components/CourseCard';
import { ZonalHeatmap } from '@/components/ZonalHeatmap';
import { AparExportModal } from '@/components/AparExportModal';
import { StatBotWidget } from '@/components/StatBotWidget';
import {
  User,
  UserCompetencyProfileResponse,
  LearningMaterial,
  Quiz,
  QuizAttempt,
  IGotCourse
} from '@/lib/types';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  CheckCircle2,
  RefreshCw,
  FileQuestion,
  ExternalLink,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Home() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserCompetencyProfileResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncingApar, setIsSyncingApar] = useState(false);
  const [aparNotification, setAparNotification] = useState<string | null>(null);

  // Modal & Quiz states
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [selectedMaterialForGen, setSelectedMaterialForGen] = useState<LearningMaterial | null>(null);
  const [targetCompIdForGen, setTargetCompIdForGen] = useState<string | undefined>(undefined);
  const [targetCompNameForGen, setTargetCompNameForGen] = useState<string | undefined>(undefined);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isAparModalOpen, setIsAparModalOpen] = useState(false);

  // ── Auth Guard ──
  useEffect(() => {
    const storedId = sessionStorage.getItem('ss_user_id');
    if (!storedId) {
      router.replace('/login');
      return;
    }
    setLoggedInUserId(storedId);
    setIsAuthChecked(true);
  }, [router]);

  // Load initial officers and default profile
  useEffect(() => {
    if (!isAuthChecked) return;

    fetch('/api/v1/auth/login')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.available_officers?.length > 0) {
          setAllUsers(json.available_officers);
          // Prefer the session user; fall back to first officer
          const sessionMatch = json.available_officers.find((u: User) => u.id === loggedInUserId);
          const defaultUser = sessionMatch || json.available_officers[0];
          setCurrentUser(defaultUser);
          loadUserProfile(defaultUser.id);
        }
      })
      .catch((err) => console.error(err));

    fetch('/api/v1/rag/upload-document')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setMaterials(json.materials);
      })
      .catch((err) => console.error(err));
  }, [isAuthChecked]);

  // Fetch user profile and iGOT recommendations
  const loadUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      const [profRes, recRes] = await Promise.all([
        fetch(`/api/v1/competencies/user/${userId}`),
        fetch(`/api/v1/igot/recommendations/${userId}`)
      ]);

      const profJson = await profRes.json();
      const recJson = await recRes.json();

      if (profJson.success) {
        setProfile(profJson.data);
        setCurrentUser(profJson.data.user);
      }
      if (recJson.success) {
        setRecommendations(recJson.data.recommendations);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    const selected = allUsers.find((u) => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
      loadUserProfile(selected.id);
      setActiveQuiz(null); // Reset any ongoing quiz
    }
  };

  const handleSyncApar = async () => {
    if (!currentUser || isSyncingApar) return;
    setIsSyncingApar(true);

    try {
      const res = await fetch('/api/v1/igot/sync-apar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });

      const json = await res.json();
      if (json.success) {
        setAparNotification(`e-APAR Passbook Synchronized! Transaction Hash: ${json.data.transaction_hash.slice(0, 16)}...`);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.2 } });
        // Refresh profile state
        loadUserProfile(currentUser.id);
        setTimeout(() => setAparNotification(null), 7000);
      } else {
        alert(json.error || 'Sync failed');
      }
    } catch (err: any) {
      alert(err.message || 'APAR sync error');
    } finally {
      setIsSyncingApar(false);
    }
  };

  // Bridge gap action from table or course
  const handleOpenAssessmentForCompetency = (competencyId: string, competencyName: string) => {
    setTargetCompIdForGen(competencyId);
    setTargetCompNameForGen(competencyName);

    // Pick relevant default material based on competency
    let matchedMaterial = materials[0];
    if (competencyId === 'comp_02') {
      matchedMaterial = materials.find((m) => m.vector_namespace.includes('cpi')) || materials[0];
    } else if (competencyId === 'comp_01') {
      matchedMaterial = materials.find((m) => m.vector_namespace.includes('nsso')) || materials[0];
    } else if (competencyId === 'comp_04') {
      matchedMaterial = materials.find((m) => m.vector_namespace.includes('nas')) || materials[0];
    }

    setSelectedMaterialForGen(matchedMaterial);
    setIsGenModalOpen(true);
  };

  const handleDocumentUploaded = (newMaterial: LearningMaterial) => {
    setMaterials((prev) => [newMaterial, ...prev]);
    setSelectedMaterialForGen(newMaterial);
    setIsGenModalOpen(true);
  };

  const handleGenerateQuizForDoc = (material: LearningMaterial) => {
    setSelectedMaterialForGen(material);
    setTargetCompIdForGen(undefined);
    setTargetCompNameForGen(undefined);
    setIsGenModalOpen(true);
  };

  const handleQuizReady = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setActiveTab('assessment');
  };

  const handleAssessmentCompleted = (attempt: QuizAttempt, score: number, passed: boolean) => {
    if (currentUser) {
      loadUserProfile(currentUser.id);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ss_user_id');
    sessionStorage.removeItem('ss_user_name');
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/v1/auth/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.removeItem('ss_user_id');
        sessionStorage.removeItem('ss_user_name');
        router.push('/login?mode=signup');
      } else {
        alert(data.error || 'Failed to delete account');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting account');
    }
  };

  // Show nothing while auth check is in-flight (avoids flash of content)
  if (!isAuthChecked) return null;

  return (
    <div className="min-h-screen flex flex-col bg-sand-100 font-sans">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        aparStatus={profile?.apar_status}
        onOpenAparExport={() => setIsAparModalOpen(true)}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Synchronized Notification Banner */}
      {aparNotification && (
        <div className="bg-emeralddeep-600 text-white px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center space-x-2 shadow-md animate-fadeIn">
          <ShieldCheck className="w-4 h-4 text-emeralddeep-200" />
          <span>{aparNotification}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* 2. Slate Navy Dark Navigation (Now Topbar) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'assessment') setActiveQuiz(null);
          }}
          gapCount={profile?.gap_count || 0}
          unassessedCount={profile?.unassessed_count || 0}
          courseCount={recommendations.length}
          manualCount={materials.length}
        />

        {/* 3. Dynamic Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {loading && !profile ? (
            <div className="bg-white rounded-xl p-12 text-center text-xs text-slate-500 border border-slatecool-200 shadow-soft">
              <RefreshCw className="w-6 h-6 animate-spin text-electric-500 mx-auto mb-2" />
              <span>Loading official MoSPI statistical records and FRAC competency mapping...</span>
            </div>
          ) : (
            <>
              {/* Officer Role Profile Banner */}
              {currentUser && (
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-slatenavy-900 text-white flex items-center justify-center font-extrabold text-lg shadow-md border-2 border-electric-500/30">
                      {currentUser.name.split(' ')[0][0]}{currentUser.name.split(' ')[1]?.[0] || 'S'}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-lg font-bold text-slatenavy-900">
                          {currentUser.name}
                        </h1>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-electric-50 text-electric-600 font-semibold border border-electric-200">
                          {currentUser.role_title}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center space-x-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{currentUser.department || 'MoSPI HQ, New Delhi'}</span>
                        </span>
                        <span>•</span>
                        <span>{currentUser.zone}</span>
                        <span>•</span>
                        <span className="font-mono text-slatenavy-900 font-semibold">
                          APAR ID: {currentUser.apar_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto">
                    <button
                      onClick={handleSyncApar}
                      disabled={isSyncingApar}
                      className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-electric-500 text-white text-xs font-bold hover:bg-electric-600 transition-colors shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingApar ? 'animate-spin' : ''}`} />
                      <span>{isSyncingApar ? 'Pushing to iGOT...' : 'Sync APAR Passbook'}</span>
                    </button>
                    <button
                      onClick={() => setIsAparModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-sand-100 text-slatenavy-900 hover:bg-sand-200 text-xs font-semibold border border-slatecool-200"
                      title="View Official MoSPI APAR Dossier"
                    >
                      View Dossier
                    </button>
                  </div>
                </div>
              )}

              {/* MODULE A: FRAC Competency Gap & Radar Dashboard */}
              {activeTab === 'dashboard' && profile && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Top Analytics Row: Radar Chart + Skill Readiness Gauge */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Visual Skill Radar Chart (7 cols) */}
                    <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h2 className="text-base font-bold text-slatenavy-900 flex items-center space-x-2">
                            <span>FRAC Skill Radar Matrix</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-sand-100 text-slate-700 font-normal border border-slatecool-200">
                              Domain • Behavioral • Technical
                            </span>
                          </h2>
                          <p className="text-xs text-slatenavy-900/60 mt-0.5">
                            Comparing Current Assessed Level vs. Required Official MoSPI FRAC Level
                          </p>
                        </div>
                      </div>

                      <CompetencyRadar data={profile.radar_data} />

                      <div className="pt-3 border-t border-slatecool-200 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1.5">
                            <span className="w-3 h-3 rounded-full bg-electric-500" />
                            <span className="font-semibold text-slatenavy-900">Current Level (1-5)</span>
                          </span>
                          <span className="flex items-center space-x-1.5">
                            <span className="w-3 h-3 rounded-full bg-slatenavy-900" />
                            <span className="font-semibold text-slatenavy-900">Required Benchmark</span>
                          </span>
                        </div>
                        <span className="text-electric-600 font-bold">10 Key Competencies Mapped</span>
                      </div>
                    </div>

                    {/* Skill Readiness Index Gauge (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                      <SkillReadinessGauge
                        readinessIndex={profile.readiness_index}
                        totalCompetencies={profile.total_competencies}
                        verifiedCount={profile.verified_competencies}
                        gapCount={profile.gap_count}
                        unassessedCount={profile.unassessed_count}
                        onSyncApar={handleSyncApar}
                        isSyncing={isSyncingApar}
                      />

                      {/* Quick AI Action Card */}
                      <div className="mt-4 bg-gradient-to-r from-slatenavy-900 to-slatenavy-800 text-white rounded-xl p-5 shadow-md border border-slatenavy-700 flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-electric-400 uppercase tracking-wider mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Competency Engine</span>
                          </div>
                          <h4 className="text-sm font-bold">Bridge Identified Gaps with RAG</h4>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Generate targeted MCQs directly from MoSPI manuals to elevate skill levels.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedMaterialForGen(materials[0]);
                            setIsGenModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-electric-500 text-white text-xs font-bold hover:bg-electric-600 transition-colors flex-shrink-0 shadow-md"
                        >
                          Launch RAG
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Interactive FRAC Gap Table */}
                  <CompetencyGapTable
                    gaps={profile.gaps}
                    onTakeAssessment={handleOpenAssessmentForCompetency}
                    onViewCourse={() => setActiveTab('recommender')}
                  />

                </div>
              )}

              {/* MODULE B: AI Assessment & MCQ Generator (RAG Pipeline) */}
              {activeTab === 'assessment' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {activeQuiz && currentUser ? (
                    <QuizRunner
                      quiz={activeQuiz}
                      user={currentUser}
                      onAssessmentCompleted={handleAssessmentCompleted}
                      onExit={() => setActiveQuiz(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slatecool-200 shadow-card">
                        <div>
                          <h2 className="text-base font-bold text-slatenavy-900 flex items-center space-x-2">
                            <FileQuestion className="w-5 h-5 text-electric-500" />
                            <span>AI Assessment & RAG MCQ Generator</span>
                          </h2>
                          <p className="text-xs text-slatenavy-900/60 mt-0.5">
                            Synthesize questions across Bloom's Taxonomy (Remember, Apply, Analyze) with citations
                          </p>
                        </div>
                        <button
                          onClick={() => setIsGenModalOpen(true)}
                          className="px-4 py-2 rounded-xl bg-electric-500 text-white text-xs font-bold hover:bg-electric-600 transition-colors shadow-sm flex items-center space-x-1.5"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Custom Assessment</span>
                        </button>
                      </div>

                      {/* Document Uploader & Preset Manuals */}
                      <DocumentUploader
                        onDocumentUploaded={handleDocumentUploaded}
                        onGenerateQuizForDoc={handleGenerateQuizForDoc}
                        existingMaterials={materials}
                      />
                    </>
                  )}

                </div>
              )}

              {/* MODULE C: iGOT Karmayogi Recommender Engine */}
              {activeTab === 'recommender' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  <div className="bg-white rounded-xl p-6 border border-slatecool-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-electric-600 uppercase tracking-wider mb-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>Karmayogi Bharat Course Recommendation Pipeline</span>
                      </div>
                      <h2 className="text-base font-bold text-slatenavy-900">
                        Semantic Skill Gap Matching ({recommendations.length} Courses Found)
                      </h2>
                      <p className="text-xs text-slatenavy-900/60 mt-0.5">
                        Matched against your missing FRAC competencies and official cadre training targets
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleSyncApar}
                        disabled={isSyncingApar}
                        className="px-4 py-2 rounded-xl bg-slatenavy-900 text-white text-xs font-bold hover:bg-slatenavy-800 transition-colors flex items-center space-x-1.5 shadow-sm"
                      >
                        <Award className="w-4 h-4 text-electric-500" />
                        <span>Sync Passbook to APAR</span>
                      </button>
                    </div>
                  </div>

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recommendations.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onTakeQuizForCourse={handleOpenAssessmentForCompetency}
                      />
                    ))}
                  </div>

                </div>
              )}

              {/* MODULE D: Admin & Zonal Capacity Analytics */}
              {activeTab === 'analytics' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-xl p-5 border border-slatecool-200 shadow-card">
                    <h2 className="text-base font-bold text-slatenavy-900">
                      MoSPI Training Directorate: Zonal Capacity Analytics
                    </h2>
                    <p className="text-xs text-slatenavy-900/60 mt-0.5">
                      National overview across North, East, South, West, and Central statistical headquarters
                    </p>
                  </div>

                  <ZonalHeatmap onOpenAparExport={() => setIsAparModalOpen(true)} />
                </div>
              )}

              {/* OFFICIAL MANUALS LIBRARY */}
              {activeTab === 'manuals' && (
                <div className="space-y-6 animate-fadeIn">
                  <DocumentUploader
                    onDocumentUploaded={handleDocumentUploaded}
                    onGenerateQuizForDoc={handleGenerateQuizForDoc}
                    existingMaterials={materials}
                  />
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* MODULE E: "StatBot" AI Floating Conversational Assistant */}
      <StatBotWidget />

      {/* Assessment Generator Modal */}
      <QuizGeneratorModal
        isOpen={isGenModalOpen}
        onClose={() => setIsGenModalOpen(false)}
        materials={materials}
        selectedMaterial={selectedMaterialForGen}
        onQuizReady={handleQuizReady}
        preselectedCompetencyId={targetCompIdForGen}
        preselectedCompetencyName={targetCompNameForGen}
      />

      {/* Official APAR Export Modal */}
      <AparExportModal
        isOpen={isAparModalOpen}
        onClose={() => setIsAparModalOpen(false)}
        userId={currentUser?.id}
      />

    </div>
  );
}
