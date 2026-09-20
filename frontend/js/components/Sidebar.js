/**
 * StatSamarth AI - Sidebar Component (Slate Navy Dark #0F172A)
 */

window.Sidebar = function Sidebar({ activeTab, setActiveTab, gapCount, courseCount, manualCount }) {
  const navItems = [
    { id: 'dashboard', label: 'FRAC Radar & Gaps', sub: 'Module A: Skill Readiness', icon: '📊', badge: gapCount > 0 ? `${gapCount} Gaps` : 'Verified', badgeColor: gapCount > 0 ? 'bg-crimsonsoft-600 text-white' : 'bg-emeralddeep-600 text-white' },
    { id: 'assessment', label: 'AI RAG Assessment', sub: 'Module B: MCQ Generator', icon: '📝', badge: 'Bloom 3.0', badgeColor: 'bg-electric-500/20 text-electric-400' },
    { id: 'recommender', label: 'iGOT Recommender', sub: 'Module C: Karmayogi Courses', icon: '🎓', badge: `${courseCount} Courses`, badgeColor: 'bg-emeralddeep-500/20 text-emeralddeep-400' },
    { id: 'analytics', label: 'Zonal Capacity', sub: 'Module D: Regional Heatmap', icon: '🗺️', badge: '5 Zones', badgeColor: 'bg-slate-700 text-slate-300' },
    { id: 'manuals', label: 'Official Manuals', sub: 'Knowledge Base & Vectors', icon: '📚', badge: `${manualCount} PDFs`, badgeColor: 'bg-slate-700 text-slate-300' }
  ];

  return (
    <aside className="w-64 bg-slatenavy-900 text-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-xl border-r border-slatenavy-800">
      <div className="space-y-4">
        
        <div className="px-3 py-2 bg-slatenavy-800/80 rounded-lg border border-slatenavy-700 text-xs">
          <div className="font-bold text-electric-400 uppercase tracking-wider">Karmayogi FRAC Engine</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Statistical Cadre Capacity Matrix</div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all ${
                activeTab === item.id
                  ? 'bg-electric-500 text-white shadow-md font-semibold'
                  : 'text-slate-300 hover:bg-slatenavy-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <div className="text-sm font-medium leading-none mb-1">{item.label}</div>
                  <div className={`text-[11px] leading-none ${activeTab === item.id ? 'text-white/80' : 'text-slate-400'}`}>{item.sub}</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>{item.badge}</span>
            </button>
          ))}
        </nav>

      </div>

      <div className="p-3 bg-slatenavy-800/50 rounded-xl border border-slatenavy-800 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-200">Framework V2.4</span>
          <span className="w-2 h-2 rounded-full bg-emeralddeep-500"></span>
        </div>
        <p className="text-[11px] text-slate-400">MoSPI ISS Cadre Capacity Building Guidelines & Karmayogi Bharat APAR specs.</p>
      </div>
    </aside>
  );
};
