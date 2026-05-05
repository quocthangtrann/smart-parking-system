import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import logoBk from '../../assets/logobk.png';

const Header = ({ onBack }) => (
    <header className="h-[77px] bg-[#210F7A] flex items-center px-[17px] shrink-0 z-10 shadow-md">
        <button onClick={onBack} className="p-1 mr-2 rounded hover:bg-white/10 transition-colors">
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

const Section = ({ title, children }) => (
    <div className="mb-[24px]">
        <h3 className="text-[14px] font-bold text-gray-500 mb-[12px] px-[16px] tracking-wide">{title}</h3>
        <div className="bg-white mx-[16px] rounded-[12px] shadow-sm border border-gray-200 overflow-hidden">
            {children}
        </div>
    </div>
);

const SettingItem = ({ label, value, onClick, hasArrow = true }) => (
    <div 
        onClick={onClick}
        className={`flex justify-between items-center px-[16px] py-[16px] bg-gray-50 border-b border-gray-100 last:border-b-0 ${onClick ? 'cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors' : ''}`}
    >
        <span className="text-[15px] font-medium text-gray-900">{label}</span>
        <div className="flex items-center gap-[8px]">
            {value && <span className="text-[14px] text-gray-500 font-medium">{value}</span>}
            {hasArrow && <ChevronRight size={16} className="text-gray-400" />}
        </div>
    </div>
);

const ToggleSwitch = ({ label, isOn, onToggle }) => (
    <div className="flex justify-between items-center px-[16px] py-[16px] bg-gray-50 border-b border-gray-100 last:border-b-0">
        <span className="text-[15px] font-medium text-gray-900">{label}</span>
        <button 
            onClick={onToggle}
            className={`w-[44px] h-[24px] flex items-center rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-[#5C2FFF]' : 'bg-gray-300'}`}
        >
            <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-[20px]' : 'translate-x-0'}`} />
        </button>
    </div>
);

export default function Settings() {
    const navigate = useNavigate();

    const [billingDate, setBillingDate] = useState(28);
    const [spendingLimit, setSpendingLimit] = useState(200000);
    const [entryExitAlerts, setEntryExitAlerts] = useState(true);
    const [paymentReminders, setPaymentReminders] = useState(true);

    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);

    const limitOptions = [50000, 100000, 150000, 200000];
    const dateOptions = Array.from({length: 31}, (_, i) => i + 1);

    const formatCurrency = (amount) => amount.toLocaleString('vi-VN') + ' đ';

    const handleSignOut = () => {
        // clear session mocked
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-300 flex items-center justify-center font-sans">
            <div
                className="relative flex flex-col bg-white overflow-hidden"
                style={{ width: 375, height: 812, borderRadius: 36, border: '8px solid #1e293b', boxShadow: '0 32px 80px rgba(0,0,0,0.45)' }}
            >
                <Header onBack={() => navigate(-1)} />

                <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col pb-[40px]">
                    {/* Breadcrumb */}
                    <div className="px-[16px] pt-[16px] pb-[20px] text-[13px] text-gray-500 font-medium flex items-center gap-1">
                        <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-[#210F7A] transition-colors">Home</span>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className="text-[#210F7A] font-bold">Settings</span>
                    </div>

                    <Section title="Billing & Payment">
                        <SettingItem 
                            label="Billing Date" 
                            value={`${billingDate}${billingDate === 1 || billingDate === 21 || billingDate === 31 ? 'st' : billingDate === 2 || billingDate === 22 ? 'nd' : billingDate === 3 || billingDate === 23 ? 'rd' : 'th'} monthly`} 
                            onClick={() => setShowDateModal(true)} 
                        />
                        <SettingItem 
                            label="Spending Limit" 
                            value={formatCurrency(spendingLimit)} 
                            onClick={() => setShowLimitModal(true)} 
                        />
                    </Section>

                    <Section title="Notifications">
                        <SettingItem 
                            label="Usage Alerts" 
                            value="At 80% & 100%" 
                            hasArrow={false}
                        />
                        <ToggleSwitch 
                            label="Entry/Exit Alerts" 
                            isOn={entryExitAlerts} 
                            onToggle={() => setEntryExitAlerts(!entryExitAlerts)} 
                        />
                        <ToggleSwitch 
                            label="Payment Reminders" 
                            isOn={paymentReminders} 
                            onToggle={() => setPaymentReminders(!paymentReminders)} 
                        />
                    </Section>

                    {/* Sign Out Button */}
                    <div className="px-[16px] mt-[10px] mb-[30px]">
                        <button 
                            onClick={handleSignOut}
                            className="w-full h-[52px] bg-white border border-red-200 text-red-500 font-bold text-[15px] rounded-[12px] hover:bg-red-50 transition-colors shadow-sm"
                        >
                            Sign out
                        </button>
                    </div>
                </div>

                <div className="shrink-0 h-7 bg-white flex items-center justify-center border-t border-gray-100 z-50">
                    <div className="w-24 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* MODALS */}
                
                {/* Spending Limit Modal */}
                {showLimitModal && (
                    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 animation-fade-in">
                        <div className="w-full bg-white rounded-t-[24px] p-[20px] pb-[40px] shadow-lg transform transition-transform">
                            <h3 className="text-[18px] font-bold text-gray-900 mb-[16px] text-center">Select Spending Limit</h3>
                            <div className="flex flex-col gap-[8px]">
                                {limitOptions.map(option => (
                                    <button 
                                        key={option}
                                        onClick={() => {
                                            setSpendingLimit(option);
                                            setShowLimitModal(false);
                                        }}
                                        className={`flex items-center justify-between px-[16px] py-[14px] rounded-[12px] border transition-colors ${spendingLimit === option ? 'border-[#5C2FFF] bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                    >
                                        <span className={`text-[15px] font-medium ${spendingLimit === option ? 'text-[#5C2FFF] font-bold' : 'text-gray-700'}`}>
                                            {formatCurrency(option)}
                                            {option === 200000 && <span className="ml-2 text-[12px] text-gray-400 font-normal">(Max)</span>}
                                        </span>
                                        <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${spendingLimit === option ? 'border-[#5C2FFF]' : 'border-gray-300'}`}>
                                            {spendingLimit === option && <div className="w-[10px] h-[10px] bg-[#5C2FFF] rounded-full" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setShowLimitModal(false)}
                                className="w-full mt-[16px] py-[14px] bg-gray-100 text-gray-700 font-bold rounded-[12px] hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Billing Date Modal */}
                {showDateModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-[20px] animation-fade-in">
                        <div className="w-full max-h-[80%] bg-white rounded-[20px] flex flex-col shadow-lg overflow-hidden">
                            <div className="p-[20px] border-b border-gray-100 shrink-0">
                                <h3 className="text-[18px] font-bold text-gray-900 text-center">Select Billing Date</h3>
                            </div>
                            <div className="p-[16px] overflow-y-auto grid grid-cols-5 gap-2">
                                {dateOptions.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => {
                                            setBillingDate(day);
                                            setShowDateModal(false);
                                        }}
                                        className={`aspect-square rounded-full flex items-center justify-center text-[14px] font-medium transition-colors ${billingDate === day ? 'bg-[#5C2FFF] text-white font-bold shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                            <div className="p-[16px] border-t border-gray-100 shrink-0">
                                <button 
                                    onClick={() => setShowDateModal(false)}
                                    className="w-full py-[12px] bg-gray-100 text-gray-700 font-bold rounded-[12px] hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                ::-webkit-scrollbar { display: none; }
                * { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animation-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
