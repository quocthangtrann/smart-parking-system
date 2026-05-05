import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, IdCard, Car, CalendarPlus, Receipt, Map } from 'lucide-react';
import { TopIconBar, GateItem, ActionCard, SessionCard } from '../../components/SharedUI';
import logoBk from '../../assets/logobk.png';

export default function LecturerHome() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const user = state?.user;

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
                {/* HEADER */}
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
                            Have a good day, Dr. A!
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

                        {/* QUICK ACTIONS — 2×2 Grid + 1 Full-Width */}
                        <section className="flex flex-col gap-[12px]">
                            <h3 className="text-[14px] font-bold text-black uppercase tracking-wide">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-[16px]">
                                <ActionCard icon={<IdCard size={28} />}       label="Parking Card"  onClick={() => navigate('/digital-card', { state: { user } })} />
                                <ActionCard icon={<Receipt size={28} />}      label="History & Billing" onClick={() => navigate('/billing', { state: { user } })} />
                                <ActionCard icon={<CalendarPlus size={28} />} label="Reserve slot"  onClick={() => navigate('/lecturer/reserve', { state: { user } })} />
                                <ActionCard icon={<Car size={28} />}          label="Vehicle" onClick={() => navigate('/vehicles', { state: { user } })} />
                                {/* Real-time Parking — full-width */}
                                <ActionCard icon={<Map size={28} />}          label="Real-time Parking" isFullWidth={true} />
                            </div>
                        </section>

                        {/* CURRENT SESSION */}
                        <section className="flex flex-col gap-[12px]">
                            <h3 className="text-[14px] font-bold text-black uppercase tracking-wide">Current Session</h3>
                            <SessionCard
                                plate="🚗 59B - 12345"
                                time="8h 00m"
                                status="In progress"
                                location={"Parking 1\nZone B6 - Floor 1 - Slot 12"}
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