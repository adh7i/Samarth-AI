'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileQuestion,
  GraduationCap,
  BarChart3,
  FileText,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'assessment' | 'recommender' | 'analytics' | 'manuals';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  gapCount?: number;
  unassessedCount?: number;
  courseCount?: number;
  manualCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  gapCount = 0,
  unassessedCount = 0,
  courseCount = 0,
  manualCount = 4,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'FRAC Radar & Gaps',
      subtext: 'Module A: Skill Readiness',
      icon: LayoutDashboard,
      badge: gapCount > 0 ? `${gapCount} Gaps` : unassessedCount > 0 ? `${unassessedCount} Pending` : 'Verified',
      badgeColor: gapCount > 0 ? 'bg-crimsonsoft-600 text-white' : unassessedCount > 0 ? 'bg-slatecool-600 text-white' : 'bg-emeralddeep-600 text-white',
    },
    {
      id: 'assessment' as ActiveTab,
      label: 'AI RAG Assessment',
      subtext: 'Module B: MCQ Generator',
      icon: FileQuestion,
      badge: 'Bloom 3.0',
      badgeColor: 'bg-electric-500/20 text-electric-500',
    },
    {
      id: 'recommender' as ActiveTab,
      label: 'iGOT Recommender',
      subtext: 'Module C: Karmayogi Courses',
      icon: GraduationCap,
      badge: 'Passbook',
      badgeColor: 'bg-emeralddeep-500/20 text-emeralddeep-500',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Zonal Capacity',
      subtext: 'Module D: Training Heatmap',
      icon: BarChart3,
      badge: 'MoSPI HQ',
      badgeColor: 'bg-slate-700 text-slate-300',
    },
    {
      id: 'manuals' as ActiveTab,
      label: 'Official Manuals',
      subtext: 'Knowledge Base & Vectors',
      icon: BookOpen,
      badge: `${manualCount} PDFs`,
      badgeColor: 'bg-slate-700 text-slate-300',
    }
  ];

  return (
    <aside className="w-64 bg-slatenavy-900 text-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-xl border-r border-slatenavy-800">
      <div>
        {/* Cadre Badge */}
        <div className="mb-6 px-3 py-2 bg-slatenavy-800/80 rounded-lg border border-slatenavy-800">
          <div className="flex items-center space-x-2 text-xs font-semibold text-electric-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Karmayogi FRAC Engine</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Statistical Cadre Competency Matrix
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-electric-500 text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:bg-slatenavy-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-electric-500'
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium leading-none mb-1">{item.label}</div>
                    <div
                      className={`text-[11px] leading-none ${
                        isActive ? 'text-white/80' : 'text-slate-400'
                      }`}
                    >
                      {item.subtext}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="mt-8 p-3 bg-slatenavy-800/50 rounded-xl border border-slatenavy-800 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-200">Framework V2.4</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emeralddeep-500" />
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Aligned with MoSPI ISS Cadre Capacity Building Guidelines & Karmayogi Bharat APAR specs.
        </p>
      </div>
    </aside>
  );
};
