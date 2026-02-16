
import React, { useRef } from 'react';
import { Application } from '../types';

interface Props {
  application: Application;
  onBack: () => void;
}

const ReceiptView: React.FC<Props> = ({ application, onBack }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!receiptRef.current) return;
    
    const options = {
      margin: 0,
      filename: `MPC_STACK_Receipt_${application.registration_number}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        allowTaint: false,
        letterRendering: true,
        logging: false,
        windowWidth: 794,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // @ts-ignore
    html2pdf().from(receiptRef.current).set(options).save().catch(err => {
      console.error("PDF Generation Error:", err);
      alert("There was an issue generating your PDF. Please try using the 'Print' button.");
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12 print:p-0 print:m-0">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 print:hidden">
        <button 
          onClick={onBack}
          className="px-4 py-2 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-all flex items-center gap-2"
        >
          ← Return to Dashboard
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-white text-slate-900 border-2 border-slate-100 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            🖨️ Print Receipt
          </button>
          <button 
            onClick={handleDownload}
            className="px-6 py-2 royal-gradient text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            📥 Download PDF
          </button>
        </div>
      </div>

      <div className="bg-slate-200 p-2 sm:p-4 rounded-[1.5rem] shadow-inner flex justify-center overflow-x-auto print:bg-white print:p-0 print:rounded-none print:shadow-none">
        <div 
          ref={receiptRef}
          className="w-[210mm] bg-white p-6 relative print:shadow-none print:p-[8mm] print:m-0"
          style={{ minHeight: '297mm', boxSizing: 'border-box' }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.012] select-none rotate-45 text-[70px] font-black">
            MPC STACK 2026 OFFICIAL
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="text-center border-b-[1.5px] border-slate-900 pb-2 mb-3 flex flex-col items-center">
              <div className="w-8 h-8 royal-gradient rounded-lg flex items-center justify-center text-white font-black text-xs mb-1">M</div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">MPC STACK - EAPCET 2026</h1>
              <p className="text-slate-500 font-black text-[7px] uppercase tracking-[0.4em] mt-1">Official Student Admission Verification Document</p>
              <div className="mt-1.5 inline-flex items-center bg-slate-900 text-white px-3 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest">
                Status: {application.application_status}
              </div>
            </div>

            <div className="flex flex-row gap-6 mb-3">
              <div className="flex-grow space-y-3">
                <div className="bg-slate-50 border border-dashed border-blue-200 p-2 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[7px] font-black text-blue-600 uppercase tracking-widest leading-none mb-0.5">Registration ID</p>
                    <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter leading-none">{application.registration_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">JEE Admit Card #</p>
                    <p className="text-xs font-black text-slate-900 leading-none">{application.jee_mains_no || 'NOT ENTERED'}</p>
                  </div>
                </div>

                <Section title="1. Candidate Profile">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    <Row label="Full Name" value={application.student_name} />
                    <Row label="Date of Birth" value={application.dob} />
                    <Row label="Father's Name" value={application.father_name} />
                    <Row label="Mother's Name" value={application.mother_name} />
                    <Row label="Aadhaar Number" value={application.aadhaar} />
                    <Row label="Mobile Number" value={application.mobile_number} />
                    <Row label="Email ID" value={application.email || 'N/A'} />
                    <Row label="APAAR Digital ID" value={application.apaar} />
                  </div>
                </Section>
              </div>

              <div className="w-24 shrink-0 space-y-1">
                <div className="aspect-[3/4] bg-slate-50 border border-slate-200 rounded-md overflow-hidden shadow-sm flex items-center justify-center">
                  <img src={application.photo_url} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest text-center italic">Digital Photo ID</p>
              </div>
            </div>

            <div className="mb-3">
              <Section title="2. Complete Residential Address">
                <div className="bg-slate-50/50 border border-slate-100 p-2 rounded-lg grid grid-cols-3 gap-x-6 gap-y-1">
                  <Row label="Street / House" value={application.street} />
                  <Row label="Village / City" value={application.village_city} />
                  <Row label="District" value={application.district} />
                  <Row label="State" value={application.state} />
                  <Row label="Pin Code" value={application.pincode} />
                  <Row label="Nation" value={application.nation} />
                </div>
              </Section>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-3">
              <Section title="3. Socio-Economic Status">
                <div className="grid grid-cols-1 gap-1">
                  <Row label="Social Category" value={application.category} />
                  <Row label="Sub-Caste Details" value={application.sub_caste} />
                  <Row label="Ration Card #" value={application.ration_card} />
                  <Row label="Income Cert #" value={application.income_certificate} />
                </div>
              </Section>

              <Section title="4. Academic Credentials">
                <div className="grid grid-cols-1 gap-1">
                  <Row label="10th Hall Ticket" value={application.tenth_hall_ticket} />
                  <Row label="Practical Ticket" value={application.practical_hall_ticket} />
                  <Row label="Caste/EWS Cert #" value={application.caste_ews_certificate} />
                  <Row label="JEE Mains Info" value={application.jee_mains_no ? 'Exam Attended' : 'Not Attended'} />
                </div>
              </Section>
            </div>

            <Section title="5. Institutional History (Class 6 - 10)">
              <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50">
                      <th className="px-3 py-1 text-[7px] font-black text-slate-400 uppercase tracking-widest">Class</th>
                      <th className="px-3 py-1 text-[7px] font-black text-slate-400 uppercase tracking-widest">Name of the Institution</th>
                      <th className="px-3 py-1 text-[7px] font-black text-slate-400 uppercase tracking-widest text-right">District / Place</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <SchoolRow grade="6th Class" name={application.school_6_name} place={application.school_6_place} />
                    <SchoolRow grade="7th Class" name={application.school_7_name} place={application.school_7_place} />
                    <SchoolRow grade="8th Class" name={application.school_8_name} place={application.school_8_place} />
                    <SchoolRow grade="9th Class" name={application.school_9_name} place={application.school_9_place} />
                    <SchoolRow grade="10th Class" name={application.school_10_name} place={application.school_10_place} />
                  </tbody>
                </table>
              </div>
            </Section>

            <div className="mt-auto pt-4 border-t border-slate-100">
               <div className="text-center mb-3">
                 <p className="text-sm font-serif italic text-slate-600">"The beautiful thing about learning is that no one can take it away from you."</p>
                 <p className="text-[7px] font-black text-blue-600 uppercase tracking-widest mt-0.5">— B.B. KING —</p>
               </div>

               <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg max-w-[260px]">
                       <p className="text-emerald-700 font-black text-[9px] uppercase tracking-tighter leading-none mb-1">ALL THE BEST FOR YOUR EXAM!</p>
                       <p className="text-[7px] text-emerald-600 font-medium leading-tight">Focus on your goals, work hard, and the success will follow you. The MPC Stack team is rooting for you.</p>
                    </div>
                    <p className="text-[6px] text-slate-300 font-medium leading-none">
                      Ref Hash: {application.id.slice(0, 16).toUpperCase()} | Generated: {new Date().toLocaleString()}
                    </p>
                  </div>

                  <div className="text-center w-32 space-y-1">
                    <div className="border-b border-slate-900 pb-0.5">
                       <img src={application.signature_url} className="h-8 mx-auto object-contain" crossOrigin="anonymous" />
                    </div>
                    <p className="text-[7px] font-black text-slate-900 uppercase tracking-widest leading-none">Candidate Signature</p>
                  </div>
               </div>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-[5px] text-slate-400 font-medium uppercase tracking-[0.2em]">This is a computer-generated document. Verification can be done at mpcstack.com/portal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: any) => (
  <div className="space-y-1">
    <h3 className="text-[8px] font-black text-slate-900 uppercase tracking-[0.15em] border-l-2 border-slate-900 pl-2 leading-none mb-1">{title}</h3>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const Row = ({ label, value }: any) => (
  <div className="flex flex-col border-b border-slate-50 pb-0.5">
    <span className="text-[5.5px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{label}</span>
    <span className="text-[8.5px] font-bold text-slate-800 uppercase truncate leading-tight">{value || 'NOT PROVIDED'}</span>
  </div>
);

const SchoolRow = ({ grade, name, place }: any) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-3 py-0.5 text-[7px] font-black text-slate-500 uppercase">{grade}</td>
    <td className="px-3 py-0.5 text-[7px] font-bold text-slate-800 uppercase">{name}</td>
    <td className="px-3 py-0.5 text-[7px] font-bold text-slate-800 uppercase text-right">{place}</td>
  </tr>
);

export default ReceiptView;
