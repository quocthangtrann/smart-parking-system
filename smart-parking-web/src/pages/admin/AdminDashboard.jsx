import React from 'react';
import { Activity, Car, CheckCircle, XCircle, AlertTriangle, MapPin } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────
// KPI CARD COMPONENT
// ─────────────────────────────────────────────────────────────
export const KPICard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-white rounded-[12px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-[14px] font-medium">{title}</h3>
            {Icon && <div className={`p-2 rounded-lg ${colorClass}`}><Icon size={20} /></div>}
        </div>
        <div>
            <div className="text-[28px] font-bold text-gray-800">{value}</div>
            {subtitle && <div className="text-[12px] text-gray-400 mt-1">{subtitle}</div>}
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────
// INFO CARD COMPONENT
// ─────────────────────────────────────────────────────────────
const InfoCard = ({ title, children, linkText }) => (
    <div className="bg-white rounded-[12px] p-5 shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 text-[16px] font-bold">{title}</h3>
            {linkText && <span className="text-[#2d3a8c] text-[13px] font-semibold cursor-pointer hover:underline">{linkText}</span>}
        </div>
        <div className="flex-1 flex flex-col justify-center">
            {children}
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD CONTENT
// ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    return (
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            
            {/* ROW 1: KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard 
                    title="Daily Revenue" 
                    value="6.000.000 VND" 
                    icon={Activity}
                    colorClass="bg-green-100 text-green-600"
                    subtitle="+12% from yesterday"
                />
                <KPICard 
                    title="Disconnected Devices" 
                    value="4" 
                    icon={XCircle}
                    colorClass="bg-red-100 text-red-600"
                    subtitle="Requires immediate attention"
                />
                <KPICard 
                    title="Daily traffic volume" 
                    value="2345" 
                    icon={Car}
                    colorClass="bg-blue-100 text-blue-600"
                    subtitle="Vehicles passed through gates"
                />
            </div>

            {/* ROW 2: INFO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard title="Fee Policy" linkText="View all">
                    <div className="flex items-start gap-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <AlertTriangle size={24} className="text-orange-500 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold text-orange-800 text-[14px]">Applying Semester 2 fee schedule</h4>
                            <p className="text-[12px] text-orange-600 mt-1 leading-relaxed">
                                The new fee schedule for students and staff will take effect on Jan 15th. All gates are synced.
                            </p>
                        </div>
                    </div>
                </InfoCard>

                <InfoCard title="Manage Access Credentials" linkText="Manage">
                    <ul className="flex flex-col gap-3">
                        <li className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-center gap-2 text-red-700 font-medium text-[13px]">
                                <AlertTriangle size={16} /> Unusual login alert
                            </div>
                            <span className="text-red-700 font-bold bg-red-200 px-2 py-0.5 rounded text-[11px]">2</span>
                        </li>
                        <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-700 font-medium text-[13px]">
                                <CheckCircle size={16} className="text-green-500" /> Active accounts
                            </div>
                            <span className="text-gray-900 font-bold text-[14px]">14,230</span>
                        </li>
                    </ul>
                </InfoCard>

                <InfoCard title="Percentage of type of transport">
                    <div className="flex items-center justify-center h-full">
                        <div className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center shadow-inner" style={{ background: 'conic-gradient(#2d3a8c 0% 65%, #10B981 65% 90%, #F59E0B 90% 100%)' }}>
                            <div className="w-[80px] h-[80px] bg-white rounded-full"></div>
                        </div>
                        <div className="ml-6 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[12px] font-medium text-gray-600"><div className="w-3 h-3 bg-[#2d3a8c] rounded-sm"></div> Motorbikes (65%)</div>
                            <div className="flex items-center gap-2 text-[12px] font-medium text-gray-600"><div className="w-3 h-3 bg-[#10B981] rounded-sm"></div> Cars (25%)</div>
                            <div className="flex items-center gap-2 text-[12px] font-medium text-gray-600"><div className="w-3 h-3 bg-[#F59E0B] rounded-sm"></div> Others (10%)</div>
                        </div>
                    </div>
                </InfoCard>
            </div>

            {/* ROW 3: MAIN DATA (70/30 SPLIT) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* REVENUE CHART (70%) */}
                <div className="lg:col-span-2 bg-white rounded-[12px] p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-gray-800 text-[16px] font-bold">Total Daily Revenue (Hourly breakdown)</h3>
                        <select className="bg-gray-50 border border-gray-200 text-gray-600 text-[13px] rounded-md px-2 py-1 outline-none">
                            <option>Today</option>
                            <option>Yesterday</option>
                        </select>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-2 h-[200px] mt-4 pb-2 border-b border-gray-100">
                        {[20, 35, 60, 80, 40, 50, 90, 100, 75, 45, 30, 15].map((val, i) => (
                            <div key={i} className="w-full flex flex-col items-center gap-2 group">
                                <div className="w-full bg-[#2d3a8c] opacity-80 group-hover:opacity-100 rounded-t-md transition-all duration-300 relative" style={{ height: `${val}%` }}>
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val * 10}k
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium">{i + 6}h</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* STATUS PANEL (30%) */}
                <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                    
                    {/* Section 1: Availability */}
                    <div>
                        <h3 className="text-gray-800 text-[16px] font-bold mb-4">Availability</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <div className="flex items-center gap-2 text-[14px] font-semibold text-gray-700">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Gate C
                                </div>
                                <span className="text-[13px] text-gray-500 font-medium">120 slots left</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <div className="flex items-center gap-2 text-[14px] font-semibold text-gray-700">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div> Gate A
                                </div>
                                <span className="text-[13px] text-gray-500 font-medium">15 slots left</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[14px] font-semibold text-gray-700">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Gate B
                                </div>
                                <span className="text-[13px] text-red-500 font-bold">0 slots left</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Current Session */}
                    <div>
                        <h3 className="text-gray-800 text-[16px] font-bold mb-4">Current Session Search</h3>
                        <div className="bg-[#f8f9ff] border border-[#e0e5ff] rounded-xl p-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-[#2d3a8c] rounded-bl-full opacity-5"></div>
                            <div className="flex flex-col gap-1 mb-3">
                                <span className="text-[18px] font-black text-[#2d3a8c] tracking-wider">51A - XXXXX</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-[12px] font-bold text-green-600 uppercase">In progress</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 text-[13px] bg-white px-2 py-1.5 rounded-md border border-gray-200">
                                <MapPin size={14} className="text-[#2d3a8c]" />
                                <span className="font-medium">Zone B6 - Slot 12</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

        </div>
    );
}
