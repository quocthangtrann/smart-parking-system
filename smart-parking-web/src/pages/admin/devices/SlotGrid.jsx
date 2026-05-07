import React from 'react';
import { Check, X } from 'lucide-react';

export default function SlotGrid({ slots, selectedSlot, onSlotClick, isAdmin = false }) {
  return (
    <div className="grid grid-cols-5 gap-4 max-w-[500px] mx-auto p-4">
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot.id;
        const isReserved = slot.status === 'Reserved';
        const isOccupied = slot.status === 'Occupied';
        const isAvailable = slot.status === 'Available';

        let borderColor = 'border-gray-200';
        let bgColor = 'bg-white';
        let textColor = 'text-gray-700';

        if (isAvailable) {
          borderColor = isSelected ? 'border-purple-600' : 'border-green-500';
          bgColor = isSelected ? 'bg-purple-50' : 'bg-white';
          textColor = isSelected ? 'text-purple-700' : 'text-green-700';
        } else if (isOccupied) {
          borderColor = 'border-gray-200';
          bgColor = 'bg-gray-100';
          textColor = 'text-gray-400';
        } else if (isReserved) {
          borderColor = 'border-purple-500';
          bgColor = 'bg-purple-100';
          textColor = 'text-purple-600';
        }

        return (
          <button
            key={slot.id}
            disabled={isOccupied || isReserved || (isAdmin && isAvailable)}
            onClick={() => onSlotClick(slot.id)}
            className={`
              relative aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200
              ${borderColor} ${bgColor} ${textColor}
              ${(isOccupied || isReserved || isAdmin) ? 'cursor-not-allowed opacity-80' : 'hover:shadow-lg hover:scale-105 cursor-pointer'}
              ${isSelected ? 'ring-2 ring-purple-600 ring-offset-2' : ''}
            `}
          >
            <span className="text-[14px] font-black">{slot.id}</span>
            {isReserved && <Check size={18} strokeWidth={3} className="mt-1" />}
            {isOccupied && <X size={18} strokeWidth={3} className="mt-1" />}
          </button>
        );
      })}
    </div>
  );
}
