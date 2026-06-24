import React, { useState, useEffect } from 'react';
import { Camera, Save, User, Mail, Shield, Bell, Database } from 'lucide-react';
import { useUser } from '../hooks/useUserHook';
import { useUpload } from '../hooks/useUpload';

export default function Settings() {
  const { user, updateUser } = useUser();
  const { uploadFile, isUploading } = useUpload();
  
  const [formData, setFormData] = useState({
    name: '',
    profileImage: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  if (!user) return <div className="p-8">Loading settings...</div>;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const url = await uploadFile(file);
      setFormData(prev => ({ ...prev, profileImage: url }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = () => {
    updateUser.mutate({
      name: formData.name,
      profileImage: formData.profileImage
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-300" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-brand-purple text-white rounded-full cursor-pointer hover:bg-[#4435cc] transition-colors shadow-md">
                <Camera className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-slate-500 text-sm mb-4">{user.role === 'admin' ? 'System Administrator' : 'Standard User'}</p>
            
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Profile Details Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-500" />
              <h3 className="font-semibold text-slate-800">Profile Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    value={user.email}
                    disabled
                    className="w-full pl-10 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Email address cannot be changed.</p>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  disabled={updateUser.isLoading || isUploading}
                  className="flex items-center px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-[#4435cc] transition-colors font-medium disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Admin Specific Settings */}
          {user.role === 'admin' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-purple" />
                <h3 className="font-semibold text-slate-800">Administrator Config</h3>
              </div>
              <div className="p-6 space-y-4">
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <Bell className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Global Notifications</h4>
                      <p className="text-sm text-slate-500">Receive alerts when new users register.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <Database className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Auto-Backup Database</h4>
                      <p className="text-sm text-slate-500">Backup dish records automatically daily.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                  </label>
                </div>

              </div>
            </div>
          )}

          {/* User Specific Settings */}
          {user.role === 'user' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>
                <h3 className="font-semibold text-slate-800">User Preferences</h3>
              </div>
              <div className="p-6 space-y-4">
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <Bell className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Recipe Recommendations</h4>
                      <p className="text-sm text-slate-500">Get weekly emails with personalized dish ideas.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Vegetarian Only</h4>
                      <p className="text-sm text-slate-500">Only show vegetarian dishes in recommendations.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
