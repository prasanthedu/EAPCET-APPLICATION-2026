
import React from 'react';

interface HeaderProps {
  onAdminClick: () => void;
  isAdmin: boolean;
  setView: (view: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, isAdmin, setView }) => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass px-6 py-3 rounded-2xl shadow-lg border border-white/40 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('portal')}
        >
          <div className="w-9 h-9 royal-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-blue-900/20 shadow-lg group-hover:scale-105 transition-all">
            M
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight hidden sm:block">MPC Stack</span>
        </div>
        
        <nav className="flex items-center gap-2 sm:gap-6">
          <button 
            onClick={() => setView('status')}
            className="px-4 py-2 text-slate-600 hover:text-blue-700 font-semibold text-sm transition-colors rounded-lg hover:bg-slate-50"
          >
            Check Status
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <button 
            onClick={onAdminClick}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              isAdmin 
                ? 'bg-blue-50 text-blue-700' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg'
            }`}
          >
            {isAdmin ? 'Admin Panel' : 'Staff Access'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
