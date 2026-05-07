import React, { useState } from 'react';
import { X } from 'lucide-react';
import SlotGrid from './SlotGrid';

export default function SlotViewModal({ isOpen, onClose, gateName, isAdmin = true }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  if (!isOpen) return null;

  // Mock slots for demonstration (A1-A10, B1-B10, C1-C5)
  const mockSlots = Array.from({ length: 25 }, (_, i) => {
    let prefix = 'A';
    if (i >= 10 && i < 20) prefix = 'B';
    if (i >= 20) prefix = 'C';
    const num = (i % 10) + 1;
    const id = `${prefix}${num}`;
    
    // Deterministic status pattern
    let status = 'Available';
    if (i % 3 === 0) status = 'Occupied';
    if (i === 4 || i === 11 || i === 22) status = 'Reserved';
    
    return { id, status };
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[550px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{gateName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-gray-500 font-bold text-sm">Available slots</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-gray-100 rounded-full transition-all border border-gray-200"
          >
            <X size={28} className="text-gray-900" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <SlotGrid 
            slots={mockSlots} 
            selectedSlot={selectedSlot} 
            onSlotClick={setSelectedSlot}
            isAdmin={isAdmin}
          />
          
          <div className="mt-8 grid grid-cols-3 gap-4 px-4 pb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-lg border-2 border-green-500 bg-white"></div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Available</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 border-2 border-gray-200"></div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Occupied</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 border-2 border-purple-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              </div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Reserved</span>
            </div>
          </div>
        </div>

        {!isAdmin && selectedSlot && (
          <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-15px_30px_rgba(0,0,0,0.05)]">
            <button 
              className="w-full h-16 bg-purple-600 text-white rounded-2xl font-black text-xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 active:scale-95"
              onClick={() => {
                alert(`Slot ${selectedSlot} at ${gateName} has been reserved successfully!`);
                onClose();
              }}
            >
              RESERVE {selectedSlot}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
