import React, { useState, useEffect } from 'react';
import { Home, Bell, Settings, Filter, ChevronRight, IdCard, History, CreditCard, Car, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// ==========================================
// 1. NÚT CHỌN ROLE (Admin hoặc HCMUT Account)
// Kích thước: 130x106, Bo góc: 25px, Màu: FFD85A
// ==========================================
export const RoleButton = ({ isFilled = false, label, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-[130px] h-[106px] rounded-[25px] bg-[#FFD85A] flex flex-col items-center justify-center gap-3 shadow-sm hover:scale-105 transition-transform"
        >
            {/* Icon SVG vẽ chính xác theo mô tả (đầu tròn, vai cong) */}
            <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill={isFilled ? "black" : "none"}
                stroke="black"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="20" cy="13" r="6.6" />
                <path d="M6.6 33.3C6.6 26 12.6 20 20 20C27.4 20 33.3 26 33.3 33.3" />
            </svg>

            <span className="font-sans text-[12px] font-normal text-black leading-none">
                {label}
            </span>
        </button>
    );
};

// ==========================================
// 2. NÚT LOGIN / CLEAR
// Kích thước: Tự động ôm chữ hoặc fix theo Mobile/Laptop, Bo góc: 4-5px, Màu: 006DCC
// ==========================================
export const LoginButton = ({ children, onClick, variant = 'primary', isMobile = false }) => {
    const baseStyle = "flex items-center justify-center text-white transition-opacity hover:opacity-90";
    // Mobile: 60x29 (Radius 4). Laptop: ôm nội dung (min 79x44, Radius 5)
    const sizeStyle = isMobile
        ? "w-[60px] h-[29px] rounded text-sm"
        : "min-w-[79px] h-[44px] rounded-[5px] px-[10px] py-[10px]";

    // Nút clear có thể có màu nền khác hoặc chỉ có viền, ở đây tạm set giống nút login theo mô tả
    const colorStyle = "bg-loginBtn";

    return (
        <button onClick={onClick} className={`${baseStyle} ${sizeStyle} ${colorStyle}`}>
            {children}
        </button>
    );
};

// ==========================================
// 3. Ô NHẬP LIỆU (Username / Password)
// Kích thước: 297x30, Bo góc: 4px
// ==========================================
export const LoginInputField = ({ label, placeholder, type = "text", isAdmin = false }) => {
    // Biến trạng thái để theo dõi việc ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    // Kiểm tra xem đây có phải là ô nhập mật khẩu không
    const isPassword = type === "password";

    // Quyết định kiểu input thực tế (text hay password)
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="flex flex-col gap-[7px]">
            {/* Label: Inter, Regular, size 20 */}
            <label className="text-black font-sans text-[20px] font-normal leading-none">
                {label}
            </label>

            {/* Khung bao ngoài Input */}
            <div className="flex items-center h-[30px] w-full md:w-[297px] rounded-[4px] border border-[#777777] overflow-hidden bg-white shadow-sm focus-within:ring-1 focus-within:ring-primary px-[8px]">

                {/* ICON PHÍA TRƯỚC (User hoặc Ổ khóa) */}
                <div className="flex items-center justify-center text-black mr-[8px] shrink-0">
                    {isPassword ? (
                        // ICON Ổ KHÓA (Cho mật khẩu)
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    ) : (
                        // ICON USER (Cho Username) - Vẽ chính xác theo kích thước bạn yêu cầu
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {/* Circle (head): 8x8 -> radius = 4 */}
                            <circle cx="12" cy="8" r="4" />
                            {/* Curved line (shoulders): 16x6 */}
                            <path d="M4 20c0-3.3 2.7-6 8-6s8 2.7 8 6" />
                        </svg>
                    )}
                </div>

                {/* Ô NHẬP LIỆU CHÍNH */}
                <input
                    type={inputType}
                    placeholder={placeholder}
                    className="flex-1 w-full bg-transparent text-sm outline-none font-sans text-black"
                />

                {/* ICON CON MẮT Ở CUỐI (Chỉ hiện nếu là ô Password) */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center justify-center text-gray-500 hover:text-black ml-[8px] shrink-0"
                    >
                        {showPassword ? (
                            // Icon Mắt Mở (Đang hiện mật khẩu)
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        ) : (
                            // Icon Mắt Nhắm (Đang ẩn mật khẩu)
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                            </svg>
                        )}
                    </button>
                )}

            </div>
        </div>
    );
};

// ==========================================
// 4. NÚT ACTION NHỎ (Cancel / Confirm)
// Kích thước: 103x40, Bo góc: 12px, Màu: 210F7A
// ==========================================
export const ActionButton = ({ children, onClick, isOutline = false }) => {
    const style = isOutline
        ? "border-2 border-primary text-primary bg-transparent"
        : "bg-primary text-white";

    return (
        <button
            onClick={onClick}
            className={`w-[103px] h-[40px] rounded-xl flex items-center justify-center font-medium hover:opacity-90 transition-opacity ${style}`}
        >
            {children}
        </button>
    );
};

// ==========================================
// 5. NÚT LỚN CUỐI TRANG (View available slot, v.v.)
// Kích thước: 285x41, Bo góc: 20px, Màu: 210F7A
// ==========================================
export const LargeBottomButton = ({ children, onClick }) => (
    <button
        onClick={onClick}
        className="w-[285px] h-[41px] rounded-[20px] bg-primary text-white flex items-center justify-center font-medium hover:opacity-90 transition-opacity mx-auto"
    >
        {children}
    </button>
);

