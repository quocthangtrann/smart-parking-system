import React from 'react';
import { X, Activity, ShieldAlert } from 'lucide-react';
import DeviceMap from './DeviceMap';

export default function MapFullscreenModal({ isOpen, onClose, onGateClick }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-white w-screen h-screen flex flex-col animate-in slide-in-from-bottom duration-500">
      {/* Header Overlay */}
      <div className="h-[100px] border-b border-gray-100 flex items-center px-12 justify-between shrink-0 bg-white shadow-sm z-10">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-200">
            <Activity size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Infrastructure Monitoring Center</h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Node Network Status
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="group p-4 hover:bg-red-50 hover:border-red-200 rounded-full transition-all border border-gray-200 flex items-center gap-3"
        >
          <span className="font-black text-xs uppercase tracking-widest text-gray-500 group-hover:text-red-600 px-2">Exit Console</span>
          <X size={28} className="text-gray-900 group-hover:text-red-600" />
        </button>
      </div>
      
      {/* Map Content */}
      <div className="flex-1 w-full relative bg-gray-50">
        <DeviceMap 
          isInsideModal={true} 
          onGateClick={onGateClick} 
        />
        
        {/* Hardware Status Overlay */}
        <div className="absolute bottom-12 left-12 z-10 bg-white/95 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white/50 max-w-[380px] animate-in fade-in slide-in-from-left duration-700 delay-300">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert size={20} className="text-red-600" />
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-[0.1em]">Console Instructions</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-[10px] shrink-0">1</div>
              <p className="text-[12px] font-bold text-gray-600 leading-relaxed">
                Click on any <span className="text-red-600 font-black uppercase">Gate Node</span> to inspect its internal hardware array.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-[10px] shrink-0">2</div>
              <p className="text-[12px] font-bold text-gray-600 leading-relaxed">
                Real-time status updates (Online/Offline) are synced directly with edge servers.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stable</span>
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">v2.4.0-ADMIN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
