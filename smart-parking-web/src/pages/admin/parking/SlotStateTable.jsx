import React, { useState } from 'react';
import { Search, X, CheckCircle, AlertCircle, Circle } from 'lucide-react';

export default function SlotStateTable({ slots, selectedSlotId, onSlotSelect }) {
    const [searchQuery, setSearchQuery] = useState('');

    const getStatusStyle = (state) => {
        switch (state.toLowerCase()) {
            case 'active': return 'text-green-500 bg-green-50 border-green-200';
            case 'occupied': return 'text-green-500 bg-green-50 border-green-200';
            case 'error': return 'text-red-500 bg-red-50 border-red-200';
            case 'maintenance': return 'text-red-500 bg-red-50 border-red-200';
            case 'empty': return 'text-gray-400 bg-gray-50 border-gray-200';
            case 'reserved': return 'text-purple-500 bg-purple-50 border-purple-200';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const getDeviceStatusColor = (status) => {
        if (status === 'Online' || status === 'Working') return 'text-green-500';
        if (status === 'Error' || status === 'Offline') return 'text-red-500';
        return 'text-orange-500'; // Maintenance
    };

    const filteredSlots = (slots || []).filter(s => 
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.zone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white flex flex-col h-full shadow-sm" style={{ width: '610px' }}>
            {/* TITLE */}
            <div className="pt-12 pb-6 px-10 text-center">
                <h2 className="text-[#1a1a1a] font-bold text-2xl uppercase font-inter tracking-wide">
                    State of slots
                </h2>
            </div>
            
            {/* SEARCH BAR */}
            <div className="px-10 mb-6">
                <div className="relative bg-[#eeeeee] rounded-md flex items-center h-[36px] px-2">
                    <Search size={24} className="text-gray-500" />
                    <input 
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none ml-2 text-sm placeholder-gray-500"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="ml-1 p-1 hover:bg-gray-200 rounded-full">
                            <X size={18} className="text-gray-500" />
                        </button>
                    )}
                </div>
            </div>

            {/* TABLE AREA */}
            <div className="flex-1 overflow-y-auto px-10 pb-6 custom-scrollbar">
                <table className="w-full border-separate border-spacing-y-2">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-purple-600 text-white font-bold text-[11px] uppercase tracking-tighter">
                            <th className="py-3 px-2 text-left first:rounded-l-lg">Slot ID</th>
                            <th className="py-3 px-2 text-left">Zone</th>
                            <th className="py-3 px-2 text-left">Sensor</th>
                            <th className="py-3 px-2 text-left">Camera</th>
                            <th className="py-3 px-2 text-left">Barrier</th>
                            <th className="py-3 px-2 text-left">State</th>
                            <th className="py-3 px-2 text-left last:rounded-r-lg">Details</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredSlots.map((slot) => (
                            <tr 
                                key={slot.id}
                                onClick={() => onSlotSelect(slot.id)}
                                className={`
                                    cursor-pointer transition-all bg-gray-50 hover:bg-gray-100
                                    ${selectedSlotId === slot.id ? 'ring-2 ring-purple-500' : ''}
                                `}
                            >
                                <td className="py-3 px-2 first:rounded-l-lg font-black text-gray-900">{slot.id}</td>
                                <td className="py-3 px-2 font-bold text-gray-500 text-center">{slot.zone}</td>
                                <td className={`py-3 px-2 font-bold text-[10px] ${getDeviceStatusColor(slot.sensor)}`}>{slot.sensor}</td>
                                <td className={`py-3 px-2 font-bold text-[10px] ${getDeviceStatusColor(slot.camera)}`}>{slot.camera}</td>
                                <td className={`py-3 px-2 font-bold text-[10px] ${getDeviceStatusColor(slot.barrier)}`}>{slot.barrier}</td>
                                <td className={`py-3 px-2`}>
                                    <span className={`px-2 py-1 rounded-md font-black text-[10px] ${getStatusStyle(slot.state)}`}>
                                        {slot.state}
                                    </span>
                                </td>
                                <td className="py-3 px-2 text-[11px] text-gray-400 italic last:rounded-r-lg truncate max-w-[100px]">
                                    {slot.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
