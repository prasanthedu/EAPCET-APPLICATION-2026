
import React, { useState } from 'react';
import { supabase, uploadFile, generateRegistrationNumber } from '../supabase';

interface Props {
  onSuccess: (data: any) => void;
}

const ApplicationForm: React.FC<Props> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [sigFile, setSigFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [sigPreview, setSigPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);
    
    if (!photoFile || !sigFile) {
      alert('Required: Please upload both Photograph and Signature.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const aadhaar = formData.get('aadhaar') as string;
    const mobile = formData.get('mobile_number') as string;
    
    if (aadhaar.length !== 12) {
      alert('Aadhaar must be exactly 12 digits.');
      return;
    }

    if (mobile.length !== 10) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

    setLoading(true);

    try {
      const { data: existingAadhaar } = await supabase
        .from('applications')
        .select('registration_number')
        .eq('aadhaar', aadhaar)
        .maybeSingle();

      if (existingAadhaar) {
        throw new Error(`Duplicate Record: An application with Aadhaar ${aadhaar} already exists (ID: ${existingAadhaar.registration_number}). Please use the 'Track Status' feature to download your receipt.`);
      }

      const regNo = generateRegistrationNumber();
      const timestamp = Date.now();
      
      setStatusMessage('📤 Uploading photo...');
      const photoUrl = await uploadFile('student-documents', `uploads/${regNo}_photo_${timestamp}.jpg`, photoFile);
      
      setStatusMessage('✍️ Uploading signature...');
      const sigUrl = await uploadFile('student-documents', `uploads/${regNo}_sig_${timestamp}.jpg`, sigFile);

      setStatusMessage('💾 Finalizing submission...');
      
      const applicationData = {
        registration_number: regNo,
        student_name: (formData.get('student_name') as string).toUpperCase(),
        father_name: (formData.get('father_name') as string).toUpperCase(),
        mother_name: (formData.get('mother_name') as string).toUpperCase(),
        dob: formData.get('dob'),
        aadhaar: aadhaar,
        mobile_number: mobile,
        alternate_mobile_number: formData.get('alternate_mobile_number'),
        apaar: formData.get('apaar'),
        ration_card: formData.get('ration_card'),
        category: formData.get('category'),
        sub_caste: (formData.get('sub_caste') as string).toUpperCase(),
        income_certificate: formData.get('income_certificate'),
        caste_ews_certificate: formData.get('caste_ews_certificate'),
        tenth_hall_ticket: formData.get('tenth_hall_ticket'),
        practical_hall_ticket: formData.get('practical_hall_ticket'),
        jee_mains_no: formData.get('jee_mains_no') || '',
        street: (formData.get('street') as string).toUpperCase(),
        village_city: (formData.get('village_city') as string).toUpperCase(),
        district: (formData.get('district') as string).toUpperCase(),
        state: (formData.get('state') as string).toUpperCase(),
        pincode: formData.get('pincode'),
        nation: (formData.get('nation') as string).toUpperCase(),
        school_6_name: (formData.get('school_6_name') as string).toUpperCase(),
        school_6_place: (formData.get('school_6_place') as string).toUpperCase(),
        school_7_name: (formData.get('school_7_name') as string).toUpperCase(),
        school_7_place: (formData.get('school_7_place') as string).toUpperCase(),
        school_8_name: (formData.get('school_8_name') as string).toUpperCase(),
        school_8_place: (formData.get('school_8_place') as string).toUpperCase(),
        school_9_name: (formData.get('school_9_name') as string).toUpperCase(),
        school_9_place: (formData.get('school_9_place') as string).toUpperCase(),
        school_10_name: (formData.get('school_10_name') as string).toUpperCase(),
        school_10_place: (formData.get('school_10_place') as string).toUpperCase(),
        photo_url: photoUrl,
        signature_url: sigUrl,
        application_status: 'Pending'
      };

      const { data, error: dbError } = await supabase
        .from('applications')
        .insert([applicationData])
        .select('*')
        .single();

      if (dbError) throw new Error(`Database Error: ${dbError.message}`);

      onSuccess(data);
    } catch (err: any) {
      console.error('Submission Failure:', err);
      alert(err.message || 'Submission failed. Please check your network and try again.');
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'sig') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File is too large (Maximum 2MB).');
        return;
      }
      const url = URL.createObjectURL(file);
      if (type === 'photo') {
        setPhotoFile(file);
        setPhotoPreview(url);
      } else {
        setSigFile(file);
        setSigPreview(url);
      }
    }
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 gap-8">
          
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
            <SectionHeader number="01" title="Candidate Identity" subtitle="Basic identification details." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
              <InputField label="Candidate Name" name="student_name" required />
              <InputField label="Father's Name" name="father_name" required />
              <InputField label="Mother's Name" name="mother_name" required />
              <InputField label="Date of Birth" name="dob" type="date" required />
              <InputField label="Aadhaar ID" name="aadhaar" required pattern="[0-9]{12}" maxLength={12} placeholder="12 Digit Aadhaar" />
              <InputField label="Mobile Number" name="mobile_number" required pattern="[0-9]{10}" maxLength={10} placeholder="10 Digit Mobile" />
              <InputField label="Alternate Contact" name="alternate_mobile_number" required pattern="[0-9]{10}" maxLength={10} />
              <InputField label="APAAR ID" name="apaar" required placeholder="Digital ID" />
              <InputField label="Ration Card" name="ration_card" required placeholder="Ration Card Number" />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
            <SectionHeader number="02" title="Social Category" subtitle="Legal certificate numbers required." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                <select name="category" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-800 transition-all">
                  {['OC', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'BC-E', 'SC', 'ST', 'EWS'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <InputField label="Sub-Caste" name="sub_caste" required placeholder="Ex: Kapu, Mala, etc." />
              <InputField label="Income Cert #" name="income_certificate" required />
              <InputField label="Caste/EWS #" name="caste_ews_certificate" required />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
            <SectionHeader number="03" title="Residential Address" subtitle="Complete permanent address details." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
              <InputField label="Street / Landmark" name="street" required />
              <InputField label="Village / City" name="village_city" required />
              <InputField label="District" name="district" required />
              <InputField label="State" name="state" required />
              <InputField label="Pin Code" name="pincode" required maxLength={6} pattern="[0-9]{6}" />
              <InputField label="Nation" name="nation" required defaultValue="INDIA" />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
            <SectionHeader number="04" title="Educational History" subtitle="School records and admit cards." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">Academic Identifiers</h4>
                <div className="space-y-4">
                  <InputField label="10th Hall Ticket" name="tenth_hall_ticket" required />
                  <InputField label="Practical Ticket" name="practical_hall_ticket" required />
                  <InputField label="JEE Mains Admit Card #" name="jee_mains_no" placeholder="Optional (If attended)" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">School Records (6th-10th)</h4>
                {[6, 7, 8, 9, 10].map(grade => (
                  <div key={grade} className="flex gap-2">
                    <input name={`school_${grade}_name`} required placeholder={`${grade}th School Name`} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm font-bold" />
                    <input name={`school_${grade}_place`} required placeholder="Place" className="w-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm font-bold" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
            <SectionHeader number="05" title="Document Scans" subtitle="Verification uploads." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
              <UploadBox label="Portrait Photograph" preview={photoPreview} onChange={(e) => handleFileChange(e, 'photo')} type="photo" />
              <UploadBox label="Digital Signature" preview={sigPreview} onChange={(e) => handleFileChange(e, 'sig')} type="sig" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 mt-16 text-center">
          {statusMessage && (
            <div className="flex items-center gap-3 text-blue-600 font-black animate-pulse bg-blue-50 px-8 py-3 rounded-full border border-blue-100 text-sm">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              {statusMessage}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full max-w-xl py-6 rounded-[2rem] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 ${
              loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'royal-gradient text-white hover:scale-[1.02]'
            }`}
          >
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

const SectionHeader = ({ number, title, subtitle }: any) => (
  <div className="border-b border-slate-50 pb-8">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 royal-gradient rounded-3xl flex items-center justify-center text-white font-black text-xl shadow-lg">{number}</div>
      <div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
        <p className="text-slate-400 font-bold text-sm">{subtitle}</p>
      </div>
    </div>
  </div>
);

const InputField = ({ label, required, ...props }: any) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      {...props}
      required={required}
      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
    />
  </div>
);

const UploadBox = ({ label, preview, onChange, type }: any) => (
  <div className="group">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label} <span className="text-rose-500">*</span></label>
    <div className={`p-8 rounded-[2.5rem] bg-slate-50 border-2 border-dashed transition-all flex flex-col items-center gap-6 ${preview ? 'border-emerald-300' : 'border-slate-200 group-hover:border-blue-400'}`}>
      <div className={`${type === 'photo' ? 'w-32 h-40' : 'w-full h-40'} bg-white rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center`}>
        {preview ? <img src={preview} className="w-full h-full object-cover" /> : <span className="text-slate-100 text-6xl">{type === 'photo' ? '👤' : '✍️'}</span>}
      </div>
      <label className="w-full">
        <span className="block w-full py-4 royal-gradient text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center cursor-pointer transition-all shadow-lg">
          {preview ? 'Replace Image' : 'Select File'}
        </span>
        <input type="file" accept="image/*" onChange={onChange} className="hidden" />
      </label>
    </div>
  </div>
);

export default ApplicationForm;
