import React, { useState, useEffect } from 'react';
import { Settings, WifiOff, Wifi, Wrench } from 'lucide-react';
import KPICard from './KPICard';
import DeviceMap from './DeviceMap';
import DeviceTable from './DeviceTable';
import MapModal from './MapModal';
import { fetchAPI, socket } from '../../../api/config';

export default function DevicesPage() {
    const [devices, setDevices] = useState([]);
    const [selectedGateId, setSelectedGateId] = useState(null);
    const [isMapExpanded, setIsMapExpanded] = useState(false);

    const loadDevices = async () => {
        try {
            const data = await fetchAPI('/devices');
            setDevices(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadDevices();
        if (socket) {
            socket.on('device_update', (updatedDevice) => {
                setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
            });
        }
        return () => {
            if (socket) socket.off('device_update');
        };
    }, []);

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
                        value={devices.length} 
                        icon={Settings}
                        iconColor="text-gray-600"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Disconnected" 
                        value={devices.filter(d => d.state === 'offline' || d.state === 'error').length} 
                        icon={WifiOff}
                        iconColor="text-red-500"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Online" 
                        value={devices.filter(d => d.state === 'online').length} 
                        icon={Wifi}
                        iconColor="text-purple-600"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Maintenance" 
                        value={devices.filter(d => d.state === 'maintenance').length} 
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
                        devices={devices}
                    />
                </div>

                {/* RIGHT PANEL: DEVICE LIST (W: 610, H: 594) */}
                <div style={{ width: '610px', height: '594px' }} className="shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm ml-auto bg-white">
                    <DeviceTable 
                        devices={devices}
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
