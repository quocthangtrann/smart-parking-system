import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, MapPin, X } from 'lucide-react';
import logoBk from '../../assets/logobk.png';

// ─────────────────────────────────────────────
// REUSABLE SUB-COMPONENTS
// ─────────────────────────────────────────────

// Replaced by inline rendering

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

    // Slots are now dynamically generated in the render

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

                            <div className="flex items-center justify-center gap-6 py-[16px] border-b border-gray-50 shrink-0 mb-[16px]">
                                <div className="flex items-center gap-2">
                                    <div className="w-[16px] h-[16px] border-2 border-green-500 bg-white rounded-md"></div>
                                    <span className="text-[12px] font-bold text-gray-600">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-[16px] h-[16px] bg-red-100 border border-red-200 rounded-md flex items-center justify-center"><X size={12} className="text-red-500"/></div>
                                    <span className="text-[12px] font-bold text-gray-600">Occupied</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-[16px] h-[16px] bg-[#5C2FFF] rounded-md"></div>
                                    <span className="text-[12px] font-bold text-gray-600">Selected</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-5 gap-[12px] max-w-[400px] mx-auto mb-[30px] overflow-y-auto max-h-[300px] pr-2 pb-2">
                                {Array.from({ length: 50 }).map((_, i) => {
                                    const slotId = `A${i + 1}`;
                                    const isOccupied = i % 5 === 0 || i % 7 === 0; // mock logic
                                    const isReserved = reservedSlot === slotId;
                                    
                                    // if it's the one we just confirmed as reserved, it acts as 'selected/reserved'
                                    // if it's currently clicked but not confirmed, it doesn't show here since modal handles it, but let's visually show if selectedSlot
                                    const isSelected = selectedSlot === slotId || isReserved;

                                    let cellStyle = "aspect-[2/3] rounded-[8px] border-2 flex items-center justify-center text-[12px] font-bold transition-all cursor-pointer shadow-sm relative";
                                    
                                    if (isSelected) {
                                        cellStyle += " bg-[#5C2FFF] border-[#5C2FFF] text-white shadow-md transform scale-105";
                                    } else if (isOccupied) {
                                        cellStyle += " bg-red-50 border-red-100 text-red-400 cursor-not-allowed opacity-70";
                                    } else {
                                        cellStyle += " bg-white border-green-500 text-green-700 hover:bg-green-50";
                                    }

                                    return (
                                        <button 
                                            key={slotId}
                                            disabled={isOccupied && !isReserved}
                                            onClick={() => handleSlotClick(slotId)}
                                            className={cellStyle}
                                        >
                                            {isOccupied && !isReserved ? <X size={16} /> : slotId}
                                            {isReserved && (
                                                <div className="absolute -top-2 -right-2 bg-white rounded-full p-[2px] shadow-sm">
                                                    <div className="bg-[#5C2FFF] rounded-full p-[2px]">
                                                        <Check size={10} className="text-white" strokeWidth={4} />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
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