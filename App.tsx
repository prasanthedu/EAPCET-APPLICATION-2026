
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ApplicationForm from './components/ApplicationForm';
import StatusCheck from './components/StatusCheck';
import AdminDashboard from './components/AdminDashboard';
import SuccessView from './components/SuccessView';
import ReceiptView from './components/ReceiptView';
import { Application } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'portal' | 'admin' | 'success' | 'status' | 'receipt'>('portal');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [submittedData, setSubmittedData] = useState<Application | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Application | null>(null);

  const handleAdminLogin = (password: string) => {
    if (password === '200807') {
      setIsAdminLoggedIn(true);
      setView('admin');
      return true;
    }
    return false;
  };

  const handleApplicationSuccess = (data: Application) => {
    setSubmittedData(data);
    setView('success');
  };

  const openReceipt = (app: Application) => {
    setSelectedReceipt(app);
    setView('receipt');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onAdminClick={() => setView('admin')} isAdmin={isAdminLoggedIn} setView={setView} />
      
      <main className="flex-grow container mx-auto px-4 pt-28 pb-12">
        {view === 'portal' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-slide-up">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                Official Admissions 2026
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                EAPCET Student <span className="royal-text">Portal</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
                Streamlining the journey for aspiring engineers and professionals across the state.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <button 
                  onClick={() => {
                    const el = document.getElementById('application-start');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all text-lg"
                >
                  Start Application
                </button>
                <button 
                  onClick={() => setView('status')}
                  className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-lg"
                >
                  Track Status
                </button>
              </div>
            </div>
            
            <div id="application-start">
              <ApplicationForm onSuccess={handleApplicationSuccess} />
            </div>
          </div>
        )}

        {view === 'status' && (
          <div className="max-w-4xl mx-auto animate-slide-up">
             <button 
              onClick={() => setView('portal')}
              className="mb-8 text-slate-500 flex items-center gap-2 hover:text-blue-600 font-bold transition-all group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Portal
            </button>
            <StatusCheck onOpenReceipt={openReceipt} />
          </div>
        )}

        {view === 'success' && submittedData && (
          <SuccessView 
            application={submittedData} 
            onReset={() => setView('portal')}
            onOpenReceipt={() => openReceipt(submittedData)}
          />
        )}

        {view === 'receipt' && selectedReceipt && (
          <ReceiptView 
            application={selectedReceipt} 
            onBack={() => setView('status')} 
          />
        )}

        {view === 'admin' && (
          isAdminLoggedIn ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto glass p-10 rounded-3xl shadow-2xl mt-12 border-white/50 animate-slide-up">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <h2 className="text-2xl font-black mb-2 text-center text-slate-900">Staff Authentication</h2>
              <p className="text-sm text-slate-400 mb-8 text-center font-medium">Restricted area for authorized personnel only.</p>
              <div className="space-y-4">
                <input 
                  type="password"
                  placeholder="Access Key"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const success = handleAdminLogin((e.target as HTMLInputElement).value);
                      if (!success) alert('Invalid access key.');
                    }
                  }}
                />
                <button 
                  className="w-full py-4 royal-gradient text-white font-bold rounded-2xl shadow-xl hover:opacity-95 transition-all"
                  onClick={() => {
                     const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                     const success = handleAdminLogin(input.value);
                     if (!success) alert('Invalid access key.');
                  }}
                >
                  Confirm Identity
                </button>
                <button 
                  onClick={() => setView('portal')}
                  className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider"
                >
                  Public Portal
                </button>
              </div>
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
