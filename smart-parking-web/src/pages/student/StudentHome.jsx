import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, IdCard, Car, Receipt, Map, Info } from 'lucide-react';
import { TopIconBar, GateItem, ActionCard, SessionCard } from '../../components/SharedUI';
import { fetchAPI } from '../../api/config';
import logoBk from '../../assets/logobk.png';

export default function StudentHome() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const user = state?.user;

    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        fetchAPI('/fee-policy')
            .then(data => setPolicies(data || []))
            .catch(console.error);
    }, []);

    const formatCurrency = (amount) => amount.toLocaleString('vi-VN') + 'đ';

    return (
        // Outer page — centres the phone frame on large screens
        <div className="min-h-screen bg-slate-300 flex items-center justify-center font-sans">

            {/* ── Phone frame: strict 375 × 812 ── */}
            <div
                className="relative flex flex-col bg-white overflow-hidden"
                style={{
                    width: 375,
                    height: 812,
                    borderRadius: 36,
                    border: '8px solid #1e293b',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
                }}
            >
                {/* HEADER — sticky inside the frame */}
                <header className="h-[77px] bg-[#210F7A] flex items-center px-[17px] shrink-0 z-10">
                    <div className="w-[45px] h-[45px] bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
                        <img src={logoBk} alt="BK Logo" className="w-full h-full object-contain p-0.5" />
                    </div>
                    <h1 className="text-white text-[16px] font-semibold ml-[17px]">
                        Parking Management System
                    </h1>
                </header>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <TopIconBar />

                    <main className="px-[20px] pb-[30px] flex flex-col gap-[24px]">

                        {/* GREETING TEXT */}
                        <h2 className="text-[#210F7A] text-[18px] font-semibold">
                            Hi, {user?.fullName || 'Student'}!
                        </h2>

                        {/* PARKING AVAILABILITY */}
                        <section className="flex flex-col gap-[12px]">
                            <div className="flex items-center gap-[10px]">
                                <h3 className="text-[14px] font-bold text-black uppercase tracking-wide">Parking Availability</h3>
                                <button className="text-gray-500 hover:text-primary"><Filter size={18} /></button>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-[12px] p-[12px] shadow-sm">
                                <GateItem name="Gate C" slots={120} statusColor="green" />
                                <GateItem name="Gate A" slots={15}  statusColor="orange" />
                                <GateItem name="Gate B" slots={0}   statusColor="red" />
                            </div>
                            <span className="text-[11px] text-gray-400 italic text-right mt-[-4px]">Last updated 30 seconds ago</span>
                        </section>

                        {/* QUICK ACTIONS — 2×2 Grid */}
                        <section className="flex flex-col gap-[12px]">
                            <h3 className="text-[14px] font-bold text-black uppercase tracking-wide">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-[16px]">
                                <ActionCard icon={<IdCard size={28} />}    label="Parking Card" onClick={() => navigate('/digital-card', { state: { user } })} />
                                <ActionCard icon={<Receipt size={28} />}   label="History & Billing" onClick={() => navigate('/billing', { state: { user } })} />
                                <ActionCard icon={<Map size={28} />}       label="Real-time Parking" onClick={() => navigate('/map', { state: { user } })} />
                                <ActionCard icon={<Car size={28} />}       label="Vehicle" onClick={() => navigate('/vehicles', { state: { user } })} />
                            </div>
                        </section>

                        {/* PRICING INFORMATION */}
                        <section className="flex flex-col gap-[12px]">
                            <h3 className="text-[14px] font-bold text-black uppercase tracking-wide flex items-center gap-2">
                                Pricing Information
                                <Info size={14} className="text-blue-500" />
                            </h3>
                            <div className="bg-white border border-gray-200 rounded-[12px] p-[14px] shadow-sm flex flex-col gap-3">
                                {policies.length === 0 ? (
                                    <p className="text-[13px] text-gray-500 text-center py-2">Loading pricing...</p>
                                ) : (
                                    policies.map(policy => (
                                        <div key={policy.id} className="flex flex-col gap-1.5 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-[#210F7A] text-[14px] uppercase">{policy.vehicleType}</span>
                                                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-100">HK252 Active</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[12px] text-gray-600">
                                                <span>Before {policy.timeThreshold}</span>
                                                <span className="font-bold text-gray-900">{formatCurrency(policy.daytimeRate)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[12px] text-gray-600">
                                                <span>After {policy.timeThreshold} & Sunday</span>
                                                <span className="font-bold text-gray-900">{formatCurrency(policy.eveningRate)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* CURRENT SESSION */}
                        <section className="flex flex-col gap-[12px]">
                            <h3 className="text-[14px] font-bold text-black uppercase tracking-wide">Current Session</h3>
                            <SessionCard
                                plate="51A - XXXXX"
                                time="3h 15m"
                                status="In progress"
                                location={"Parking 1\nZone B6 - Slot 12"}
                                onClick={() => navigate('/session', { state: { user } })}
                            />
                        </section>

                    </main>
                </div>

                {/* Bottom home-indicator bar */}
                <div className="shrink-0 h-7 bg-white flex items-center justify-center border-t border-gray-100 z-50">
                    <div className="w-24 h-1 bg-gray-300 rounded-full" />
                </div>
            </div>
        </div>
    );
}