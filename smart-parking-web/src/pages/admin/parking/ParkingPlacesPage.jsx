import React, { useState } from 'react';
import { Bell, Mail, FileText, ShieldAlert } from 'lucide-react';
import KPICard from '../devices/KPICard';
import ParkingMap from './ParkingMap';
import SlotStateTable from './SlotStateTable';
import ParkingSlotModal from './ParkingSlotModal';
import MapModal from '../devices/MapModal';

export default function ParkingPlacesPage() {
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [activeGate, setActiveGate] = useState(null);
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

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
                        value="140" 
                        icon={Bell}
                        iconColor="text-indigo-600"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Unread" 
                        value="6" 
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
                        value="2" 
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
