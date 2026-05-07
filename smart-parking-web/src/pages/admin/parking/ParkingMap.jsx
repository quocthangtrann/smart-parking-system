import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, ChevronDown, MapPin } from 'lucide-react';
import SharedMap from '../../../components/SharedMap';

const GATES = [
  { id: "gate-1", name: "Parking Gate 1", lat: 10.7716052, lng: 106.6586973 },
  { id: "gate-2", name: "Parking Gate 2", lat: 10.7728268, lng: 106.6581446 },
  { id: "gate-3", name: "Parking Gate 3", lat: 10.7745171, lng: 106.6606778 }
];

const AVERAGE_CENTER = [10.772983, 106.659173];

export default function ParkingMap({ onGateClick, onExpand }) {
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const [activeGate, setActiveGate] = useState(GATES[0]);

  const handleMapReady = (map, L) => {
    mapInstance.current = map;
    window.L = L;
    renderMarkers();
  };

  const renderMarkers = () => {
    if (!window.L || !mapInstance.current) return;
    const L = window.L;

    // Clear existing
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    GATES.forEach(gate => {
      const customIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="
              width: 32px; 
              height: 32px; 
              background: #ef4444; 
              border-radius: 50% 50% 50% 0; 
              transform: rotate(-45deg); 
              display: flex; 
              align-items: center; 
              justify-content: center;
              border: 2px solid white;
              box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
            ">
              <div style="width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([gate.lat, gate.lng], { icon: customIcon })
        .addTo(mapInstance.current)
        .on('click', () => {
          setActiveGate(gate);
          onGateClick(gate);
        });

      markersRef.current[gate.id] = marker;
    });
  };

  const handleGateSelect = (gate) => {
    setActiveGate(gate);
    if (mapInstance.current) {
        mapInstance.current.flyTo([gate.lat, gate.lng], 18);
    }
  };

  return (
    <div className="bg-white flex flex-col h-full shadow-sm" style={{ width: '606px' }}>
      {/* MAP HEADER */}
      <div className="flex justify-between items-center px-6 h-[70px] shrink-0 border-b border-gray-100">
        <div className="relative group">
          <button className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all">
            <MapPin size={18} className="text-indigo-600" />
            <span className="text-[14px] font-black text-gray-900 uppercase tracking-tight">{activeGate.name}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[2000] p-2">
            {GATES.map(gate => (
              <button 
                key={gate.id}
                onClick={() => handleGateSelect(gate)}
                className={`w-full text-left px-4 py-3 rounded-lg text-[12px] font-bold uppercase transition-all mb-1 last:mb-0
                  ${activeGate.id === gate.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                {gate.name}
              </button>
            ))}
          </div>
        </div>
        
        <button 
            onClick={onExpand}
            className="w-[38px] h-[38px] flex items-center justify-center bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-gray-400 transition-all border border-gray-100 shadow-sm"
        >
            <Maximize2 size={18} />
        </button>
      </div>
      
      {/* MAP VIEW AREA */}
      <div className="flex-1 p-4">
        <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-100 z-0 shadow-inner">
          <SharedMap 
            center={AVERAGE_CENTER} 
            zoom={17} 
            onMapReady={handleMapReady} 
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
