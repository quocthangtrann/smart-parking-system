import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, Bell, MonitorPlay, CreditCard, MapPin, Receipt, Menu, Search, Settings, ChevronDown } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, isActive, isCollapsed, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} py-4 cursor-pointer transition-colors duration-200 
            ${isActive ? 'bg-[#f0f0ff] border-r-4 border-[#2d3a8c]' : 'hover:bg-[#f8f9ff]'}`}
            title={isCollapsed ? label : ''}
        >
            <Icon size={22} className={`${isActive ? 'text-[#2d3a8c]' : 'text-gray-500'} shrink-0`} />
            {!isCollapsed && (
                <span className={`ml-4 text-[15px] font-medium ${isActive ? 'text-[#2d3a8c] font-semibold' : 'text-gray-600'}`}>
                    {label}
                </span>
            )}
        </div>
    );
};

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if user exists, otherwise mock
    const rawUser = location.state?.user || { name: 'Nguyen Van A', role: 'System Administrator' };
    // Backend returns 'fullName', but layout uses 'name' — normalize here
    const user = { ...rawUser, name: rawUser.name || rawUser.fullName || rawUser.username || 'Admin' };
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);

    // Determine active route
    const currentPath = location.pathname;

    const menuItems = [
        { icon: Home, label: 'Smart Home', path: '#' },
        { icon: Activity, label: 'Activity report', path: '/admin/dashboard' },
        { icon: Bell, label: 'Alerts', path: '/admin/notifications' },
        { icon: MonitorPlay, label: 'Devices', path: '/admin/devices' },
        { icon: CreditCard, label: 'Credentials cards', path: '/admin/credentials' },
        { icon: MapPin, label: 'Parking places', path: '/admin/parking' },
        { icon: Receipt, label: 'Fee policy', path: '/admin/policy' },
    ];

    const handleLogout = () => {
        // Clear session if needed
        // localStorage.removeItem('user');
        navigate('/', { replace: true });
    };

    return (
        <div className="flex h-screen w-full bg-[#f5f6fa] font-sans overflow-hidden">
            {/* SIDEBAR */}
            <div 
                className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-20 shadow-sm shrink-0`}
                style={{ width: isCollapsed ? '70px' : '220px' }}
            >
                {/* Logo Section */}
                <div className="h-[70px] bg-gradient-to-r from-[#210F7A] to-[#2d3a8c] flex items-center justify-center shrink-0">
                    {isCollapsed ? (
                        <div className="text-white font-bold text-[20px]">SYS</div>
                    ) : (
                        <div className="text-white font-bold text-[14px] tracking-wider text-center leading-tight">
                            SYSTEM <br/> ADMINISTRATOR
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-4">
                    {menuItems.map((item, idx) => (
                        <SidebarItem 
                            key={idx} 
                            icon={item.icon} 
                            label={item.label} 
                            isActive={currentPath === item.path} 
                            isCollapsed={isCollapsed} 
                            onClick={() => navigate(item.path, { state: { user } })}
                        />
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* TOPBAR */}
                <header className="h-[70px] bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-[300px]">
                            <Search size={18} className="text-gray-400" />
                            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none ml-2 w-full text-sm" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 relative">
                        <button className="relative text-gray-500 hover:text-[#2d3a8c] transition-colors">
                            <Bell size={22} />
                            <span className="absolute -top-1 -right-1 w-[8px] h-[8px] bg-red-500 rounded-full"></span>
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                                className={`transition-colors duration-200 ${showLogoutMenu ? 'text-indigo-600 bg-gray-50' : 'text-gray-500 hover:text-indigo-600'} p-2 rounded-lg`}
                                title="Account Settings"
                            >
                                <Settings size={22} />
                            </button>

                            {/* LOGOUT DROPDOWN */}
                            {showLogoutMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in duration-200">
                                    <div className="p-2">
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-bold text-sm"
                                        >
                                            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                            </div>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-8 w-[1px] bg-gray-200"></div>
                        
                        <div 
                            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                            className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-all"
                        >
                            <div className="w-[36px] h-[36px] bg-[#2d3a8c] text-white rounded-full flex items-center justify-center font-bold transition-colors">
                                {user.name.charAt(0)}
                            </div>
                            <div className="hidden md:block text-right">
                                <div className="text-[14px] font-bold text-gray-800 leading-tight">{user.name}</div>
                                <div className="text-[11px] text-gray-500">{user.role}</div>
                            </div>
                            <ChevronDown size={16} className={`text-gray-400 hidden md:block transition-transform duration-200 ${showLogoutMenu ? 'rotate-180 text-indigo-600' : ''}`} />
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE OUTLET CONTENT */}
                <div className="flex-1 overflow-y-auto p-6">
                    <Outlet context={{ user }} />
                </div>
            </div>
        </div>
    );
}
