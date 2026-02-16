
import React, { useMemo } from 'react';
import { Application } from '../types';

interface Props {
  application: Application;
  onReset: () => void;
}

const SuccessView: React.FC<Props> = ({ application, onReset }) => {
  const quotes = [
    "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
    "Education is the most powerful weapon which you can use to change the world. — Nelson Mandela",
    "Believe in yourself and all that you are. — Christian D. Larson",
    "The future depends on what you do today. — Mahatma Gandhi",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill"
  ];

  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  const getReceiptHtml = () => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a202c; max-width: 800px; margin: auto; background: #fff;">
        <div style="text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #1e3a8a; font-size: 24px; text-transform: uppercase;">MPC STACK - EAPCET 2026</h1>
          <p style="margin: 5px 0; color: #4a5568; font-weight: bold; font-size: 14px;">Official Application Confirmation Receipt</p>
        </div>

        <div style="position: relative; border: 1px solid #e2e8f0; padding: 30px; border-radius: 8px;">
          <div style="float: right; width: 100px; height: 120px; border: 2px solid #edf2f7; margin-left: 20px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc;">
            <img src="${application.photo_url}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <div style="background: #f7fafc; padding: 15px; border: 2px dashed #2b6cb0; text-align: center; margin-bottom: 30px; border-radius: 6px;">
            <span style="display: block; font-size: 10px; color: #2b6cb0; text-transform: uppercase; font-weight: 800; margin-bottom: 5px;">Registration Number</span>
            <strong style="font-size: 28px; font-family: monospace; color: #1a365d;">${application.registration_number}</strong>
          </div>

          <h3 style="font-size: 12px; color: #2d3748; background: #edf2f7; padding: 6px 12px; border-radius: 4px; margin-top: 20px; font-weight: 800; text-transform: uppercase;">1. Candidate Personal Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div style="font-size: 11px;"><b style="color:#718096">NAME:</b> ${application.student_name}</div>
            <div style="font-size: 11px;"><b style="color:#718096">DOB:</b> ${application.dob}</div>
            <div style="font-size: 11px;"><b style="color:#718096">FATHER:</b> ${application.father_name}</div>
            <div style="font-size: 11px;"><b style="color:#718096">MOTHER:</b> ${application.mother_name}</div>
            <div style="font-size: 11px;"><b style="color:#718096">AADHAAR:</b> ${application.aadhaar}</div>
            <div style="font-size: 11px;"><b style="color:#718096">APAAR ID:</b> ${application.apaar}</div>
            <div style="font-size: 11px;"><b style="color:#718096">MOBILE:</b> ${application.mobile_number}</div>
            <div style="font-size: 11px;"><b style="color:#718096">ALT MOBILE:</b> ${application.alternate_mobile_number}</div>
            <div style="font-size: 11px;"><b style="color:#718096">RATION CARD:</b> ${application.ration_card}</div>
          </div>

          <h3 style="font-size: 12px; color: #2d3748; background: #edf2f7; padding: 6px 12px; border-radius: 4px; margin-top: 20px; font-weight: 800; text-transform: uppercase;">2. Category & Certificates</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div style="font-size: 11px;"><b style="color:#718096">CATEGORY:</b> ${application.category}</div>
            <div style="font-size: 11px;"><b style="color:#718096">SUB-CASTE:</b> ${application.sub_caste}</div>
            <div style="font-size: 11px;"><b style="color:#718096">INCOME CERT:</b> ${application.income_certificate}</div>
            <div style="font-size: 11px;"><b style="color:#718096">CASTE CERT:</b> ${application.caste_ews_certificate}</div>
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
                <tr><td style="padding: 3px 5px;">6th</td><td style="padding: 3px 5px;">${application.school_6_name}</td><td style="padding: 3px 5px;">${application.school_6_place}</td></tr>
                <tr><td style="padding: 3px 5px;">7th</td><td style="padding: 3px 5px;">${application.school_7_name}</td><td style="padding: 3px 5px;">${application.school_7_place}</td></tr>
                <tr><td style="padding: 3px 5px;">8th</td><td style="padding: 3px 5px;">${application.school_8_name}</td><td style="padding: 3px 5px;">${application.school_8_place}</td></tr>
                <tr><td style="padding: 3px 5px;">9th</td><td style="padding: 3px 5px;">${application.school_9_name}</td><td style="padding: 3px 5px;">${application.school_9_place}</td></tr>
                <tr><td style="padding: 3px 5px;">10th</td><td style="padding: 3px 5px;">${application.school_10_name}</td><td style="padding: 3px 5px;">${application.school_10_place}</td></tr>
              </tbody>
            </table>
            <div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div style="font-size: 11px;"><b style="color:#718096">10th HALL TICKET:</b> ${application.tenth_hall_ticket}</div>
              <div style="font-size: 11px;"><b style="color:#718096">PRACTICAL TICKET:</b> ${application.practical_hall_ticket}</div>
            </div>
          </div>

          <div style="margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 15px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 9px; color: #a0aec0; max-width: 60%;">
               <b>STATUS:</b> PENDING VERIFICATION<br/>
               <b>SUBMISSION DATE:</b> ${new Date().toLocaleString()}<br/>
               <i>* This is a computer generated document and does not require a physical signature.</i>
            </div>
            <div style="text-align: center;">
              <img src="${application.signature_url}" style="height: 35px; border-bottom: 1px solid #000; padding-bottom: 2px;" /><br/>
              <span style="font-size: 8px; color: #718096; text-transform: uppercase;">Candidate Signature</span>
            </div>
          </div>

          <div style="margin-top: 40px; text-align: center; padding: 20px; border-top: 2px solid #edf2f7; font-style: italic; color: #4a5568; font-size: 12px;">
            "${randomQuote}"
          </div>
        </div>

        <div style="margin-top: 20px; font-size: 9px; text-align: center; color: #a0aec0;">
          MPC STACK - STATE COMMON ENTRANCE TEST CELL &copy; 2026
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=900,height=1000');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Receipt - ${application.registration_number}</title></head><body>${getReceiptHtml()}</body></html>`);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('div');
    element.innerHTML = getReceiptHtml();
    const options = {
      margin: 10,
      filename: `EAPCET_Receipt_${application.registration_number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center">
        <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-lg shadow-emerald-200">
          ✓
        </div>
        
        <h2 className="text-4xl font-black text-slate-900 mb-2">Registration Complete</h2>
        <p className="text-slate-500 font-medium mb-12">Your application has been received and indexed.</p>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mb-4">Official Tracking ID</p>
          <p className="text-5xl md:text-6xl font-black text-white tracking-tighter font-mono">{application.registration_number}</p>
        </div>

        <div className="bg-blue-50/50 p-6 rounded-3xl mb-12 border border-blue-100/50">
          <p className="text-blue-800 font-medium italic text-lg">"{randomQuote}"</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handlePrint}
            className="py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 hover:border-blue-200 transition-all flex items-center justify-center gap-3"
          >
            <span>🖨️</span> Print Receipt
          </button>
          <button 
            onClick={handleDownload}
            className="py-5 bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
          >
            <span>📥</span> Download PDF
          </button>
          <button 
            onClick={onReset}
            className="sm:col-span-2 py-5 royal-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-blue-500/30 active:scale-95 transition-all"
          >
            Submit Another Application
          </button>
        </div>

        <p className="mt-8 text-[10px] text-slate-400 font-black uppercase tracking-widest">
          Expected Verification Time: 48-72 Hours
        </p>
      </div>
    </div>
  );
};

export default SuccessView;
