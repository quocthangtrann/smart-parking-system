import React, { useState, useEffect } from 'react';
import { Activity, Car, CheckCircle, XCircle, AlertTriangle, MapPin } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { socket, fetchAPI } from '../../api/config';

// ─────────────────────────────────────────────────────────────
// KPI CARD COMPONENT
// ─────────────────────────────────────────────────────────────
export const KPICard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-white rounded-[12px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
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
    <div className="bg-white rounded-[12px] p-5 shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 text-[16px] font-bold">{title}</h3>
            {linkText && <span className="text-[#2d3a8c] text-[13px] font-semibold cursor-pointer hover:underline">{linkText}</span>}
        </div>
        <div className="flex-1 flex flex-col justify-center">
            {children}
        </div>
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        revenue: '6.000.000',
        disconnected: 4,
        traffic: 2345,
        gates: [
            { name: 'Gate A', available: 80, color: 'bg-green-500' },
            { name: 'Gate B', available: 25, color: 'bg-orange-500' },
            { name: 'Gate C', available: 0,  color: 'bg-red-500' }
        ]
    });
    const [slots, setSlots] = useState([]);
    
    // Analytics State
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('2026');
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                let url = `/analytics/revenue?year=${filterYear}`;
                if (filterMonth) url += `&month=${filterMonth}`;
                const data = await fetchAPI(url);
                setRevenueData(data);
                
                // Calculate total revenue for the KPI card from this filtered data
                const total = data.reduce((sum, item) => sum + item.total, 0);
                setStats(prev => ({ ...prev, revenue: total.toLocaleString('vi-VN') }));
            } catch (err) {
                console.error(err);
            }
        };
        loadAnalytics();
    }, [filterMonth, filterYear]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const slotsData = await fetchAPI('/parking-slots');
                setSlots(slotsData);
                updateStatsFromSlots(slotsData);
            } catch (err) {
                console.error(err);
            }
        };

        loadData();

        if (socket) {
            socket.on('slot_update', (updatedSlot) => {
                setSlots(prev => {
                    const newSlots = prev.map(s => s.id === updatedSlot.id ? updatedSlot : s);
                    updateStatsFromSlots(newSlots);
                    return newSlots;
                });
            });
            socket.on('device_update', () => loadData());
        }

        return () => {
            if (socket) {
                socket.off('slot_update');
                socket.off('device_update');
            }
        };
    }, []);

    const updateStatsFromSlots = (currentSlots) => {
        // FIX #4: gate names must match what mqttService stores: "Gate A/B/C"
        const gates = ['Gate A', 'Gate B', 'Gate C'].map(name => {
            const gateSlots = currentSlots.filter(s => s.gate === name);
            const available = gateSlots.filter(s => s.state === 'empty').length;
            let color = 'bg-green-500';
            if (available < 5) color = 'bg-red-500';
            else if (available < 20) color = 'bg-orange-500';
            
            return { name, available, color };
        });
        setStats(prev => ({ ...prev, gates }));
    };

    return (
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            
            {/* ROW 1: KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard 
                    title="Daily Revenue" 
                    value={`${stats.revenue} VND`} 
                    icon={Activity}
                    colorClass="bg-green-100 text-green-600"
                    subtitle="+12% from yesterday"
                />
                <KPICard 
                    title="Disconnected Devices" 
                    value={stats.disconnected} 
                    icon={XCircle}
                    colorClass="bg-red-100 text-red-600"
                    subtitle="Requires immediate attention"
                />
                <KPICard 
                    title="Daily traffic volume" 
                    value={stats.traffic} 
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
                        <h3 className="text-gray-800 text-[16px] font-bold">Total Revenue</h3>
                        <div className="flex gap-2">
                            <select 
                                value={filterMonth} 
                                onChange={e => setFilterMonth(e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-gray-600 text-[13px] rounded-md px-2 py-1 outline-none font-bold"
                            >
                                <option value="">All Months</option>
                                {[...Array(12).keys()].map(i => (
                                    <option key={i+1} value={i+1}>{new Date(2000, i, 1).toLocaleString('en-US', { month: 'short' })}</option>
                                ))}
                            </select>
                            <select 
                                value={filterYear} 
                                onChange={e => setFilterYear(e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-gray-600 text-[13px] rounded-md px-2 py-1 outline-none font-bold"
                            >
                                {[2026, 2025].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-2 h-[250px] mt-4 pb-2 border-b border-gray-100">
                        {revenueData.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">No revenue data available for selected period.</div>
                        ) : (
                            revenueData.map((item, i) => {
                                // Fallback for undefined data
                                const total = item.total || 0;
                                const dateStr = item.date || '';

                                // Find max value to calculate percentage height
                                const maxVal = Math.max(...revenueData.map(d => d.total || 0));
                                const heightPercent = maxVal === 0 ? 0 : Math.max((total / maxVal) * 100, 5); // min 5% height
                                
                                let label = dateStr;
                                if (label.length === 7) label = new Date(label + '-01').toLocaleString('en-US', { month: 'short' });
                                else if (label.length === 10) label = parseInt(label.split('-')[2]);

                                return (
                                    <div key={i} className="w-full flex flex-col items-center gap-2 group h-full justify-end">
                                        <div className="w-full bg-[#2d3a8c] opacity-80 group-hover:opacity-100 rounded-t-md transition-all duration-300 relative min-w-[12px]" style={{ height: `${heightPercent}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                {total.toLocaleString()}đ
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{label}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* STATUS PANEL (30%) */}
                <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6 h-full">
                    
                    {/* Section 1: Availability */}
                    <div>
                        <h3 className="text-gray-800 text-[16px] font-bold mb-4">Availability</h3>
                        <div className="flex flex-col gap-3">
                            {stats.gates.map(gate => (
                                <div key={gate.name} className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <div className="flex items-center gap-2 text-[14px] font-semibold text-gray-700">
                                        <div className={`w-2.5 h-2.5 rounded-full ${gate.color}`}></div> {gate.name}
                                    </div>
                                    <span className={`text-[13px] font-medium ${gate.available === 0 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                        {gate.available} slots left
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Current Session */}
                    <div>
                        <h3 className="text-gray-800 text-[16px] font-bold mb-4">Current Session</h3>
                        <div className="bg-[#f8f9ff] border border-[#e0e5ff] rounded-xl p-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-[#2d3a8c] rounded-bl-full opacity-5"></div>
                            <div className="flex flex-col gap-1 mb-3">
                                <span className="text-[18px] font-black text-[#2d3a8c] tracking-wider">51A - 123.45</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-[12px] font-bold text-green-600 uppercase">Active Now</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 text-[13px] bg-white px-2 py-1.5 rounded-md border border-gray-200">
                                <MapPin size={14} className="text-[#2d3a8c]" />
                                <span className="font-medium">Slot SNS-A01</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

        </div>
    );
}
