import React from 'react';
import { Camera, Radio, CircleSlash, ScanLine, Wrench, AlertCircle, CheckCircle2 } from 'lucide-react';

export const getDeviceIcon = (type, size = 20) => {
  switch (type.toLowerCase()) {
    case 'camera': return <Camera size={size} />;
    case 'sensor': return <Radio size={size} />;
    case 'barrier': return <CircleSlash size={size} />;
    case 'license_plate_reader': return <ScanLine size={size} />;
    default: return <Camera size={size} />;
  }
};

export const getStatusConfig = (status) => {
  switch (status.toLowerCase()) {
    case 'online': return { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle2 size={12} />, label: 'Online' };
    case 'offline': return { color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', icon: <AlertCircle size={12} />, label: 'Disconnected' };
    case 'maintenance': return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Wrench size={12} />, label: 'Maintenance' };
    default: return { color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: null, label: 'Unknown' };
  }
};

export default function DeviceCard({ device, isSelected, onClick }) {
  const statusCfg = getStatusConfig(device.status);

  return (
    <div 
      onClick={() => onClick(device)}
      className={`
        relative group cursor-pointer transition-all duration-300
        p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3
        ${isSelected ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-105 z-10' : 'border-gray-100 bg-white hover:border-indigo-300 hover:shadow-md'}
      `}
    >
      <div className={`p-3 rounded-full ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
        {getDeviceIcon(device.type, 24)}
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className={`text-[13px] font-black uppercase tracking-tight ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
          {device.id}
        </span>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
          {statusCfg.icon}
          {statusCfg.label}
        </div>
        <div className="mt-1 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
          Position: {device.position || 'N/A'}
        </div>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
        <div className="font-bold border-b border-white/20 mb-1 pb-1">{device.name}</div>
        <div>Response: {device.response || '15ms'}</div>
      </div>
    </div>
  );
}
