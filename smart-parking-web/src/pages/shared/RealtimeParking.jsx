import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Navigation, Clock, CreditCard, ChevronDown, Check, X } from 'lucide-react';
import logoBk from '../../assets/logobk.png';
import SharedMap from '../../components/SharedMap';

// Standard header component
const Header = ({ onBack }) => (
    <header className="h-[77px] bg-[#210F7A] flex items-center px-[17px] shrink-0 z-20 shadow-md sticky top-0">
        <button onClick={onBack} className="p-1 mr-2 rounded hover:bg-white/10 transition-colors">
            <ChevronLeft size={22} className="text-white" />
        </button>
        <div className="w-[45px] h-[45px] bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
            <img src={logoBk} alt="BK Logo" className="w-full h-full object-contain p-0.5" />
        </div>
        <h1 className="text-white text-[16px] font-semibold ml-[14px]">
            Parking Management System
        </h1>
    </header>
);

const MOCK_GATES_CS2 = [
    { id: 1, name: 'Gate C', lat: 10.8795, lng: 106.8062, totalSlots: 150, available: 120, distance: '1.2 km', time: '5 mins', fare: '3,000 đ', open: '6:00 AM - 10:00 PM' },
    { id: 2, name: 'Gate A', lat: 10.8805, lng: 106.8050, totalSlots: 50, available: 15, distance: '1.5 km', time: '7 mins', fare: '3,000 đ', open: '6:00 AM - 8:00 PM' },
    { id: 3, name: 'Gate B', lat: 10.8785, lng: 106.8040, totalSlots: 100, available: 0, distance: '1.8 km', time: '8 mins', fare: '3,000 đ', open: '6:00 AM - 10:00 PM' }
];

const MOCK_GATES_CS1 = [
    { id: 'gate-1', name: 'Gate 1', lat: 10.7716052, lng: 106.6586973, totalSlots: 100, available: 80, distance: '50 m', time: '1 min', fare: '3,000 đ', open: '6:00 AM - 10:00 PM', recommended: false },
    { id: 'gate-2', name: 'Gate 2', lat: 10.7728268, lng: 106.6581446, totalSlots: 80, available: 25, distance: '100 m', time: '2 mins', fare: '3,000 đ', open: '6:00 AM - 10:00 PM', recommended: false },
    { id: 'gate-3', name: 'Gate 3', lat: 10.7745171, lng: 106.6606778, totalSlots: 120, available: 120, distance: '300 m', time: '4 mins', fare: '3,000 đ', open: '6:00 AM - 10:00 PM', recommended: true }
];

