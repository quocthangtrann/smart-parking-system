import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, ChevronDown } from 'lucide-react';
import SharedMap from '../../../components/SharedMap';

const GATES = [
  { id: "gate-1", name: "Gate 1", lat: 10.7716052, lng: 106.6586973 },
  { id: "gate-2", name: "Gate 2", lat: 10.7728268, lng: 106.6581446 },
  { id: "gate-3", name: "Gate 3", lat: 10.7745171, lng: 106.6606778 }
];

const AVERAGE_CENTER = [10.772983, 106.659173];

export default function DeviceMap({ selectedDeviceId, onDeviceSelect, onExpand }) {
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
              width: 30px; 
              height: 30px; 
              background: #ef4444; 
              border-radius: 50% 50% 50% 0; 
              transform: rotate(-45deg); 
              display: flex; 
              align-items: center; 
              justify-content: center;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">
              <div style="width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      const marker = L.marker([gate.lat, gate.lng], { icon: customIcon })
        .addTo(mapInstance.current)
        .on('click', () => {
          onDeviceSelect(gate.id);
          setActiveGate(gate);
        });

      markersRef.current[gate.id] = marker;
    });
  };

  useEffect(() => {
    if (selectedDeviceId && markersRef.current[selectedDeviceId] && mapInstance.current) {
      const marker = markersRef.current[selectedDeviceId];
      const gate = GATES.find(g => g.id === selectedDeviceId);
      if (gate) setActiveGate(gate);
      mapInstance.current.flyTo(marker.getLatLng(), 18, { animate: true, duration: 1 });
    }
  }, [selectedDeviceId]);

  const handleGateSelect = (gate) => {
    setActiveGate(gate);
    onDeviceSelect(gate.id);
  };

  return (
    <div className="bg-white flex flex-col h-full shadow-sm" style={{ width: '606px' }}>
      {/* MAP HEADER */}
      <div className="flex justify-between items-center px-6 h-[70px] shrink-0 border-b border-gray-100">
        <div className="relative group">
          <button className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-[14px] font-bold text-gray-900 font-inter">Parking {activeGate.name}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[1000]">
            {GATES.map(gate => (
              <button 
                key={gate.id}
                onClick={() => handleGateSelect(gate)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[13px] font-bold text-gray-700 border-b last:border-0"
              >
                Parking {gate.name}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={onExpand}
          className="w-[38px] h-[38px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors border border-gray-200"
        >
          <Maximize2 size={20} />
        </button>
      </div>
      
      {/* MAP VIEW AREA */}
      <div className="flex-1 p-4">
        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 z-0">
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
