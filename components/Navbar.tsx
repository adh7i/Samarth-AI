'use client';

import React from 'react';
import { Shield, Award, UserCheck, RefreshCw, Layers, LogOut } from 'lucide-react';
import { User } from '@/lib/types';

interface NavbarProps {
  currentUser: User | null;
  allUsers: User[];
  onSelectUser: (userId: string) => void;
  aparStatus?: {
    synced: boolean;
    last_sync: string | null;
    apar_id: string;
    pending_updates: number;
  };
  onOpenAparExport?: () => void;
  onDeleteAccount?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  aparStatus,
  onOpenAparExport,
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slatecool-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & National Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slatenavy-900 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-electric-500/20">
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slatenavy-900 tracking-tight">
                  StatSamarth <span className="text-electric-500">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  MoSPI Official
                </span>
              </div>
              <p className="text-xs text-slatenavy-900/60 font-medium">
                Integrated with iGOT Karmayogi FRAC Framework
              </p>
            </div>
          </div>

          {/* APAR & Officer Switcher */}
          <div className="flex items-center space-x-4">
            
            {/* APAR Status Badge */}
            {aparStatus && (
              <div
                onClick={onOpenAparExport}
                className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                  aparStatus.synced
                    ? 'bg-emeralddeep-50 text-emeralddeep-700 border-emeralddeep-200 hover:bg-emeralddeep-100'
                    : 'bg-crimsonsoft-50 text-crimsonsoft-600 border-crimsonsoft-200 hover:bg-crimsonsoft-100'
                }`}
                title="Click to view official APAR Dossier"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    aparStatus.synced ? 'bg-emeralddeep-600 animate-pulse' : 'bg-crimsonsoft-600'
                  }`}
                />
                <span className="font-mono">{aparStatus.apar_id}</span>
                <span>•</span>
                <span>
                  {aparStatus.synced 
                    ? 'iGOT Synced' 
                    : aparStatus.unassessed_count > 0 
                      ? `${aparStatus.unassessed_count} Assessments Pending`
                      : `${aparStatus.pending_updates} Gaps Pending`}
                </span>
              </div>
            )}

            {/* Officer Profile Switcher */}
            <div className="flex items-center space-x-2 bg-sand-100 px-3 py-1.5 rounded-lg border border-slatecool-200">
              <UserCheck className="w-4 h-4 text-electric-500" />
              <div className="text-left">
                <label htmlFor="user-select" className="sr-only">Switch MoSPI Officer Profile</label>
                <select
                  id="user-select"
                  value={currentUser?.id || ''}
                  onChange={(e) => onSelectUser(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slatenavy-900 focus:outline-none cursor-pointer"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role_title.split('(')[0].trim()})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-slatenavy-900/60 font-medium">
                  {currentUser?.zone}
                </div>
              </div>
            </div>

            {/* Actions: Sign Out & Delete */}
            <div className="flex items-center space-x-2">
              {onLogout && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to sign out?')) {
                      onLogout();
                    }
                  }}
                  title="Sign out"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sand-100 border border-slatecool-200 text-xs font-semibold text-slatenavy-900 hover:bg-slatecool-200 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
              {onDeleteAccount && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to permanently delete this account? This action cannot be undone.')) {
                      onDeleteAccount();
                    }
                  }}
                  title="Delete Account"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-crimsonsoft-200 bg-crimsonsoft-50 text-xs font-semibold text-crimsonsoft-600 hover:bg-crimsonsoft-100 transition-all"
                >
                  <span className="hidden xl:inline">Delete Account</span>
                  <span className="xl:hidden">Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
