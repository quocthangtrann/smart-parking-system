import React, { useState } from 'react';
import { Settings, WifiOff, Wifi, Wrench } from 'lucide-react';
import KPICard from './KPICard';
import DeviceMap from './DeviceMap';
import DeviceTable from './DeviceTable';
import MapModal from './MapModal';

const MOCK_GATES = [
    { id: 'gate-1', name: 'Gate 1', status: 'Online', position: 'North Entrance', response: '12ms' },
    { id: 'gate-2', name: 'Gate 2', status: 'Online', position: 'South Entrance', response: '8ms' },
    { id: 'gate-3', name: 'Gate 3', status: 'Online', position: 'Main Plaza', response: '15ms' },
];

export default function DevicesPage() {
    const [selectedGateId, setSelectedGateId] = useState(null);
    const [isMapExpanded, setIsMapExpanded] = useState(false);

    const handleGateClick = (gateId) => {
        setSelectedGateId(gateId);
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-x-auto pb-10">
            
            {/* 1. BREADCRUMB */}
            <div className="flex items-center text-[13px] font-medium text-gray-400">
                <span>Home</span>
                <span className="mx-2 text-gray-300 font-normal">&gt;</span>
                <span className="text-gray-500">Devices</span>
            </div>

            {/* 2. KPI CARDS (STRICT ONE ROW, NO WRAP) */}
            <div className="flex flex-row flex-nowrap gap-6 w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="All Devices" 
                        value="140" 
                        icon={Settings}
                        iconColor="text-gray-600"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Disconnected" 
                        value="30" 
                        icon={WifiOff}
                        iconColor="text-red-500"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Online" 
                        value="122" 
                        icon={Wifi}
                        iconColor="text-purple-600"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Maintenance" 
                        value="140" 
                        icon={Wrench}
                        iconColor="text-orange-500"
                    />
                </div>
            </div>

            {/* 3. MAIN CONTENT (STRICT PIXEL-BASED ALIGNMENT) */}
            <div className="flex flex-row justify-between w-full min-w-[1250px] gap-8 h-[600px] items-start mt-4">
                
                {/* LEFT PANEL: MAP SECTION (W: 606, H: 582 -> adjusted to 594 for same height) */}
                <div style={{ width: '606px', height: '594px' }} className="shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                    <DeviceMap 
                        selectedDeviceId={selectedGateId}
                        onDeviceSelect={handleGateClick}
                        onExpand={() => setIsMapExpanded(true)}
                    />
                </div>

                {/* RIGHT PANEL: DEVICE LIST (W: 610, H: 594) */}
                <div style={{ width: '610px', height: '594px' }} className="shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm ml-auto bg-white">
                    <DeviceTable 
                        devices={MOCK_GATES}
                        selectedDeviceId={selectedGateId}
                        onDeviceSelect={handleGateClick}
                    />
                </div>
            </div>

            {/* MAP EXPAND MODAL */}
            <MapModal 
                isOpen={isMapExpanded}
                onClose={() => setIsMapExpanded(false)}
                selectedDeviceId={selectedGateId}
                onDeviceSelect={handleGateClick}
            />
        </div>
    );
}
