import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, MapPin, X } from 'lucide-react';
import logoBk from '../../assets/logobk.png';

// ─────────────────────────────────────────────
// REUSABLE SUB-COMPONENTS
// ─────────────────────────────────────────────

const SlotItem = ({ id, status, isReserved, hasEntry, hasExit, onClick }) => {
    let boxStyle = 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'; // occupied
    if (status === 'available') boxStyle = 'border-[#2E7D32] bg-white text-black cursor-pointer hover:bg-green-50';
    if (isReserved)             boxStyle = 'border-[#5C2FFF] bg-[#F3F0FF] text-[#5C2FFF] cursor-pointer shadow-md';

    return (
        <div
            onClick={() => { if (status === 'available' || isReserved) onClick(id); }}
            className={`relative flex flex-col items-center justify-center h-[70px] rounded-[12px] border-2 transition-all ${boxStyle}`}
        >
            <span className="font-bold text-[18px]">{id}</span>

            {isReserved && (
                <div className="absolute top-1 right-1 bg-[#5C2FFF] rounded-full p-[2px]">
                    <Check size={12} className="text-white" strokeWidth={3} />
                </div>
            )}

            {hasEntry && <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#5C2FFF] text-white text-[9px] font-bold px-2 py-[2px] rounded-full">ENTRY</span>}
            {hasExit  && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#D32F2F] text-white text-[9px] font-bold px-2 py-[2px] rounded-full">EXIT</span>}
        </div>
    );
};

/** Modal is absolute-positioned inside the phone frame (not fixed/viewport) */
const Modal = ({ isOpen, title, children, onCancel, onConfirm, cancelText = 'Cancel', confirmText = 'Confirm' }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[320px] rounded-[16px] p-[24px] shadow-xl flex flex-col">
                <h3 className="text-[18px] font-bold text-black mb-[16px] text-center">{title}</h3>
                <div className="text-[14px] text-gray-600 mb-[24px]">{children}</div>
                <div className="flex gap-[12px]">
                    <button onClick={onCancel}  className="flex-1 py-[10px] rounded-[8px] border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">{cancelText}</button>
                    <button onClick={onConfirm} className="flex-1 py-[10px] rounded-[8px] bg-[#210F7A] text-white font-semibold hover:bg-blue-900">{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────

export default function ReserveSlot() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const user = state?.user;

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reservedSlot, setReservedSlot] = useState(null);
    const [modalType, setModalType]       = useState(null); // 'confirmReserve' | 'confirmCancel' | null
    const [message, setMessage]           = useState(null); // { text, type }

    const slots = [
        { id: 'A1', status: 'available', hasEntry: true },
        { id: 'A2', status: 'occupied' },
        { id: 'A3', status: 'available' },
        { id: 'B1', status: 'occupied' },
        { id: 'B2', status: 'available' },
        { id: 'B3', status: 'available' },
        { id: 'C1', status: 'available' },
        { id: 'C2', status: 'occupied', hasExit: true },
        { id: 'C3', status: 'available' },
    ];

    const handleSlotClick = (id) => {
        if (reservedSlot === id) {
            setModalType('confirmCancel');
        } else if (!reservedSlot) {
            setSelectedSlot(id);
            setModalType('confirmReserve');
        }
    };

    const confirmReservation = () => {
        setReservedSlot(selectedSlot);
        setSelectedSlot(null);
        setModalType(null);
        setMessage({ text: `Reserved ${selectedSlot} successfully.\nThe slot will auto-release after 14:58`, type: 'success' });
    };

    const confirmCancellation = () => {
        setReservedSlot(null);
        setModalType(null);
        setMessage({ text: 'Reservation cancelled', type: 'info' });
    };

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
                <header className="h-[77px] bg-[#210F7A] flex items-center px-[17px] shrink-0 z-10 shadow-md">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1 mr-2 rounded hover:bg-white/10 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft size={22} className="text-white" />
                    </button>
                    <div className="w-[45px] h-[45px] bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
                        <img src={logoBk} alt="BK Logo" className="w-full h-full object-contain p-0.5" />
                    </div>
                    <h1 className="text-white text-[16px] font-semibold ml-[14px]">
                        Parking Management System
                    </h1>
                </header>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <main className="px-[16px] py-[20px] flex flex-col">

                        {/* Breadcrumb */}
                        <div className="text-[14px] text-gray-500 font-medium mb-[16px] flex items-center gap-1">
                            <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-[#210F7A] transition-colors">Home</span>
                            <ChevronRight size={14} className="text-gray-400" />
                            <span className="text-[#210F7A] font-bold">Reserve slot</span>
                        </div>

                        {/* Campus Dropdown */}
                        <div className="w-full bg-white border border-gray-300 rounded-[8px] px-[12px] py-[10px] flex justify-between items-center mb-[20px] shadow-sm">
                            <div className="flex items-center gap-[8px] text-[#210F7A] font-semibold text-[15px]">
                                <MapPin size={18} />
                                Campus 1 (Ly Thuong Kiet)
                            </div>
                            <ChevronRight size={18} className="text-gray-400 rotate-90" />
                        </div>

                        {/* Message Banner */}
                        {message && (
                            <div className={`mb-[16px] px-[16px] py-[12px] rounded-[8px] text-[13px] font-semibold flex justify-between items-start ${message.type === 'success' ? 'bg-green-100 text-[#2E7D32]' : 'bg-gray-200 text-gray-700'}`}>
                                <span className="whitespace-pre-line">{message.text}</span>
                                <button onClick={() => setMessage(null)} className="opacity-50 hover:opacity-100 ml-2 shrink-0"><X size={16} /></button>
                            </div>
                        )}

                        {/* Slot Grid Card */}
                        <div className="bg-white w-full rounded-[16px] shadow-sm p-[20px] border border-gray-100 mb-[20px]">
                            <h2 className="text-[18px] font-bold text-black mb-[20px] text-center tracking-wide">GATE A</h2>

                            <div className="grid grid-cols-3 gap-x-[16px] gap-y-[24px] mb-[30px]">
                                {slots.map(slot => (
                                    <SlotItem
                                        key={slot.id}
                                        id={slot.id}
                                        status={reservedSlot === slot.id ? 'reserved' : slot.status}
                                        isReserved={reservedSlot === slot.id}
                                        hasEntry={slot.hasEntry}
                                        hasExit={slot.hasExit}
                                        onClick={handleSlotClick}
                                    />
                                ))}
                            </div>

                            {/* Gate pagination */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-[16px]">
                                <button className="text-[13px] font-semibold text-gray-400 hover:text-[#210F7A]">&larr; Gate C</button>
                                <div className="flex gap-[12px] text-[14px] font-bold">
                                    <span className="text-white bg-[#210F7A] w-[24px] h-[24px] flex items-center justify-center rounded-full">1</span>
                                    <span className="text-gray-400 cursor-pointer">2</span>
                                    <span className="text-gray-400 cursor-pointer">3</span>
                                </div>
                                <button className="text-[13px] font-semibold text-[#210F7A] hover:opacity-80">Gate B &rarr;</button>
                            </div>
                        </div>

                        {/* View Parking Card CTA — only when a slot is reserved */}
                        {reservedSlot && (
                            <div className="bg-white border border-gray-200 rounded-[12px] p-[16px]">
                                <button className="w-full bg-[#5C2FFF] text-white font-bold text-[16px] py-[14px] rounded-[12px] hover:bg-blue-800 transition-colors shadow-md">
                                    View Parking Card
                                </button>
                            </div>
                        )}

                    </main>
                </div>

                {/* Bottom home-indicator bar */}
                <div className="shrink-0 h-7 bg-white flex items-center justify-center border-t border-gray-100 z-50">
                    <div className="w-24 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Modals — absolute inside phone frame so they're clipped by the frame border */}
                <Modal
                    isOpen={modalType === 'confirmReserve'}
                    title="Confirm Reservation"
                    onCancel={() => setModalType(null)}
                    onConfirm={confirmReservation}
                >
                    <ul className="mb-[12px] space-y-[4px] font-medium text-black bg-gray-50 p-3 rounded-lg">
                        <li>• Slot: <span className="text-[#210F7A]">{selectedSlot}</span></li>
                        <li>• Gate: Gate A</li>
                        <li>• Campus: Campus 1</li>
                        <li>• Hold time: 10 minutes</li>
                    </ul>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                        This slot will be held for you for 10 minutes. If you do not arrive within this time, the reservation will be released automatically.
                    </p>
                </Modal>

                <Modal
                    isOpen={modalType === 'confirmCancel'}
                    title="Cancel Reservation"
                    cancelText="Back"
                    confirmText="Cancel Reservation"
                    onCancel={() => setModalType(null)}
                    onConfirm={confirmCancellation}
                >
                    <p className="text-[14px] text-gray-700 text-center">
                        Cancel reservation for <span className="font-bold text-black">Slot {reservedSlot}</span>? <br />
                        The slot will become available for other users.
                    </p>
                </Modal>
            </div>
        </div>
    );
}