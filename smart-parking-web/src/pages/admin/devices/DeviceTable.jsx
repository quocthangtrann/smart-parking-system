import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function DeviceTable({ devices, selectedDeviceId, onDeviceSelect }) {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online': return 'text-green-500';
      case 'disconnected': return 'text-red-500';
      case 'maintenance': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white flex flex-col h-full shadow-sm" style={{ width: '610px' }}>
      {/* DEVICE LIST TITLE */}
      <div className="pt-12 pb-6 px-10 text-center">
        <h2 className="text-[#1a1a1a] font-bold text-2xl uppercase font-inter tracking-wide">
          Devices List
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
            <tr className="bg-purple-600 text-white font-bold text-[13px] uppercase">
              <th className="py-3 px-4 text-left first:rounded-l-lg last:rounded-r-lg">ID</th>
              <th className="py-3 px-4 text-left">Devices</th>
              <th className="py-3 px-4 text-left">Position</th>
              <th className="py-3 px-4 text-left">State</th>
              <th className="py-3 px-4 text-left last:rounded-r-lg">Time response</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredDevices.map((device) => (
              <tr 
                key={device.id}
                onClick={() => onDeviceSelect(device.id)}
                className={`
                  cursor-pointer transition-all bg-gray-100 hover:bg-gray-200
                  ${selectedDeviceId === device.id ? 'ring-2 ring-purple-500' : ''}
                `}
              >
                <td className="py-3 px-4 first:rounded-l-lg font-medium text-gray-700">{device.id}</td>
                <td className="py-3 px-4 font-bold text-gray-900">{device.name}</td>
                <td className="py-3 px-4 text-gray-600">{device.position}</td>
                <td className={`py-3 px-4 font-bold uppercase text-[11px] ${getStatusColor(device.status)}`}>
                  {device.status}
                </td>
                <td className="py-3 px-4 text-gray-500 last:rounded-r-lg">{device.response}</td>
              </tr>
            ))}
            {filteredDevices.length === 0 && (
              <tr>
                <td colSpan="5" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                  No devices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
