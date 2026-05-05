import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Info, ChevronDown, X } from 'lucide-react';
import logoBk from '../../assets/logobk.png';
import { getStoredVehicles } from './MyVehicle';

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_USER = {
    name: 'Nguyen Van A',
    id: '240000',
    role: 'student', // 'student' | 'lecturer'
};

const MOCK_ACTIVITIES = [
    // FEB ACTIVITIES (Current Month)
    { id: 1, date: 'Feb. 26, 2026', plate: '🏍 51A - XXXXX', time: '06:22 - now', amount: 3000, status: 'unpaid', type: 'student' },
    { id: 2, date: 'Feb. 26, 2026', plate: '🚗 59B - 12345', time: '08:00 - 12:00', amount: 10000, status: 'paid', type: 'student' },
    { id: 3, date: 'Feb. 25, 2026', plate: '🏍 51A - XXXXX', time: '07:15 - 17:30', amount: 0, status: 'exempt', type: 'lecturer' },
    { id: 4, date: 'Feb. 25, 2026', plate: '🏍 51A - XXXXX', time: '09:00 - 11:00', amount: 5000, status: 'unpaid', type: 'student' },
    
    // JAN ACTIVITIES (Overdue Month)
    { id: 5, date: 'Jan. 20, 2026', plate: '🏍 51A - XXXXX', time: '14:00 - 18:00', amount: 12000, status: 'overdue', type: 'student' },
    { id: 6, date: 'Jan. 15, 2026', plate: '🚗 59B - 12345', time: '09:00 - 17:00', amount: 20000, status: 'overdue', type: 'student' },
    
    // DEC ACTIVITIES (Paid Month)
    { id: 7, date: 'Dec. 10, 2025', plate: '🏍 51A - XXXXX', time: '08:00 - 12:00', amount: 15000, status: 'paid', type: 'student' },
];

const MOCK_INVOICES = [
    { id: 101, month: 'Feb, 2026', amount: 8000, state: 'normal', note: 'Due today' },
    { id: 102, month: 'Jan, 2026', amount: 32000, state: 'overdue', note: 'Jan 28, 2026' },
    { id: 103, month: 'Dec, 2025', amount: 15000, state: 'paid' },
    { id: 104, month: 'Mar, 2026', amount: 0, state: 'upcoming', note: 'Feb 28' },
    { id: 105, month: 'Nov, 2025', amount: 0, state: 'none' },
];

// ─────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────

const Header = ({ onBack }) => (
    <header className="h-[77px] bg-[#210F7A] flex items-center px-[17px] shrink-0 z-10 shadow-md">
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
        <h1 className="text-white text-[16px] font-semibold ml-[14px]">
            Parking Management System
        </h1>
    </header>
);