export default function RealtimeParking() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const user = state?.user;
    const isStudent = user?.role?.toLowerCase() === 'student';
    const mapInstance = useRef(null);
    const markersRef = useRef({});

    const [campus, setCampus] = useState('CS1');
    const [gates, setGates] = useState(MOCK_GATES_CS1);
    const [selectedGate, setSelectedGate] = useState(null);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleMapReady = (map, L) => {
        mapInstance.current = map;
        window.L = L;
        renderMarkers(gates);
    };

    // Helper to get marker color
    const getStatusColor = (available) => {
        if (available >= 20) return '#10B981'; // Green
        if (available > 0) return '#F59E0B'; // Orange
        return '#EF4444'; // Red
    };

    // Render Leaflet Markers
    const renderMarkers = (currentGates) => {
        if (!window.L || !mapInstance.current) return;
        const L = window.L;

        // Clear existing markers
        Object.values(markersRef.current).forEach(m => m.remove());
        markersRef.current = {};

        currentGates.forEach(gate => {
            const color = getStatusColor(gate.available);
            
            const customIcon = L.divIcon({
                className: 'custom-leaflet-marker',
                html: `
                    <div style="background: white; border: 2px solid ${color}; border-radius: 12px; padding: 6px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer; display: flex; flex-direction: column; align-items: center; white-space: nowrap;">
                        <span style="font-size: 13px; font-weight: bold; color: #1e293b;">${gate.name}</span>
                        <div style="display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></div>
                            <span style="font-size: 12px; font-weight: bold; color: ${color};">${gate.available} slots</span>
                        </div>
                    </div>
                `,
                iconSize: [80, 50],
                iconAnchor: [40, 25] // Center anchor
            });

            const marker = L.marker([gate.lat, gate.lng], { icon: customIcon })
                .addTo(mapInstance.current)
                .on('click', () => {
                    setSelectedGate(gate);
                    setShowBottomSheet(true);
                    mapInstance.current.flyTo([gate.lat, gate.lng], 16, { animate: true, duration: 0.5 });
                });

            markersRef.current[gate.id] = marker;
        });
    };

    // Handle campus change
    useEffect(() => {
        if (!mapInstance.current) return;
        if (campus === 'CS1') {
            setGates(MOCK_GATES_CS1);
            mapInstance.current.flyTo([10.7729, 106.6592], 17, { animate: true, duration: 1 });
        } else {
            setGates(MOCK_GATES_CS2);
            mapInstance.current.flyTo([10.8795, 106.8062], 15, { animate: true, duration: 1 });
        }
        setShowBottomSheet(false);
        setSelectedGate(null);
    }, [campus]);

    // Update markers when gates change
    useEffect(() => {
        renderMarkers(gates);
    }, [gates]);

    // Real-time Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setGates(prev => prev.map(gate => {
                const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
                let newAvailable = gate.available + fluctuation;
                if (newAvailable < 0) newAvailable = 0;
                if (newAvailable > gate.totalSlots) newAvailable = gate.totalSlots;
                return { ...gate, available: newAvailable };
            }));
            setLastUpdated(new Date());
        }, 5000); // Every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Sync selectedGate with live data
    useEffect(() => {
        if (selectedGate) {
            const liveGate = gates.find(g => g.id === selectedGate.id);
            if (liveGate && liveGate.available !== selectedGate.available) {
                setSelectedGate(liveGate);
            }
        }
    }, [gates]);

    return (
        <div className="min-h-screen bg-slate-300 flex items-center justify-center font-sans">
            <div
                className="relative flex flex-col bg-white overflow-hidden"
                style={{ width: 375, height: 812, borderRadius: 36, border: '8px solid #1e293b', boxShadow: '0 32px 80px rgba(0,0,0,0.45)' }}
            >
                <Header onBack={() => navigate(-1)} />

                <div className="flex-1 flex flex-col bg-gray-50 relative">
                    
                    {/* Top Overlay */}
                    <div className="absolute top-0 left-0 right-0 z-10 p-[16px] pointer-events-none">
                        
                        {/* Breadcrumb */}
                        <div className="mb-[12px] text-[13px] text-gray-500 font-medium flex items-center gap-1 bg-white/90 backdrop-blur px-3 py-2 rounded-full w-fit shadow-sm pointer-events-auto">
                            <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-[#210F7A] transition-colors">Home</span>
                            <ChevronRight size={14} className="text-gray-400" />
                            <span className="text-[#210F7A] font-bold">Realtime Parking</span>
                        </div>

                        <div className="flex items-center justify-between pointer-events-auto">
                            {/* Campus Dropdown */}
                            <div className="relative">
                                <select 
                                    value={campus}
                                    onChange={(e) => setCampus(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 shadow-md rounded-full pl-[16px] pr-[36px] py-[10px] text-[14px] font-bold text-[#210F7A] outline-none cursor-pointer focus:border-[#5C2FFF] focus:ring-2 focus:ring-[#5C2FFF]/20"
                                >
                                    <option value="CS1">Lý Thường Kiệt (CS1)</option>
                                    <option value="CS2">Dĩ An (CS2)</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#210F7A] pointer-events-none" />
                            </div>

                            {/* Live Badge */}
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-md border border-gray-100">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-[12px] font-bold text-gray-700">LIVE</span>
                            </div>
                        </div>
                    </div>

                    {/* Leaflet Map Container */}
                    <SharedMap 
                        center={[10.7729, 106.6592]} 
                        zoom={17} 
                        onMapReady={handleMapReady} 
                    />

                    {/* Last Updated Toast */}
                    <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-4 py-1.5 rounded-full shadow-lg transition-all" style={{ opacity: showBottomSheet ? 0 : 1 }}>
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                </div>

                {/* BOTTOM SHEET (GATE DETAIL) */}
                {showBottomSheet && selectedGate && (
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-white rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col transition-transform transform translate-y-0 animation-slide-up pb-[20px]">
                        
                        {/* Drag Handle */}
                        <div className="w-full flex justify-center pt-[12px] pb-[8px] cursor-pointer" onClick={() => setShowBottomSheet(false)}>
                            <div className="w-[40px] h-[4px] bg-gray-300 rounded-full" />
                        </div>

                        <div className="px-[20px]">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-[16px]">
                                <div>
                                    <h2 className="text-[22px] font-black text-gray-900 mb-1">{selectedGate.name}</h2>
                                    <p className="text-[13px] text-gray-500 font-medium">HCMUT - {campus}</p>
                                </div>
                                <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 font-bold text-[13px]`} style={{ backgroundColor: `${getStatusColor(selectedGate.available)}15`, color: getStatusColor(selectedGate.available) }}>
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(selectedGate.available) }} />
                                    {selectedGate.available} slots left
                                </div>
                            </div>

                            {/* Capacity Bar */}
                            <div className="mb-[20px]">
                                <div className="flex justify-between text-[12px] font-bold mb-[6px]">
                                    <span className="text-gray-600">Capacity</span>
                                    <span className="text-gray-900">{selectedGate.totalSlots - selectedGate.available} / {selectedGate.totalSlots}</span>
                                </div>
                                <div className="w-full h-[8px] bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-500 ease-out" 
                                        style={{ 
                                            width: `${((selectedGate.totalSlots - selectedGate.available) / selectedGate.totalSlots) * 100}%`,
                                            backgroundColor: getStatusColor(selectedGate.available)
                                        }} 
                                    />
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-[12px] mb-[20px]">
                                <div className="bg-gray-50 p-[12px] rounded-[12px] border border-gray-100">
                                    <MapPin size={16} className="text-[#5C2FFF] mb-2" />
                                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Distance</div>
                                    <div className="text-[14px] font-bold text-gray-900">{selectedGate.distance} <span className="text-gray-400 font-medium text-[12px]">({selectedGate.time})</span></div>
                                </div>
                                <div className="bg-gray-50 p-[12px] rounded-[12px] border border-gray-100">
                                    <Clock size={16} className="text-[#5C2FFF] mb-2" />
                                    <div className="text-[12px] text-gray-500 font-medium mb-0.5">Open Hours</div>
                                    <div className="text-[14px] font-bold text-gray-900">{selectedGate.open}</div>
                                </div>
                            </div>

                            {/* CTA */}
                            <button 
                                disabled={selectedGate.available === 0}
                                onClick={() => setShowSlotModal(true)}
                                className={`w-full h-[52px] rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all ${
                                    selectedGate.available === 0 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-[#5C2FFF] text-white hover:bg-purple-700 shadow-[0_8px_20px_rgba(92,47,255,0.25)]'
                                }`}
                            >
                                View available slots
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* MODAL 3: SLOT GRID */}
                {showSlotModal && selectedGate && (
                    <div className="absolute inset-0 z-50 bg-white flex flex-col animation-slide-up">
                        {/* Header */}
                        <div className="h-[60px] border-b border-gray-100 flex items-center px-[16px] justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowSlotModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <ChevronLeft size={24} className="text-gray-900" />
                                </button>
                                <div>
                                    <h3 className="text-[16px] font-bold text-gray-900">Select Slot - {selectedGate.name}</h3>
                                    <p className="text-[12px] text-gray-500 font-medium">{selectedGate.available} slots available</p>
                                </div>
                            </div>
                        </div>

                        {/* Legends */}
                        <div className="flex items-center justify-center gap-6 py-[16px] border-b border-gray-50 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-[16px] h-[16px] border-2 border-green-500 bg-white rounded-md"></div>
                                <span className="text-[12px] font-bold text-gray-600">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-[16px] h-[16px] bg-red-100 border border-red-200 rounded-md flex items-center justify-center"><X size={12} className="text-red-500"/></div>
                                <span className="text-[12px] font-bold text-gray-600">Occupied</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-[16px] h-[16px] bg-[#5C2FFF] rounded-md"></div>
                                <span className="text-[12px] font-bold text-gray-600">Selected</span>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto p-[20px] bg-gray-50">
                            <div className="grid grid-cols-5 gap-[12px] max-w-[400px] mx-auto">
                                {Array.from({ length: 50 }).map((_, i) => {
                                    const slotId = `A${i + 1}`;
                                    // Mock occupied logic based on total and available
                                    const isOccupied = i % 5 === 0 || i % 7 === 0; // deterministic random looking
                                    const isSelected = selectedSlot === slotId;

                                    let cellStyle = "aspect-[2/3] rounded-[8px] border-2 flex items-center justify-center text-[12px] font-bold transition-all cursor-pointer shadow-sm";
                                    
                                    if (isSelected) {
                                        cellStyle += " bg-[#5C2FFF] border-[#5C2FFF] text-white shadow-md transform scale-105";
                                    } else if (isOccupied) {
                                        cellStyle += " bg-red-50 border-red-100 text-red-400 cursor-not-allowed opacity-70";
                                    } else {
                                        cellStyle += " bg-white border-green-500 text-green-700 hover:bg-green-50";
                                    }

                                    return (
                                        <button 
                                            key={slotId}
                                            disabled={isOccupied}
                                            onClick={() => setSelectedSlot(isSelected ? null : slotId)}
                                            className={cellStyle}
                                        >
                                            {isOccupied ? <X size={16} /> : slotId}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        {selectedSlot && (
                            <div className="p-[20px] bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] shrink-0 animation-slide-up">
                                <div className="flex items-center justify-between mb-[16px]">
                                    <div>
                                        <p className="text-[12px] text-gray-500 font-medium">Selected Slot</p>
                                        <p className="text-[20px] font-black text-[#5C2FFF]">{selectedSlot}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[12px] text-gray-500 font-medium">Est. Fee</p>
                                        <p className="text-[16px] font-bold text-gray-900">{selectedGate.fare}</p>
                                    </div>
                                </div>
                                <button 
                                    disabled={isStudent}
                                    onClick={() => navigate('/lecturer/reserve', { state: { user } })}
                                    className={`w-full h-[52px] font-bold text-[15px] rounded-[16px] transition-colors ${
                                        isStudent 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-[#5C2FFF] text-white shadow-[0_8px_20px_rgba(92,47,255,0.25)] hover:bg-purple-700'
                                    }`}
                                >
                                    {isStudent ? 'Only Lecturer can reserve' : 'Reserve this slot'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <style>{`
                ::-webkit-scrollbar { display: none; }
                * { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animation-slide-up {
                    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .leaflet-container { font-family: inherit; }
                .leaflet-div-icon { background: transparent; border: none; }
                .leaflet-control-attribution { display: none; } /* Clean UI */
            `}</style>
        </div>
    );
}
