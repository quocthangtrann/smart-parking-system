import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, ChevronDown, ChevronRight, ChevronLeft, User } from 'lucide-react';
import logoBk from '../../assets/logobk.png';
import { getStoredVehicles } from './MyVehicle';

// ─────────────────────────────────────────────
// MOCK DATA (fallbacks when no navigation state)
// ─────────────────────────────────────────────
const MOCK_STUDENT = {
    name: 'Nguyen Van A',
    id: '240000',
    role: 'student',
    department: 'Computer Science & Engineering',
    avatarUrl: null,
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function generateQRToken() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function formatTimestamp(date) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const yy = date.getFullYear();
    return `${hh}:${mm}:${ss} ${dd}-${mo}-${yy}`;
}

function getInitials(name = '') {
    return name.split(' ').filter(Boolean).slice(-2).map(w => w[0].toUpperCase()).join('');
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Shared HCMUT-style header */
function Header({ onBack }) {
    return (
        <header className="h-[77px] bg-[#210F7A] flex items-center px-[17px] shrink-0 sticky top-0 z-20 shadow-md">
            <button
                onClick={onBack}
                className="p-1 mr-2 rounded hover:bg-white/10 transition-colors"
                aria-label="Go back"
            >
                <ChevronLeft size={22} className="text-white" />
            </button>
            <div className="w-[45px] h-[45px] bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
                <img src={logoBk} alt="BK Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <h1 className="text-white text-[16px] font-semibold ml-[14px] leading-tight">
                Parking Management System
            </h1>
        </header>
    );
}

/** Breadcrumb bar */
function Breadcrumb({ onBack }) {
    return (
        <div className="flex items-center gap-1 px-5 pt-3 pb-1 text-[13px] text-gray-500 font-medium">
            <span
                onClick={onBack}
                className="cursor-pointer hover:text-[#210F7A] transition-colors"
            >
                Home
            </span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="font-bold text-gray-800">Digital Parking Card</span>
        </div>
    );
}

/** License plate + vehicle type selector */
function ParkingInfoSection({ vehicles, selectedIndex, onSelectIndex }) {
    return (
        <div className="mx-5 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            {/* Section title */}
            <div className="px-5 pt-4 pb-2">
                <p className="text-[11px] font-black text-gray-400 tracking-[0.14em] uppercase">
                    Parking Information
                </p>
            </div>

            {/* Fields row */}
            <div className="flex items-center px-5 pb-4 gap-3">
                {/* License Plate Dropdown */}
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        License Plate
                    </label>
                    <div className="relative">
                        <select
                            value={selectedIndex}
                            onChange={e => onSelectIndex(Number(e.target.value))}
                            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-8 text-[14px] font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#210F7A]/30 cursor-pointer"
                        >
                            {vehicles.map((v, i) => (
                                <option key={i} value={i}>{v.plateNumber}</option>
                            ))}
                        </select>
                        <ChevronDown
                            size={14}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Vertical divider */}
                <div className="w-px h-10 bg-gray-200 shrink-0" />

                {/* Vehicle Type */}
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Vehicle Type
                    </label>
                    <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-[13px] font-semibold px-3 py-2 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                        {vehicles[selectedIndex]?.type || 'N/A'}
                    </div>
                </div>
            </div>

            {/* Bottom dashed divider */}
            <div className="border-t border-dashed border-gray-200 mx-5" />
        </div>
    );
}

