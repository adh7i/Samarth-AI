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
    <nav className="w-full bg-slatenavy-900 text-slate-200 border-b border-slatenavy-800 sticky top-16 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Navigation Items */}
        <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-electric-500 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:bg-slatenavy-800/80 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-electric-500'
                  }`}
                />
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
