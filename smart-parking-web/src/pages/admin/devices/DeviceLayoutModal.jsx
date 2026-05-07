import React, { useState } from 'react';
import { X, LayoutGrid, Monitor, Activity, ShieldCheck } from 'lucide-react';
import DeviceGrid from './DeviceGrid';
import DeviceDetailPanel from './DeviceDetailPanel';

export default function DeviceLayoutModal({ isOpen, onClose, gateName, devices = [] }) {
  const [selectedDevice, setSelectedDevice] = useState(null);

  if (!isOpen) return null;

  const onlineCount = devices.filter(d => d.status === 'online').length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[1200px] h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-300 relative border border-white/20">
        
        {/* Main Monitoring View */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{gateName} - Device Monitoring</h2>
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.1em]">Real-time system integrity and hardware status</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-8 px-8 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Status</span>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-sm font-black text-gray-900">{onlineCount}/{devices.length} Online</span>
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-gray-200"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Health</span>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-indigo-600" />
                    <span className="text-sm font-black text-gray-900">Stable</span>
                  </div>
                </div>
              </div>

              {!selectedDevice && (
                <button 
                  onClick={onClose} 
                  className="p-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full transition-all border border-gray-200 shadow-sm"
                >
                  <X size={28} />
                </button>
              )}
            </div>
          </div>

          {/* Grid Container */}
          <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest">
                <LayoutGrid size={18} />
                Hardware Grid
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Online
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Offline
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Service
                </div>
              </div>
            </div>
            
            <DeviceGrid 
              devices={devices} 
              selectedDeviceId={selectedDevice?.id}
              onDeviceClick={setSelectedDevice}
            />
          </div>
        </div>

        {/* Side Panel */}
        {selectedDevice && (
          <DeviceDetailPanel 
            device={selectedDevice} 
            onClose={() => setSelectedDevice(null)} 
          />
        )}
      </div>
    </div>
  );
}
