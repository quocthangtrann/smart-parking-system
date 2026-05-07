import React from 'react';
import { X } from 'lucide-react';
import DeviceMap from './DeviceMap';

export default function MapModal({ isOpen, onClose, selectedDeviceId, onDeviceSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8">
      <div className="bg-white w-full h-full rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300">
        <div className="absolute top-8 right-8 z-20">
          <button 
            onClick={onClose} 
            className="p-4 bg-white hover:bg-red-50 text-gray-900 hover:text-red-600 rounded-full shadow-2xl border border-gray-100 transition-all active:scale-95"
          >
            <X size={32} />
          </button>
        </div>
        
        <div className="flex-1 w-full h-full p-4">
          <DeviceMap 
            selectedDeviceId={selectedDeviceId}
            onDeviceSelect={onDeviceSelect}
            onExpand={() => {}} // No-op in modal
          />
        </div>
      </div>
    </div>
  );
}
