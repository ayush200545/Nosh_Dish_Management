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

        </div>
      </div>
    </div>
  );
}
