import React, { useState, useEffect } from 'react';
import { Bell, Mail, FileText, ShieldAlert } from 'lucide-react';
import KPICard from '../devices/KPICard';
import ParkingMap from './ParkingMap';
import SlotStateTable from './SlotStateTable';
import ParkingSlotModal from './ParkingSlotModal';
import MapModal from '../devices/MapModal';
import { socket, fetchAPI } from '../../../api/config';

export default function ParkingPlacesPage() {
    const [slots, setSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [activeGate, setActiveGate] = useState(null);
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

    useEffect(() => {
        // Fetch initial slots
        fetchAPI('/parking-slots').then(data => setSlots(data)).catch(console.error);

        // Listen for realtime updates
        if (socket) {
            socket.on('slot_update', (updatedSlot) => {
                setSlots(prev => prev.map(s => s.id === updatedSlot.id ? updatedSlot : s));
            });
        }

        return () => {
            if (socket) socket.off('slot_update');
        };
    }, []);

    const handleSlotSelect = (slotId) => {
        setSelectedSlotId(slotId);
    };

    const handleGateClick = (gate) => {
        setActiveGate(gate);
        setIsSlotModalOpen(true);
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-x-auto pb-10">
            
            {/* 1. BREADCRUMB */}
            <div className="flex items-center text-[13px] font-medium text-gray-400">
                <span>Home</span>
                <span className="mx-2 text-gray-300 font-normal">&gt;</span>
                <span className="text-gray-500 font-bold uppercase tracking-tighter">Parking Places</span>
            </div>

            {/* 2. KPI CARDS */}
            <div className="flex flex-row flex-nowrap gap-6 w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Notifications" 
                        value={slots.length > 0 ? "140" : "0"} 
                        icon={Bell}
                        iconColor="text-indigo-600"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Unread" 
                        value={slots.filter(s => s.state === 'error').length} 
                        icon={Mail}
                        iconColor="text-rose-500"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Requests" 
                        value="122" 
                        icon={FileText}
                        iconColor="text-amber-500"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Security alert" 
                        value={slots.filter(s => s.state === 'error').length} 
                        icon={ShieldAlert}
                        iconColor="text-red-600"
                    />
                </div>
            </div>

            {/* 3. MAIN CONTENT (SAME HEIGHT SPLIT) */}
            <div className="flex flex-row justify-between w-full min-w-[1250px] gap-8 h-[600px] items-start mt-4">
                
                {/* LEFT: MAP (50%) */}
                <div style={{ width: '606px', height: '594px' }} className="shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
                    <ParkingMap 
                        onGateClick={handleGateClick}
                        onExpand={() => setIsMapExpanded(true)}
                    />
                </div>

                {/* RIGHT: STATE OF SLOTS (50%) */}
                <div style={{ width: '610px', height: '594px' }} className="shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-sm ml-auto bg-white">
                    <SlotStateTable 
                        slots={slots}
                        selectedSlotId={selectedSlotId}
                        onSlotSelect={handleSlotSelect}
                    />
                </div>
            </div>

            {/* DETAILED SLOT MODAL */}
            <ParkingSlotModal 
                isOpen={isSlotModalOpen}
                onClose={() => setIsSlotModalOpen(false)}
                gateName={activeGate?.name || 'Gate 1'}
                slots={slots.filter(s => s.gate === activeGate?.name)}
            />

            {/* MAP EXPAND MODAL */}
            <MapModal 
                isOpen={isMapExpanded}
                onClose={() => setIsMapExpanded(false)}
                selectedDeviceId={null}
                onDeviceSelect={() => {}}
            />
        </div>
    );
}
