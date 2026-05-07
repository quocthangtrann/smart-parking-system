import React from 'react';
import { Settings, RefreshCw, Wrench, FileText, Clock, Server, Globe } from 'lucide-react';
import { getDeviceIcon, getStatusConfig } from './DeviceCard';

export default function DeviceDetailPanel({ device, onClose }) {
  if (!device) return null;

  const statusCfg = getStatusConfig(device.status);

  return (
    <div className="w-[380px] bg-white border-l border-gray-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 h-full">
      <div className="p-8 border-b border-gray-100 bg-slate-50/50">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-2xl ${statusCfg.bg} ${statusCfg.color} border ${statusCfg.border} shadow-sm`}>
            {getDeviceIcon(device.type, 32)}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-widest border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
            {statusCfg.icon}
            {statusCfg.label}
          </div>
        </div>

        <h3 className="text-2xl font-black text-gray-900 leading-tight uppercase tracking-tight">{device.name}</h3>
        <p className="text-gray-400 font-bold text-sm uppercase mt-1 tracking-widest flex items-center gap-2">
          <span className="text-indigo-600">ID: {device.id}</span>
          <span className="opacity-20">•</span>
          <span>{device.type.replace('_', ' ')}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Real-time stats */}
        <section>
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Diagnostics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="text-gray-400 mb-1 flex items-center gap-2">
                <Clock size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Latency</span>
              </div>
              <div className="text-xl font-black text-gray-900">{device.response || '12ms'}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="text-gray-400 mb-1 flex items-center gap-2">
                <Server size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Uptime</span>
              </div>
              <div className="text-xl font-black text-gray-900">99.8%</div>
            </div>
          </div>
        </section>

        {/* Network Info */}
        <section>
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Network Details</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-sm font-bold text-gray-500">IP Address</span>
              <span className="text-sm font-black text-gray-900">192.168.1.{device.id.slice(-2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-sm font-bold text-gray-500">MAC Address</span>
              <span className="text-sm font-black text-gray-900">00:1A:2B:3C:4D:{device.id.slice(-2)}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-bold text-gray-500">Last Seen</span>
              <span className="text-sm font-black text-gray-900">2 minutes ago</span>
            </div>
          </div>
        </section>

        {/* Admin Actions */}
        <section>
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Maintenance Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white p-4 rounded-2xl font-black text-[12px] uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <RefreshCw size={16} />
              Restart
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-100 p-4 rounded-2xl font-black text-[12px] uppercase tracking-wider hover:border-indigo-600 hover:text-indigo-600 transition-all">
              <Wrench size={16} />
              Service
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 bg-gray-900 text-white p-4 rounded-2xl font-black text-[12px] uppercase tracking-wider hover:bg-black transition-all shadow-xl">
              <FileText size={16} />
              View Event Logs
            </button>
          </div>
        </section>
      </div>
      
      <div className="p-8 border-t border-gray-100 bg-gray-50/50">
        <button 
          onClick={onClose}
          className="w-full h-14 bg-white text-gray-500 border-2 border-gray-200 rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
}
