import React, { useState } from 'react';
import { Save, Bell, Shield, Server } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    maintenanceMode: false,
    autoBackup: true,
  });

  const toggleSetting = (key) => setSettings({ ...settings, [key]: !settings[key] });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure global platform preferences</p>
        </div>
        <button className="bg-brand-purple hover:bg-[#4435cc] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Server className="w-5 h-5 text-brand-purple" /> System Configuration
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Maintenance Mode</p>
              <p className="text-sm text-slate-500">Disable access for non-admin users</p>
            </div>
            <button 
              onClick={() => toggleSetting('maintenanceMode')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-brand-purple' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Auto Backups</p>
              <p className="text-sm text-slate-500">Perform daily database backups</p>
            </div>
            <button 
              onClick={() => toggleSetting('autoBackup')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoBackup ? 'bg-brand-purple' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.autoBackup ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Bell className="w-5 h-5 text-brand-purple" /> Notifications
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Email Alerts</p>
              <p className="text-sm text-slate-500">Receive alerts for system events</p>
            </div>
            <button 
              onClick={() => toggleSetting('notifications')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifications ? 'bg-brand-purple' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.notifications ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
