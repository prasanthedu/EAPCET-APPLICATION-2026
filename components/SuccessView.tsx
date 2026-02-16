
import React from 'react';
import { Application } from '../types';

interface Props {
  application: Application;
  onReset: () => void;
  onOpenReceipt: () => void;
}

const SuccessView: React.FC<Props> = ({ application, onReset, onOpenReceipt }) => {
  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center">
        <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-lg">
          ✓
        </div>
        
        <h2 className="text-4xl font-black text-slate-900 mb-2">Registration Complete</h2>
        <p className="text-slate-500 font-medium mb-12">Your application has been received and indexed.</p>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 mb-12 relative overflow-hidden group">
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mb-4">Official Tracking ID</p>
          <p className="text-5xl md:text-6xl font-black text-white tracking-tighter font-mono">{application.registration_number}</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onOpenReceipt}
            className="w-full py-6 royal-gradient text-white rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-4"
          >
            <span>📄</span> View & Download Receipt
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button 
              onClick={onReset}
              className="py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              New Registration
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all"
            >
              Exit Portal
            </button>
          </div>
        </div>

        <p className="mt-8 text-[10px] text-slate-400 font-black uppercase tracking-widest">
          Expected Verification Time: 48-72 Hours
        </p>
      </div>
    </div>
  );
};

export default SuccessView;