/** Dynamic QR code + refresh + fee + swipe hint */
function QRSection({ vehicle, qrToken, timestamp, onRefresh, onSwipe }) {
    const touchStartX = useRef(null);
    const qrPayload = `${vehicle.plateNumber}|${qrToken}`;
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}&margin=8&format=png&ecc=M`;

    const handleTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = e => {
        if (touchStartX.current === null) return;
        const dx = touchStartX.current - e.changedTouches[0].clientX;
        if (dx > 40) onSwipe('left');
        else if (dx < -40) onSwipe('right');
        touchStartX.current = null;
    };

    return (
        <div
            className="mx-5 mb-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* QR image */}
            <div className="flex justify-center mb-3">
                <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100">
                    <img
                        src={qrSrc}
                        alt="Dynamic QR Code"
                        className="w-[190px] h-[190px] rounded-xl"
                        key={qrToken} /* forces re-render on refresh */
                    />
                </div>
            </div>

            {/* Timestamp */}
            <p className="text-center text-[12px] text-gray-400 font-mono mb-1">{timestamp}</p>

            {/* License plate big text */}
            <p className="text-center text-[22px] font-black text-gray-900 tracking-wider mb-4">
                {vehicle.plateNumber}
            </p>

            {/* Refresh + Fee row */}
            <div className="flex gap-3 mb-4">
                <button
                    id="refresh-qr-btn"
                    onClick={onRefresh}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-[#006DCC] font-bold text-[14px] py-3 rounded-2xl hover:bg-blue-100 active:scale-95 transition-all"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
                <div className="flex-1 flex items-center justify-center bg-red-50 text-red-600 font-bold text-[14px] py-3 rounded-2xl border border-red-100">
                    Fees: {vehicle.fee}
                </div>
            </div>

            {/* Swipe hint */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-[12px] font-medium animate-pulse">
                <ChevronLeft size={15} className="opacity-60" />
                <span>Swipe left to change vehicle</span>
                <ChevronRight size={15} className="opacity-60" />
            </div>
        </div>
    );
}

/** Section divider line */
function SectionDivider() {
    return (
        <div className="relative flex items-center mx-5 mb-4">
            <div className="flex-1 border-t border-dashed border-gray-300" />
            <div className="absolute -left-3 w-5 h-5 rounded-full bg-gray-100 border border-gray-200" />
            <div className="absolute -right-3 w-5 h-5 rounded-full bg-gray-100 border border-gray-200" />
        </div>
    );
}

/** Avatar — image or initials fallback */
function Avatar({ user }) {
    if (user.avatarUrl) {
        return (
            <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-[68px] h-[68px] rounded-2xl object-cover border border-gray-200 shadow-sm shrink-0"
            />
        );
    }
    return (
        <div className="w-[68px] h-[68px] rounded-2xl border border-gray-200 shadow-sm shrink-0 bg-white flex items-center justify-center">
            {user.name ? (
                <span
                    className="text-xl font-black"
                    style={{ color: user.role === 'lecturer' ? '#ea580c' : '#7c3aed' }}
                >
                    {getInitials(user.name)}
                </span>
            ) : (
                <User size={32} className="text-gray-300" />
            )}
        </div>
    );
}

/** Manage physical card section */
function ManageCardSection({ user, cardStatus, onCardStatusChange }) {
    const isLecturer = user.role === 'lecturer';

    const roleTagStyle = isLecturer
        ? 'bg-orange-500 text-white shadow-[0_2px_8px_rgba(234,88,12,0.3)]'
        : 'bg-purple-600 text-white shadow-[0_2px_8px_rgba(124,58,237,0.3)]';

    return (
        <div className="mx-5 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            {/* Title */}
            <div className="px-5 pt-4 pb-3">
                <p className="text-[11px] font-black text-gray-400 tracking-[0.14em] uppercase">
                    Manage Physical Card
                </p>
            </div>

            {/* User info row */}
            <div className="flex items-center gap-4 px-5 pb-4">
                <Avatar user={user} />

                <div className="flex-1 min-w-0">
                    {/* Role tag + expiry */}
                    <div className="flex items-center justify-between mb-2.5">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${roleTagStyle}`}>
                            {isLecturer ? 'Lecturer' : 'Student'}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-400">
                            Exp: 2026-12
                        </span>
                    </div>

                    {/* Name + ID */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[13px]">
                            <span className="text-gray-400 font-semibold w-[38px] shrink-0 text-[11px]">Name</span>
                            <span className="font-bold text-gray-900 truncate">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px]">
                            <span className="text-gray-400 font-semibold w-[38px] shrink-0 text-[11px]">ID No</span>
                            <span className="font-bold text-gray-900">{user.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mx-5" />

            {/* Card status dropdown */}
            <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-[13px] font-bold text-gray-700">Physical Card Status</span>
                <div className="relative">
                    <select
                        id="card-status-select"
                        value={cardStatus}
                        onChange={e => onCardStatusChange(e.target.value)}
                        className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl text-[12px] font-bold text-white outline-none cursor-pointer transition-colors ${
                            cardStatus === 'active'
                                ? 'bg-[#2E7D32] hover:bg-green-700'
                                : 'bg-[#D32F2F] hover:bg-red-700'
                        }`}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none"
                    />
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function DigitalCard() {
    const navigate = useNavigate();
    const { state } = useLocation();

    // Resolve user from nav state or fallback to mock
    const user = state?.user ?? MOCK_STUDENT;

    // ── Global State ──────────────────────────
    const [vehicles, setVehicles] = useState(getStoredVehicles());
    const [selectedIndex, setSelectedIndex] = useState(() => {
        const defaultIdx = vehicles.findIndex(v => v.isDefault);
        return defaultIdx >= 0 ? defaultIdx : 0;
    });
    
    const [qrToken, setQrToken] = useState(() => generateQRToken());
    const [timestamp, setTimestamp] = useState(() => formatTimestamp(new Date()));
    const [cardStatus, setCardStatus] = useState('active');

    // Sync vehicles from storage
    useEffect(() => {
        const handleUpdate = () => {
            const updated = getStoredVehicles();
            setVehicles(updated);
            const defaultIdx = updated.findIndex(v => v.isDefault);
            setSelectedIndex(defaultIdx >= 0 ? defaultIdx : 0);
        };
        window.addEventListener('vehicles_updated', handleUpdate);
        return () => window.removeEventListener('vehicles_updated', handleUpdate);
    }, []);

    // Regenerate QR whenever vehicle changes
    useEffect(() => {
        setQrToken(generateQRToken());
        setTimestamp(formatTimestamp(new Date()));
    }, [selectedIndex]);

    // ── Interaction Handlers ──────────────────
    const handleRefresh = () => {
        setQrToken(generateQRToken());
        setTimestamp(formatTimestamp(new Date()));
    };

    const handleSwipe = (direction) => {
        setSelectedIndex(prev =>
            direction === 'left'
                ? (prev + 1) % vehicles.length
                : (prev - 1 + vehicles.length) % vehicles.length
        );
    };

    const currentVehicle = vehicles[selectedIndex];

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
                {/* Header (same as all other screens) */}
                <Header onBack={() => navigate(-1)} />

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto bg-gray-50">

                    {/* Breadcrumb */}
                    <Breadcrumb onBack={() => navigate(-1)} />

                    {/* ── SECTION 1: Parking Information ── */}
                    <div className="mt-2">
                        <ParkingInfoSection
                            vehicles={vehicles}
                            selectedIndex={selectedIndex}
                            onSelectIndex={setSelectedIndex}
                        />
                    </div>

                    {/* ── SECTION 2: QR Code ── */}
                    <div className="bg-white mx-5 mb-4 rounded-2xl shadow-sm border border-gray-100 pt-4">
                        <QRSection
                            vehicle={currentVehicle}
                            qrToken={qrToken}
                            timestamp={timestamp}
                            onRefresh={handleRefresh}
                            onSwipe={handleSwipe}
                        />
                    </div>

                    {/* Ticket-stub divider */}
                    <SectionDivider />

                    {/* ── SECTION 3: Manage Physical Card ── */}
                    <ManageCardSection
                        user={user}
                        cardStatus={cardStatus}
                        onCardStatusChange={setCardStatus}
                    />

                    <div className="h-4" />
                </div>

                {/* Bottom home-indicator bar */}
                <div className="shrink-0 h-7 bg-white flex items-center justify-center border-t border-gray-100">
                    <div className="w-24 h-1 bg-gray-300 rounded-full" />
                </div>
            </div>
        </div>
    );
}
