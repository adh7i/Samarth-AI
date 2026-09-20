/**
 * StatSamarth AI - Navbar Component
 */

window.Navbar = function Navbar({ currentUser, users, onSelectUser, aparSynced, gapCount, onOpenApar }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slatecool-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* National Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slatenavy-900 flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-electric-500/20">
            🏛️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-slatenavy-900 tracking-tight">
                StatSamarth <span className="text-electric-500">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                MoSPI Official
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-electric-100 text-electric-700">
                Prototype
              </span>
            </div>
            <p className="text-xs text-slatenavy-900/60 font-medium">
              Integrated with iGOT Karmayogi FRAC Framework
            </p>
          </div>
        </div>

        {/* APAR Badge & Officer Switcher */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenApar}
            className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              aparSynced
                ? 'bg-emeralddeep-50 text-emeralddeep-700 border-emeralddeep-200 hover:bg-emeralddeep-100'
                : 'bg-crimsonsoft-50 text-crimsonsoft-600 border-crimsonsoft-200 hover:bg-crimsonsoft-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${aparSynced ? 'bg-emeralddeep-600 animate-pulse' : 'bg-crimsonsoft-600'}`}></span>
            <span className="font-mono">{currentUser.apar_id}</span>
            <span>•</span>
            <span>{aparSynced ? 'iGOT Synced' : `${gapCount} Gaps Pending`}</span>
          </button>

          <div className="flex items-center space-x-2 bg-sand-100 px-3 py-1.5 rounded-lg border border-slatecool-200">
            <span className="text-xs font-bold text-electric-500">👤</span>
            <div>
              <select
                value={currentUser.id}
                onChange={(e) => onSelectUser(e.target.value)}
                className="bg-transparent text-xs font-bold text-slatenavy-900 focus:outline-none cursor-pointer"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role_title.split('(')[0].trim()})</option>
                ))}
              </select>
              <div className="text-[10px] text-slate-500 font-medium">{currentUser.zone}</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
