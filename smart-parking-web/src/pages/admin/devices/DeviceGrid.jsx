import React from 'react';
import DeviceCard from './DeviceCard';

export default function DeviceGrid({ devices, selectedDeviceId, onDeviceClick }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-2">
      {devices.map((device) => (
        <DeviceCard 
          key={device.id}
          device={device}
          isSelected={selectedDeviceId === device.id}
          onClick={onDeviceClick}
        />
      ))}
    </div>
  );
}
