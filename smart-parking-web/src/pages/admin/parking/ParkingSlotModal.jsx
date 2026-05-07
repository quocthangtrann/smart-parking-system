import React from 'react';
import { X, CheckCircle, AlertCircle, Circle, Info } from 'lucide-react';

export default function ParkingSlotModal({ isOpen, onClose, gateName, slots }) {
    if (!isOpen) return null;

    const displaySlots = slots && slots.length > 0 ? slots : [
        { id: 'A01', state: 'error' },
        { id: 'A02', state: 'active' },
        { id: 'A03', state: 'active' },
        { id: 'A04', state: 'empty' },
    ];

    const getSlotStyles = (state) => {
        switch (state.toLowerCase()) {
            case 'active': return 'border-green-500 bg-green-50 text-green-700 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
            case 'occupied': return 'border-green-500 bg-green-50 text-green-700 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
            case 'error': return 'border-red-500 bg-red-50 text-red-700 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
            case 'maintenance': return 'border-red-500 bg-red-50 text-red-700 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
            case 'empty': return 'border-gray-300 bg-gray-50 text-gray-400';
            case 'reserved': return 'border-purple-500 bg-purple-50 text-purple-700 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
            default: return 'border-gray-200 bg-white text-gray-400';
        }
    };

    const getStatusIcon = (state) => {
        switch (state.toLowerCase()) {
            case 'active': return <CheckCircle size={14} />;
            case 'occupied': return <CheckCircle size={14} />;
            case 'error': return <AlertCircle size={14} />;
            case 'maintenance': return <AlertCircle size={14} />;
            case 'reserved': return <CheckCircle size={14} />;
            case 'empty': return <Circle size={14} />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in fade-in duration-300 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-purple-700 p-8 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Detailed Layout: {gateName}</h2>
                        <p className="text-purple-200 text-xs font-bold uppercase tracking-widest">Real-time device monitoring system</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-all"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Legend Section */}
                <div className="bg-gray-50 px-10 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-md bg-green-500 border border-green-600"></div>
                            <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Active / Parked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-md bg-gray-200 border border-gray-300"></div>
                            <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Empty / Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-md bg-red-500 border border-red-600"></div>
                            <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Error / Maintenance</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Info size={16} />
                        <span className="text-[10px] font-bold uppercase">Click a slot for details</span>
                    </div>
                </div>

                {/* Grid Area */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                        {displaySlots.map((slot) => (
                            <div 
                                key={slot.id}
                                className={`
                                    aspect-square rounded-2xl border-4 flex flex-col items-center justify-center gap-2 
                                    transition-all hover:scale-105 cursor-pointer font-black text-lg
                                    ${getSlotStyles(slot.state)}
                                `}
                            >
                                <span className="text-xs opacity-60 uppercase font-bold tracking-widest">{gateName.split(' ').pop()}</span>
                                {slot.id}
                                <div className="mt-1">{getStatusIcon(slot.state)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-gray-100 flex justify-end gap-4 shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                        Close
                    </button>
                    <button className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );
}