const ActivityItem = ({ data, userRole }) => {
    const isExempt = userRole === 'lecturer' || data.status === 'exempt';
    const isUnpaid = data.status === 'unpaid';
    const isOverdue = data.status === 'overdue';

    let statusColor = 'text-green-600';
    let statusLabel = 'Paid';
    let amountColor = 'text-gray-900';
    let prefix = '';

    if (isUnpaid) {
        statusColor = 'text-orange-500';
        statusLabel = 'Pending';
        amountColor = 'text-orange-500';
        prefix = '+';
    } else if (isOverdue) {
        statusColor = 'text-red-600';
        statusLabel = 'Overdue';
        amountColor = 'text-red-600';
        prefix = '+';
    }

    return (
        <div className="w-full py-[12px] border-b border-gray-100 flex justify-between items-center bg-white px-[16px]">
            {/* Left Side */}
            <div className="flex flex-col gap-1">
                <span className="font-bold text-[14px] text-gray-900">{data.plate}</span>
                <span className="text-[12px] text-gray-500">{data.time}</span>
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-end gap-1">
                {isExempt ? (
                    <div className="flex items-center gap-1 text-gray-500">
                        <span className="text-[13px] font-medium">Exempt (Staff)</span>
                        <Info size={14} />
                    </div>
                ) : (
                    <>
                        <span className={`text-[14px] font-bold ${amountColor}`}>
                            {prefix}{data.amount.toLocaleString('vi-VN')} đ
                        </span>
                        <span className={`text-[12px] font-medium ${statusColor}`}>
                            {statusLabel}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

const InvoiceItem = ({ data, onPay, onView }) => {
    return (
        <div className={`w-full flex justify-between items-center bg-white p-[16px] border ${data.state === 'none' ? 'border-dashed border-gray-200 opacity-60' : 'border-gray-100'} rounded-[12px] mb-[12px] shadow-sm`}>
            {/* Left */}
            <div className="flex flex-col flex-1">
                <span className={`font-bold text-[14px] ${data.state === 'none' ? 'text-gray-500' : 'text-gray-900'}`}>{data.month}</span>
                {data.state === 'overdue' && <span className="text-[12px] font-bold text-red-500 mt-1">Overdue</span>}
                {data.state === 'upcoming' && <span className="text-[12px] text-gray-500 mt-1">Available on {data.note}</span>}
                {data.state === 'none' && <span className="text-[12px] text-gray-400 mt-1">No activity</span>}
            </div>
            
            {/* Center + Right */}
            <div className="flex items-center justify-end gap-[16px] shrink-0 min-w-[140px]">
                <span className={`font-bold text-[15px] ${data.state === 'none' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {data.amount > 0 ? `${data.amount.toLocaleString('vi-VN')} đ` : '-'}
                </span>
                
                {data.state === 'normal' || data.state === 'overdue' ? (
                    <button onClick={() => onPay(data.id)} className="bg-[#5C2FFF] text-white text-[13px] font-bold px-[16px] py-[6px] rounded-full hover:bg-purple-700 transition-colors">
                        Pay
                    </button>
                ) : data.state === 'paid' ? (
                    <button onClick={() => onView(data.id)} className="bg-gray-100 text-gray-700 text-[13px] font-bold px-[16px] py-[6px] rounded-full hover:bg-gray-200 transition-colors">
                        View
                    </button>
                ) : <div className="w-[60px]" />}
            </div>
        </div>
    );
};

const FooterNote = () => (
    <div className="flex items-center justify-center gap-1 mt-[24px] mb-[16px] cursor-pointer hover:opacity-80">
        <Info size={14} className="text-gray-400" />
        <span className="text-[12px] text-gray-400 underline font-medium">How we calculate your fees?</span>
    </div>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function HistoryBilling() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const user = state?.user ?? MOCK_USER;
    const isLecturer = user.role.toLowerCase() === 'lecturer';

    // Global State
    const [selectedTab, setSelectedTab] = useState('history'); // "history" | "billing"
    
    const [vehicles, setVehicles] = useState(getStoredVehicles());
    useEffect(() => {
        const handleUpdate = () => setVehicles(getStoredVehicles());
        window.addEventListener('vehicles_updated', handleUpdate);
        return () => window.removeEventListener('vehicles_updated', handleUpdate);
    }, []);

    const [filters, setFilters] = useState({
        vehicle: 'all',
        month: 'Feb, 2026',
        status: 'all',
    });
    const [activities, setActivities] = useState(MOCK_ACTIVITIES);
    const [invoices, setInvoices] = useState(MOCK_INVOICES);

    // Modal State
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [isProcessing, setIsProcessing] = useState(false);

    // Derived Data
    const activityList = useMemo(() => {
        let filtered = activities.filter(item => {
            if (isLecturer && item.type !== 'lecturer') return false;
            if (!isLecturer && item.type !== 'student') return false;
            if (filters.status !== 'all' && item.status !== filters.status) return false;
            if (filters.vehicle !== 'all' && !item.plate.includes(filters.vehicle)) return false;
            
            // Simple month filtering based on the short month name (e.g., "Feb")
            const monthShort = filters.month.split(',')[0];
            if (filters.month !== 'all' && !item.date.includes(monthShort)) return false;
            
            return true;
        });
        return filtered;
    }, [filters, isLecturer]);

    // Group by Date
    const groupedActivities = useMemo(() => {
        const groups = {};
        activityList.forEach(item => {
            if (!groups[item.date]) groups[item.date] = [];
            groups[item.date].push(item);
        });
        return groups;
    }, [activityList]);

    // Debt & Billing Logic
    const totalLimit = 150000;

    const totalDebt = useMemo(() => {
        if (isLecturer) return 0;
        return invoices.filter(i => i.state === 'normal' || i.state === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);
    }, [invoices, isLecturer]);

    const overdueAmount = useMemo(() => {
        if (isLecturer) return 0;
        return invoices.filter(i => i.state === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);
    }, [invoices, isLecturer]);

    const upcomingInvoice = isLecturer ? null : invoices.find(i => i.state === 'upcoming');

    let billingStatus = 'none';
    if (!isLecturer) {
        if (totalDebt > 0) {
            if (overdueAmount > 0) billingStatus = 'overdue';
            else billingStatus = 'normal';
        } else if (upcomingInvoice) {
            billingStatus = 'upcoming';
        }
    }

    let summaryTitle = "Debt Summary";
    let summaryAmount = `${totalDebt.toLocaleString('vi-VN')} đ`;
    let amountColor = "text-gray-900";
    let noteNode = null;

    if (!isLecturer) {
        if (billingStatus === 'overdue') {
            summaryTitle = "Total Amount Due";
            amountColor = "text-red-600";
            noteNode = <p className="text-[12px] text-red-500 font-medium mt-[8px]">Include {overdueAmount.toLocaleString('vi-VN')} đ overdue since {invoices.find(i=>i.state==='overdue')?.note}</p>;
        } else if (billingStatus === 'normal') {
            amountColor = "text-red-600";
            noteNode = <p className="text-[12px] text-red-500 font-medium bg-red-50 p-2 rounded-lg inline-block mt-[8px]">Invoice awaiting payment. Due today.</p>;
        } else if (billingStatus === 'upcoming') {
            summaryAmount = `${upcomingInvoice.amount.toLocaleString('vi-VN')} đ`;
            amountColor = "text-gray-900";
            noteNode = <p className="text-[12px] text-blue-600 font-medium mt-[8px]">Next billing date: {upcomingInvoice.note}</p>;
        } else {
            summaryAmount = "0 đ";
            amountColor = "text-gray-900";
        }
    }

    const handlePay = (id) => {
        const invoice = invoices.find(inv => inv.id === id);
        if (!invoice) return;
        
        setSelectedInvoice(invoice);
        setPaymentStatus('pending');
        setShowPaymentModal(true);
    };

    const handleView = (id) => {
        const invoice = invoices.find(inv => inv.id === id);
        if (!invoice) return;
        
        setSelectedInvoice(invoice);
        setPaymentStatus('paid');
        setShowPaymentModal(true);
    };

    const processPayment = () => {
        setIsProcessing(true);
        // Simulate payment request
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentStatus('paid');
            
            // Mark invoice as paid
            const id = selectedInvoice.id;
            setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, state: 'paid' } : inv));
            
            // Mark all related activities in that month as paid
            const monthShort = selectedInvoice.month.split(',')[0];
            setActivities(prev => prev.map(act => {
                if (act.date.includes(monthShort) && (act.status === 'unpaid' || act.status === 'overdue')) {
                    return { ...act, status: 'paid' };
                }
                return act;
            }));
        }, 1500);
    };

    return (
        // Outer page — centres the phone frame on large screens
        <div className="min-h-screen bg-slate-300 flex items-center justify-center font-sans">
            {/* ── Phone frame: strict 375 × 812 ── */}
            <div
                className="relative flex flex-col bg-white overflow-hidden"
                style={{ width: 375, height: 812, borderRadius: 36, border: '8px solid #1e293b', boxShadow: '0 32px 80px rgba(0,0,0,0.45)' }}
            >
                <Header onBack={() => navigate(-1)} />

                <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
                    {/* Breadcrumb */}
                    <div className="px-[16px] pt-[16px] pb-[8px] text-[13px] text-gray-500 font-medium flex items-center gap-1">
                        <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-[#210F7A] transition-colors">Home</span>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className="text-[#210F7A] font-bold">Parking History & Billing</span>
                    </div>

                    {/* DEBT SUMMARY SECTION */}
                    <div className="mx-[16px] mt-[8px] bg-white rounded-[16px] p-[20px] shadow-sm border border-gray-100">
                        <h2 className="text-[18px] font-bold text-gray-900 mb-[4px]">{summaryTitle}</h2>
                        <p className="text-[13px] text-gray-500 mb-[12px]">February Usage</p>

                        <div className="flex items-baseline gap-1 mb-[8px]">
                            {isLecturer ? (
                                <span className="text-[28px] font-bold text-gray-800">Exempt (Staff)</span>
                            ) : (
                                <>
                                    <span className={`text-[28px] font-bold ${amountColor}`}>
                                        {summaryAmount}
                                    </span>
                                    <span className="text-[14px] text-gray-400 font-medium">/{totalLimit.toLocaleString('vi-VN')} đ</span>
                                </>
                            )}
                        </div>

                        {!isLecturer && noteNode}
                    </div>

                    {/* TAB SWITCH */}
                    <div className="mx-[16px] mt-[20px] bg-gray-200 rounded-[12px] p-[4px] flex flex-row">
                        <button
                            onClick={() => setSelectedTab('history')}
                            className={`flex-1 py-[8px] rounded-[10px] text-[14px] font-bold transition-all ${selectedTab === 'history' ? 'bg-[#5C2FFF] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-300'}`}
                        >
                            History
                        </button>
                        <button
                            onClick={() => setSelectedTab('billing')}
                            className={`flex-1 py-[8px] rounded-[10px] text-[14px] font-bold transition-all ${selectedTab === 'billing' ? 'bg-[#5C2FFF] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-300'}`}
                        >
                            Billing
                        </button>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 bg-white mt-[20px] rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] px-[16px] pt-[24px] flex flex-col">
                        
                        {selectedTab === 'history' ? (
                            <>
                                <h3 className="text-[16px] font-bold text-gray-900 mb-[16px]">Activity Details</h3>

                                {/* FILTER BAR */}
                                <div className="flex flex-row gap-[8px] mb-[20px] overflow-x-auto pb-2 hide-scrollbar">
                                    {/* Vehicle Filter */}
                                    <div className="relative shrink-0">
                                        <select 
                                            className="appearance-none flex items-center gap-1 bg-gray-100 pl-3 pr-7 py-2 rounded-full border border-gray-200 text-[12px] font-semibold text-gray-700 outline-none cursor-pointer"
                                            value={filters.vehicle}
                                            onChange={(e) => setFilters({ ...filters, vehicle: e.target.value })}
                                        >
                                            <option value="all">All vehicles</option>
                                            {vehicles.map(v => (
                                                <option key={v.id} value={v.plateNumber}>{v.plateNumber}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>

                                    {/* Month Filter */}
                                    <div className="relative shrink-0">
                                        <select
                                            value={filters.month}
                                            onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                                            className="appearance-none flex items-center gap-1 bg-gray-100 pl-3 pr-7 py-2 rounded-full border border-gray-200 text-[12px] font-semibold text-gray-700 outline-none cursor-pointer"
                                        >
                                            <option value="all">All time</option>
                                            <option value="Feb, 2026">Feb, 2026</option>
                                            <option value="Jan, 2026">Jan, 2026</option>
                                            <option value="Dec, 2025">Dec, 2025</option>
                                        </select>
                                        <ChevronDown size={14} className="text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>

                                    {/* Status Filter */}
                                    {!isLecturer && (
                                        <div className="relative shrink-0">
                                            <select
                                                value={filters.status}
                                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                                className="appearance-none flex items-center gap-1 bg-gray-100 pl-3 pr-7 py-2 rounded-full border border-gray-200 text-[12px] font-semibold text-gray-700 outline-none cursor-pointer"
                                            >
                                                <option value="all">All status</option>
                                                <option value="unpaid">Unpaid</option>
                                                <option value="overdue">Overdue</option>
                                                <option value="paid">Paid</option>
                                            </select>
                                            <ChevronDown size={14} className="text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    )}
                                </div>

                                {/* ACTIVITY LIST */}
                                <div className="flex-1 flex flex-col pb-[20px]">
                                    {Object.keys(groupedActivities).length === 0 ? (
                                        /* EMPTY STATE */
                                        <div className="flex-1 flex items-center justify-center min-h-[200px]">
                                            <p className="text-[14px] text-gray-400 font-medium">No activity found</p>
                                        </div>
                                    ) : (
                                        Object.entries(groupedActivities).map(([date, items]) => (
                                            <div key={date} className="mb-[16px]">
                                                {/* Date Group Title */}
                                                <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-[8px] px-[8px]">{date}</h4>
                                                
                                                <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
                                                    {items.map((item, index) => (
                                                        <ActivityItem key={item.id} data={item} userRole={user.role.toLowerCase()} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            /* BILLING TAB CONTENT */
                            <>
                                <h3 className="text-[16px] font-bold text-gray-900 mb-[16px]">Monthly Invoices</h3>
                                <div className="flex-1 flex flex-col pb-[20px]">
                                    {invoices.map(inv => (
                                        <InvoiceItem 
                                            key={inv.id} 
                                            data={inv} 
                                            onPay={handlePay} 
                                            onView={handleView} 
                                        />
                                    ))}
                                    <FooterNote />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom home-indicator bar */}
                <div className="shrink-0 h-7 bg-white flex items-center justify-center border-t border-gray-100 z-50">
                    <div className="w-24 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* MODAL OVERLAY */}
                {showPaymentModal && selectedInvoice && (
                    <div className="absolute inset-0 bg-black/40 z-[100] flex justify-center items-center p-[16px] animation-fade-in">
                        <div className="bg-white rounded-[16px] w-full max-w-[340px] p-[20px] shadow-2xl relative flex flex-col scale-in">
                            {/* Close Button */}
                            <button 
                                onClick={() => setShowPaymentModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <h2 className="text-[16px] font-bold text-center text-gray-900 mb-1">INVOICE DETAIL</h2>
                            <p className="text-[12px] text-gray-500 text-center mb-3">
                                01 {selectedInvoice.month.split(',')[0]} 2026 – 28 {selectedInvoice.month.split(',')[0]} 2026
                            </p>

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[12px] font-medium text-gray-500">Invoice ID: INV-2026-{selectedInvoice.id}</span>
                                <span className={`text-[12px] font-bold px-2 py-1 rounded ${paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>
                                    {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                </span>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-gray-50 rounded-[12px] p-[16px] mb-4">
                                <div className="flex justify-between text-[12px] text-gray-600 mb-3">
                                    <span>28 sessions total</span>
                                    <span>142 hours in parking</span>
                                </div>
                                
                                <h3 className="text-[13px] font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">Fee Breakdown</h3>
                                
                                <div className="text-[12px] text-gray-600 mb-3 space-y-1">
                                    <p className="font-semibold text-gray-800">Vehicle: 51A-12345</p>
                                    <div className="flex justify-between">
                                        <span>Daytime (20 x 3.000 đ)</span>
                                        <span>60.000 đ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Overnight (1 x 6.000 đ)</span>
                                        <span>6.000 đ</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                                    <span className="font-bold text-[14px] text-gray-900">Total Amount</span>
                                    <span className="font-bold text-[18px] text-[#5C2FFF]">{selectedInvoice.amount.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>

                            {/* Action / Payment Info */}
                            {paymentStatus === 'pending' ? (
                                <button 
                                    onClick={processPayment}
                                    disabled={isProcessing}
                                    className={`w-full h-[44px] ${isProcessing ? 'bg-purple-400' : 'bg-[#5C2FFF] hover:bg-purple-700'} text-white font-bold rounded-[12px] transition-colors flex items-center justify-center`}
                                >
                                    {isProcessing ? 'Processing...' : 'Pay with BKPAY'}
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <div className="bg-green-50 border border-green-100 rounded-[8px] p-[12px] text-[12px]">
                                        <h4 className="font-bold text-green-800 mb-1">Payment Information</h4>
                                        <div className="flex justify-between text-green-700"><span>Method:</span> <span className="font-semibold">BKPAY</span></div>
                                        <div className="flex justify-between text-green-700"><span>Transaction ID:</span> <span className="font-semibold">VNP-{Math.floor(Math.random()*100000)}</span></div>
                                        <div className="flex justify-between text-green-700"><span>Paid on:</span> <span className="font-semibold">Feb 28, 2026 at 14:32</span></div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="bg-[#5C2FFF] text-white text-[12px] font-bold px-[16px] py-[8px] rounded-[8px] hover:bg-purple-700 transition-colors">
                                            Export PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Minimal CSS for hiding scrollbar & animations */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animation-fade-in { animation: fadeIn 0.2s ease-out forwards; }
                .scale-in { animation: scaleIn 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
}
