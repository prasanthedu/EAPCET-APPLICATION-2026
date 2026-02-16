
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Application, Stats } from '../types';

const AdminDashboard: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
    const subscription = supabase
      .channel('public:applications_admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
        fetchApplications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else {
      setApps(data || []);
      updateStats(data || []);
    }
    setLoading(false);
  };

  const updateStats = (data: Application[]) => {
    const stats = {
      total: data.length,
      pending: data.filter(a => a.application_status === 'Pending').length,
      approved: data.filter(a => a.application_status === 'Approved').length,
      rejected: data.filter(a => a.application_status === 'Rejected').length,
    };
    setStats(stats);
  };

  useEffect(() => {
    let result = apps;
    if (search) {
      result = result.filter(a => 
        a.student_name.toLowerCase().includes(search.toLowerCase()) || 
        a.registration_number.toLowerCase().includes(search.toLowerCase()) ||
        a.aadhaar.includes(search) ||
        a.mobile_number.includes(search)
      );
    }
    if (filterStatus !== 'All') {
      result = result.filter(a => a.application_status === filterStatus);
    }
    setFilteredApps(result);
  }, [search, filterStatus, apps]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedApp || saving) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    // STRICT COLUMN WHITELIST: Only these fields will be sent to Supabase
    // This prevents errors if your form has extra fields that don't exist in the DB
    const allowedColumns = [
      'student_name', 
      'father_name', 
      'mother_name', 
      'dob', 
      'aadhaar', 
      'mobile_number', 
      'alternate_mobile_number', 
      'apaar', 
      'ration_card', 
      'category', 
      'sub_caste', 
      'application_status', 
      'admin_message'
    ];

    const payload: any = {};
    allowedColumns.forEach(col => {
      const val = formData.get(col);
      if (val !== null) {
        payload[col] = val.toString();
      }
    });

    try {
      const { error } = await supabase
        .from('applications')
        .update(payload)
        .eq('id', selectedApp.id);

      if (error) {
        throw error;
      } else {
        alert('Record updated successfully.');
        setIsEditMode(false);
        setSelectedApp(null);
        await fetchApplications();
      }
    } catch (err: any) {
      console.error('Update Error Details:', err);
      const errorMsg = err.message || 'Unknown database error';
      alert(`Update failed: ${errorMsg}\n\nIMPORTANT: Make sure you have run the latest SQL script in Supabase to add the "admin_message" column.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently DELETE the application for ${name}?`)) {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) alert('Delete failed: ' + error.message);
      else fetchApplications();
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-96 space-y-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Accessing Secure Records</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-slide-up relative">
      {copyFeedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-sm uppercase tracking-widest animate-slide-up">
          Copied: {copyFeedback}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Submissions" value={stats.total} icon="📄" color="slate" />
        <MetricCard label="Pending Review" value={stats.pending} icon="⏳" color="amber" />
        <MetricCard label="Successful" value={stats.approved} icon="✅" color="emerald" />
        <MetricCard label="Declined" value={stats.rejected} icon="🚫" color="rose" />
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search Candidate Details..."
              className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-semibold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          
          <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto">
            {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
              <button 
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  filterStatus === s ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-4 text-left">Candidate Info</th>
                <th className="px-8 py-4 text-left">Contact & ID</th>
                <th className="px-8 py-4 text-left">Process Status</th>
                <th className="px-8 py-4 text-right">Control Console</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-slate-100 shrink-0">
                        <img src={app.photo_url} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 mb-0.5">{app.student_name}</p>
                        <p className="text-xs text-slate-400 font-semibold">{app.category} • Father: {app.father_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700 font-bold">{app.registration_number}</code>
                        <button onClick={() => copyToClipboard(app.registration_number, 'Reg No')} className="text-slate-300 hover:text-blue-500 text-xs">📋</button>
                      </div>
                      <p className="text-xs text-slate-400 font-bold">📞 {app.mobile_number}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      app.application_status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      app.application_status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {app.application_status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setSelectedApp(app); setIsEditMode(false); }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                      >
                        👁️
                      </button>
                      <button 
                        onClick={() => { setSelectedApp(app); setIsEditMode(true); }}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(app.id, app.student_name)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up my-8">
            <div className="royal-gradient p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{isEditMode ? 'Modify Application' : 'Candidate Dossier'}</h2>
                <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">{selectedApp.registration_number}</p>
              </div>
              <button 
                onClick={() => { if(!saving) setSelectedApp(null); }}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-8 md:p-12 max-h-[75vh] overflow-y-auto scrollbar-hide">
              <form onSubmit={handleUpdate} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
                    <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Processing Status</label>
                    {isEditMode ? (
                      <div className="space-y-4">
                        <input 
                          name="application_status"
                          id="statusInput"
                          defaultValue={selectedApp.application_status}
                          className="w-full px-6 py-4 bg-white border-2 border-blue-200 rounded-2xl text-lg font-black text-blue-900 outline-none"
                          required
                        />
                        <div className="flex gap-2">
                          {['Pending', 'Approved', 'Rejected'].map(preset => (
                            <button 
                              key={preset}
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('statusInput') as HTMLInputElement;
                                if(input) input.value = preset;
                              }}
                              className="px-4 py-3 bg-white border border-blue-100 rounded-xl text-[10px] font-black text-blue-600 uppercase hover:bg-blue-600 hover:text-white transition-all flex-grow"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="px-8 py-4 bg-white rounded-2xl border-2 border-blue-200 text-2xl font-black text-blue-900 uppercase">
                        {selectedApp.application_status}
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                    <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Board Updates</label>
                    {isEditMode ? (
                      <textarea 
                        name="admin_message"
                        defaultValue={selectedApp.admin_message}
                        className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white outline-none focus:border-blue-500 min-h-[120px]"
                        placeholder="Updates visible to student..."
                      />
                    ) : (
                      <div className="p-4 bg-slate-800 rounded-2xl text-xs font-medium text-slate-300 min-h-[100px] border border-slate-700">
                        {selectedApp.admin_message || 'No custom message set.'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DataField label="Full Name" name="student_name" val={selectedApp.student_name} isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="Father's Name" name="father_name" val={selectedApp.father_name} isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="Mother's Name" name="mother_name" val={selectedApp.mother_name} isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="DOB" name="dob" val={selectedApp.dob} type="date" isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="Aadhaar" name="aadhaar" val={selectedApp.aadhaar} isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="APAAR ID" name="apaar" val={selectedApp.apaar} isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="Mobile" name="mobile_number" val={selectedApp.mobile_number} isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="Alternate Mobile" name="alternate_mobile_number" val={selectedApp.alternate_mobile_number} isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="Ration Card" name="ration_card" val={selectedApp.ration_card} isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="Category" name="category" val={selectedApp.category} isEdit={isEditMode} onCopy={copyToClipboard} />
                  <DataField label="Sub-Caste" name="sub_caste" val={selectedApp.sub_caste} isEdit={isEditMode} onCopy={copyToClipboard} />
                </div>

                <div className="border-t border-slate-100 pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    Created: {new Date(selectedApp.created_at).toLocaleString()}
                  </div>
                  <div className="flex gap-4">
                    {isEditMode ? (
                      <>
                        <button 
                          type="submit" 
                          disabled={saving}
                          className="px-10 py-5 royal-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : '💾 Save Changes'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setIsEditMode(false)}
                          disabled={saving}
                          className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => setIsEditMode(true)} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">
                          ✏️ Edit Record
                        </button>
                        <button type="button" onClick={() => handleDelete(selectedApp.id, selectedApp.student_name)} className="px-10 py-5 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest border border-rose-100 hover:bg-rose-600 hover:text-white transition-all">
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DataField = ({ label, name, val, isEdit, type = "text", onCopy }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
    {isEdit ? (
      <input 
        name={name}
        type={type}
        defaultValue={val}
        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:border-blue-500 outline-none transition-all"
      />
    ) : (
      <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-white transition-all group">
        <span className="font-bold text-slate-900 truncate pr-4">{val || 'N/A'}</span>
        <button type="button" onClick={() => onCopy(val, label)} className="shrink-0 p-2 bg-white text-slate-400 rounded-xl hover:text-blue-600 border border-slate-100 shadow-sm">📋</button>
      </div>
    )}
  </div>
);

const MetricCard = ({ label, value, icon, color }: any) => {
  const themes: any = {
    slate: 'bg-slate-900 text-white',
    amber: 'bg-white text-amber-600 border border-amber-100',
    emerald: 'bg-white text-emerald-600 border border-emerald-100',
    rose: 'bg-white text-rose-600 border border-rose-100'
  };
  return (
    <div className={`p-8 rounded-[2.5rem] shadow-xl ${themes[color] || themes.slate} flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{label}</span>
      </div>
      <p className="text-5xl font-black tracking-tighter">{value}</p>
    </div>
  );
};

export default AdminDashboard;
