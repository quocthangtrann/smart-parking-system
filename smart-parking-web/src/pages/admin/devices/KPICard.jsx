import React from 'react';

export default function KPICard({ title, value, icon: Icon, iconColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 flex-1">
      <div className={`p-4 rounded-full bg-gray-50 ${iconColor || 'text-gray-600'}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="flex flex-col">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
    </div>
  );
}