// ==========================================
// 6. THẺ TRẠNG THÁI MÀU SẮC (Dùng cho Slot hoặc In progress)
// ==========================================
export const StatusIndicator = ({ type = "success" }) => {
    const colorMap = {
        success: "bg-status-success", // 2E7D32
        warning: "bg-status-warning", // ED6C02
        danger: "bg-status-danger",   // D32F2F
    };

    return (
        <div className={`w-3 h-3 rounded-full ${colorMap[type]}`}></div>
    );
};

// ==========================================
// 1. THANH TOP ICON BAR (Dưới Header)
// ==========================================
export const TopIconBar = () => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showHomeMenu, setShowHomeMenu] = useState(false);

    useEffect(() => {
        const updateCount = () => {
            const saved = localStorage.getItem('notifications');
            if (saved) {
                const parsed = JSON.parse(saved);
                setUnreadCount(parsed.filter(n => !n.isRead).length);
            } else {
                setUnreadCount(2); // Default mock unread count
            }
        };
        
        updateCount();
        window.addEventListener('notifications_updated', updateCount);
        return () => window.removeEventListener('notifications_updated', updateCount);
    }, []);

    return (
        <div className="flex justify-between items-center w-full px-[20px] py-[15px] relative">
            <button 
                onClick={() => setShowHomeMenu(!showHomeMenu)} 
                className="text-primary hover:bg-gray-100 p-2 rounded-full transition-colors relative"
            >
                <Home size={24} />
            </button>
            
            {showHomeMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowHomeMenu(false)}></div>
                    <div className="absolute top-[60px] left-[20px] w-[200px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 z-50 flex flex-col py-2">
                        <button onClick={() => { setShowHomeMenu(false); navigate('/digital-card'); }} className="text-left px-4 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50">Parking Card</button>
                        <button onClick={() => { setShowHomeMenu(false); navigate('/billing'); }} className="text-left px-4 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50">History & Billing</button>
                        <button onClick={() => { setShowHomeMenu(false); navigate('/map'); }} className="text-left px-4 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50">Real-time Parking</button>
                        <button onClick={() => { setShowHomeMenu(false); navigate('/vehicles'); }} className="text-left px-4 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50">Vehicle</button>
                        <button onClick={() => { setShowHomeMenu(false); navigate('/session'); }} className="text-left px-4 py-3 text-[14px] font-bold text-[#5C2FFF] bg-purple-50 hover:bg-purple-100 transition-colors">Session Detail</button>
                    </div>
                </>
            )}

            <div className="flex gap-[15px]">
                <button 
                    onClick={() => navigate('/notifications')}
                    className="relative text-primary hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                    <Bell size={24} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-2 bg-red-500 text-white text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center border-2 border-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
                <button 
                    onClick={() => navigate('/settings')}
                    className="text-primary hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                    <Settings size={24} />
                </button>
            </div>
        </div>
    );
};

// ==========================================
// 2. GATE ITEM (Dòng trạng thái bãi xe)
// ==========================================
export const GateItem = ({ name, slots, statusColor }) => {
    const colorMap = {
        green: "bg-[#2E7D32]",
        orange: "bg-[#ED6C02]",
        red: "bg-[#D32F2F]",
    };

    return (
        <div className="flex justify-between items-center py-[12px] border-b border-gray-100 last:border-0">
            {/* Left Side */}
            <div className="flex items-center gap-[12px]">
                <div className={`w-[12px] h-[12px] rounded-full ${colorMap[statusColor]}`}></div>
                <span className="text-[14px] font-medium text-black">{name}</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-[8px]">
                <span className={`text-[14px] font-medium ${slots === 0 ? 'text-[#D32F2F]' : 'text-gray-600'}`}>
                    {slots} slots left
                </span>
                <ChevronRight size={16} className="text-gray-400" />
            </div>
        </div>
    );
};

// ==========================================
// 3. ACTION CARD (Nút chức năng nhanh)
// ==========================================
export const ActionCard = ({ icon, label, isFullWidth = false, onClick }) => (
    <button
        onClick={onClick}
        className={`
      flex flex-col items-center justify-center gap-[8px] bg-white border border-gray-200 
      rounded-[12px] p-[16px] shadow-sm hover:shadow-md hover:border-primary transition-all
      ${isFullWidth ? 'col-span-2 w-full flex-row gap-[16px]' : 'aspect-square'}
    `}
    >
        <div className="text-primary">
            {icon}
        </div>
        <span className="text-[13px] font-semibold text-[#210F7A]">{label}</span>
    </button>
);

// ==========================================
// 4. SESSION CARD (Thẻ phiên gửi xe hiện tại)
// ==========================================
export const SessionCard = ({ plate, time, status, location, onClick }) => {
    const Container = onClick ? 'button' : 'div';
    
    return (
        <Container 
            onClick={onClick}
            className={`w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-[16px] flex justify-between items-center shadow-sm text-left ${onClick ? 'hover:border-primary hover:shadow-md transition-all cursor-pointer' : ''}`}
        >
            {/* Left */}
            <div className="flex flex-col gap-[4px]">
                <span className="text-[16px] font-bold text-[#210F7A]">{plate}</span>
                <span className="text-[13px] text-gray-500 font-medium">{time}</span>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-[4px] text-right">
                <div className="flex items-center gap-[6px]">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#2E7D32]"></div>
                    <span className="text-[13px] font-bold text-[#2E7D32]">{status}</span>
                </div>
                <span className="text-[12px] text-gray-600 whitespace-pre-line leading-tight">
                    {location}
                </span>
            </div>
        </Container>
    );
};