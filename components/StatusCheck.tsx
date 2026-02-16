
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Application } from '../types';

interface Props {
  onOpenReceipt: (app: Application) => void;
}

const StatusCheck: React.FC<Props> = ({ onOpenReceipt }) => {
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Application | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!regNo) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('registration_number', regNo.trim().toUpperCase())
        .single();

      if (fetchError) throw new Error('We couldn’t find an application with that ID.');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Track Application</h2>
        <p className="text-slate-400 font-medium mb-8">Enter your Registration ID to view live status.</p>
        
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="MPC26XXXXX"
            className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-2xl uppercase font-black text-center tracking-[0.1em] transition-all"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          />
          <button 
            onClick={handleCheck}
            disabled={loading}
            className="royal-gradient py-5 text-white font-black text-lg rounded-2xl shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Validating ID...' : 'Retrieve Status'}
          </button>
        </div>
        {error && <p className="text-rose-500 mt-6 font-bold text-sm bg-rose-50 py-3 rounded-xl">{error}</p>}
      </div>

      {result && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-slide-up space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-50">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applicant</p>
              <h4 className="text-2xl font-black text-slate-900">{result.student_name}</h4>
              <p className="text-sm font-bold text-blue-600">{result.registration_number}</p>
            </div>
            <div className={`px-8 py-4 rounded-2xl flex items-center gap-3 ${
              result.application_status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
              result.application_status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
            }`}>
              <div className="text-2xl">
                {result.application_status === 'Approved' ? '✓' : result.application_status === 'Rejected' ? '✕' : '⏳'}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                <p className="text-lg font-black uppercase tracking-tighter">{result.application_status}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <DataPoint label="Applied On" value={new Date(result.created_at).toLocaleDateString()} />
            <DataPoint label="Category" value={result.category} />
            <DataPoint label="Aadhaar" value={`**** **** ${result.aadhaar.slice(-4)}`} />
            <DataPoint label="APAAR ID" value={result.apaar} />
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl border border-blue-900 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg className="w-20 h-20 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm4 0H9v2h2V9zm4 0h-2v2h2V9z"></path></svg>
             </div>
             <p className="text-blue-50 text-base font-bold leading-relaxed relative z-10">
               {result.admin_message ? result.admin_message : "Your application is currently being reviewed by the regional EAPCET verification board."}
             </p>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => onOpenReceipt(result)}
              className="w-full py-5 royal-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              📄 View Official Receipt
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Print or Download option available on next page</p>
          </div>
        </div>
      )}
    </div>
  );
};

const DataPoint = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-800">{value}</p>
  </div>
);

export default StatusCheck;
