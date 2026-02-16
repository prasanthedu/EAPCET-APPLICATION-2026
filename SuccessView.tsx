
import React, { useMemo } from 'react';
import { Application } from './types';

interface Props {
  application: Application;
  onReset: () => void;
}

const SuccessView: React.FC<Props> = ({ application, onReset }) => {
  const quotes = [
    "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
    "Education is the most powerful weapon which you can use to change the world. — Nelson Mandela",
    "Believe in yourself and all that you are. — Christian D. Larson",
    "The future depends on what you do today. — Mahatma Gandhi"
  ];

  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  const getReceiptHtml = () => {
    return `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a202c; max-width: 800px; margin: auto; background: #fff;">
        <div style="text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #1e3a8a; font-size: 24px; text-transform: uppercase;">MPC STACK - EAPCET 2026</h1>
          <p style="margin: 5px 0; color: #4a5568; font-weight: bold; font-size: 14px;">Official Application Confirmation Receipt</p>
        </div>

        <div style="position: relative; border: 1px solid #e2e8f0; padding: 30px; border-radius: 8px;">
          <div style="float: right; width: 110px; height: 140px; border: 2px solid #edf2f7; margin-left: 20px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc;">
            <img src="${application.photo_url}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
          </div>

          <div style="background: #f7fafc; padding: 15px; border: 2px dashed #2b6cb0; text-align: center; margin-bottom: 30px; border-radius: 6px;">
            <span style="display: block; font-size: 10px; color: #2b6cb0; text-transform: uppercase; font-weight: 800; margin-bottom: 5px;">Registration Number</span>
            <strong style="font-size: 28px; font-family: monospace; color: #1a365d;">${application.registration_number}</strong>
          </div>

          <h3 style="font-size: 12px; color: #2d3748; background: #edf2f7; padding: 6px 12px; border-radius: 4px; margin-top: 20px; font-weight: 800; text-transform: uppercase;">Candidate Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div style="font-size: 11px;"><b style="color:#718096">NAME:</b> ${application.student_name}</div>
            <div style="font-size: 11px;"><b style="color:#718096">DOB:</b> ${application.dob}</div>
            <div style="font-size: 11px;"><b style="color:#718096">FATHER:</b> ${application.father_name}</div>
            <div style="font-size: 11px;"><b style="color:#718096">AADHAAR:</b> ${application.aadhaar}</div>
            <div style="font-size: 11px;"><b style="color:#718096">MOBILE:</b> ${application.mobile_number}</div>
          </div>

          <div style="margin-top: 50px; border-top: 1px solid #edf2f7; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 9px; color: #a0aec0; max-width: 60%;">
               <b>STATUS:</b> PENDING VERIFICATION<br/>
               <b>SUBMISSION DATE:</b> ${new Date().toLocaleString()}<br/>
               <i>* Digital confirmation from MPC Stack portal.</i>
            </div>
            <div style="text-align: center;">
              <div style="margin-bottom: 5px;">
                <img src="${application.signature_url}" style="height: 40px; max-width: 150px; border-bottom: 1px solid #000; padding-bottom: 2px;" crossorigin="anonymous" />
              </div>
              <span style="font-size: 8px; color: #718096; text-transform: uppercase; font-weight: 800;">Candidate Signature</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const handleDownload = () => {
    const element = document.createElement('div');
    element.innerHTML = getReceiptHtml();
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    const options = {
      margin: 10,
      filename: `EAPCET_Receipt_${application.registration_number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // @ts-ignore
    html2pdf().from(element).set(options).save().then(() => {
      document.body.removeChild(element);
    });
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handlePrint}
            className="py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
          >
            <span>🖨️</span> Print Receipt
          </button>
          <button 
            onClick={handleDownload}
            className="py-5 bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
          >
            <span>📥</span> Download PDF
          </button>
          <button 
            onClick={onReset}
            className="sm:col-span-2 py-5 royal-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-blue-500/30 transition-all"
          >
            Return to Portal
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
