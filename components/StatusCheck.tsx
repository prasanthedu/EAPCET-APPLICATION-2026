
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Application } from '../types';

const StatusCheck: React.FC = () => {
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

  const getReceiptHtml = (app: Application) => {
    return `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #1a202c; max-width: 800px; margin: auto; background: #fff;">
        <div style="text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #1e3a8a; font-size: 24px; text-transform: uppercase;">MPC STACK - EAPCET 2026</h1>
          <p style="margin: 5px 0; color: #4a5568; font-weight: bold; font-size: 14px;">Official Application Confirmation Receipt</p>
        </div>

        <div style="position: relative; border: 1px solid #e2e8f0; padding: 30px; border-radius: 8px;">
          <div style="float: right; width: 100px; height: 120px; border: 2px solid #edf2f7; margin-left: 20px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc;">
            <img src="${app.photo_url}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <div style="background: #f7fafc; padding: 15px; border: 2px dashed #2b6cb0; text-align: center; margin-bottom: 30px; border-radius: 6px;">
            <span style="display: block; font-size: 10px; color: #2b6cb0; text-transform: uppercase; font-weight: 800; margin-bottom: 5px;">Registration Number</span>
            <strong style="font-size: 28px; font-family: monospace; color: #1a365d;">${app.registration_number}</strong>
          </div>

          <h3 style="font-size: 12px; color: #2d3748; background: #edf2f7; padding: 6px 12px; border-radius: 4px; margin-top: 20px; font-weight: 800; text-transform: uppercase;">1. Candidate Personal Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div style="font-size: 11px;"><b style="color:#718096">NAME:</b> ${app.student_name}</div>
            <div style="font-size: 11px;"><b style="color:#718096">DOB:</b> ${app.dob}</div>
            <div style="font-size: 11px;"><b style="color:#718096">FATHER:</b> ${app.father_name}</div>
            <div style="font-size: 11px;"><b style="color:#718096">MOTHER:</b> ${app.mother_name}</div>
            <div style="font-size: 11px;"><b style="color:#718096">AADHAAR:</b> ${app.aadhaar}</div>
            <div style="font-size: 11px;"><b style="color:#718096">APAAR ID:</b> ${app.apaar}</div>
            <div style="font-size: 11px;"><b style="color:#718096">MOBILE:</b> ${app.mobile_number}</div>
            <div style="font-size: 11px;"><b style="color:#718096">ALT MOBILE:</b> ${app.alternate_mobile_number}</div>
            <div style="font-size: 11px;"><b style="color:#718096">RATION CARD:</b> ${app.ration_card}</div>
          </div>

          <h3 style="font-size: 12px; color: #2d3748; background: #edf2f7; padding: 6px 12px; border-radius: 4px; margin-top: 20px; font-weight: 800; text-transform: uppercase;">2. Category & Certificates</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div style="font-size: 11px;"><b style="color:#718096">CATEGORY:</b> ${app.category}</div>
            <div style="font-size: 11px;"><b style="color:#718096">SUB-CASTE:</b> ${app.sub_caste}</div>
            <div style="font-size: 11px;"><b style="color:#718096">INCOME CERT:</b> ${app.income_certificate}</div>
            <div style="font-size: 11px;"><b style="color:#718096">CASTE CERT:</b> ${app.caste_ews_certificate}</div>
          </div>

          <h3 style="font-size: 12px; color: #2d3748; background: #edf2f7; padding: 6px 12px; border-radius: 4px; margin-top: 20px; font-weight: 800; text-transform: uppercase;">3. Educational Background</h3>
          <div style="margin-top: 10px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <th style="text-align: left; padding: 5px;">Class</th>
                  <th style="text-align: left; padding: 5px;">School Name</th>
                  <th style="text-align: left; padding: 5px;">Place</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="padding: 3px 5px;">6th</td><td style="padding: 3px 5px;">${app.school_6_name}</td><td style="padding: 3px 5px;">${app.school_6_place}</td></tr>
                <tr><td style="padding: 3px 5px;">7th</td><td style="padding: 3px 5px;">${app.school_7_name}</td><td style="padding: 3px 5px;">${app.school_7_place}</td></tr>
                <tr><td style="padding: 3px 5px;">8th</td><td style="padding: 3px 5px;">${app.school_8_name}</td><td style="padding: 3px 5px;">${app.school_8_place}</td></tr>
                <tr><td style="padding: 3px 5px;">9th</td><td style="padding: 3px 5px;">${app.school_9_name}</td><td style="padding: 3px 5px;">${app.school_9_place}</td></tr>
                <tr><td style="padding: 3px 5px;">10th</td><td style="padding: 3px 5px;">${app.school_10_name}</td><td style="padding: 3px 5px;">${app.school_10_place}</td></tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 15px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 9px; color: #a0aec0; max-width: 60%;">
               <b>CURRENT STATUS:</b> ${app.application_status.toUpperCase()}<br/>
               <b>GENERATED ON:</b> ${new Date().toLocaleString()}<br/>
               <i>* Digital confirmation from MPC Stack portal.</i>
            </div>
            <div style="text-align: center;">
              <img src="${app.signature_url}" style="height: 35px; border-bottom: 1px solid #000; padding-bottom: 2px;" /><br/>
              <span style="font-size: 8px; color: #718096; text-transform: uppercase;">Candidate Signature</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const handlePrint = (app: Application) => {
    const printWindow = window.open('', '', 'width=900,height=1000');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Receipt - ${app.registration_number}</title></head><body>${getReceiptHtml(app)}</body></html>`);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const handleDownloadPDF = (app: Application) => {
    const element = document.createElement('div');
    element.innerHTML = getReceiptHtml(app);
    const options = {
      margin: 10,
      filename: `EAPCET_Receipt_${app.registration_number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Track Application</h2>
        <p className="text-slate-400 font-medium mb-8">Enter your MPC2026 ID to view live status.</p>
        
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="MPC2026XXXX"
            className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-2xl uppercase font-black text-center tracking-[0.1em] placeholder:text-slate-200 transition-all"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          />
          <button 
            onClick={handleCheck}
            disabled={loading}
            className="royal-gradient py-5 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
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
             <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 bg-blue-600 text-[10px] text-white font-black rounded-lg uppercase tracking-widest">Official Board Update</span>
             </div>
             <p className="text-blue-50 text-base font-bold leading-relaxed relative z-10">
               {result.admin_message ? result.admin_message : (
                 <>
                   {result.application_status === 'Pending' && "Your documents are successfully indexed. Manual verification by the EAPCET regional office is in progress. Kindly allow 48-72 business hours for the final update."}
                   {result.application_status === 'Approved' && "Your verification is successful. The digital hall ticket will be available for download 15 days prior to the examination date via this portal."}
                   {result.application_status === 'Rejected' && "Inconsistencies detected in the uploaded documents. Please review your submission against your original certificates and contact the support desk."}
                   {(!['Pending', 'Approved', 'Rejected'].includes(result.application_status)) && "Application status updated. Please contact regional center for details."}
                 </>
               )}
             </p>
          </div>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => handlePrint(result)}
              className="py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-blue-200 transition-all flex items-center justify-center gap-3"
            >
              <span>🖨️</span> Print Receipt
            </button>
            <button 
              onClick={() => handleDownloadPDF(result)}
              className="py-4 bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
            >
              <span>📥</span> Download PDF
            </button>
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
