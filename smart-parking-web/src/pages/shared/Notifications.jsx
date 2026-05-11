import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Bell, X } from 'lucide-react';
import logoBk from '../../assets/logobk.png';
import { fetchAPI, socket } from '../../api/config';

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

const NotificationItem = ({ data, onRead, onConfirm, onReport }) => {
    // Colors based on type
    let barColor = 'bg-[#5C2FFF]'; // info
    let titleColor = 'text-gray-900';
    if (data.type === 'alert') { barColor = 'bg-red-500'; titleColor = 'text-red-600'; }
    if (data.type === 'warning') { barColor = 'bg-orange-500'; titleColor = 'text-orange-600'; }

    return (
        <div 
            onClick={() => onRead(data.id)}
            className={`w-full relative flex flex-col bg-white border rounded-[12px] p-[16px] mb-[12px] transition-all cursor-pointer shadow-sm
            ${data.isRead ? 'opacity-60 bg-gray-50 border-gray-100' : 'opacity-100 border-gray-200'}
            `}
        >
            {!data.isRead && (
                <div className={`absolute left-0 top-0 bottom-0 w-[4px] rounded-l-[12px] ${barColor}`} />
            )}
            
            <div className="flex justify-between items-start mb-[8px]">
                <h3 className={`text-[14px] font-bold pr-2 ${titleColor}`}>
                    {data.title}
                </h3>
                <span className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5">{data.timestamp}</span>
            </div>
            
            <p className="text-[13px] text-gray-500 whitespace-pre-line leading-relaxed mb-[12px]">
                {data.message}
            </p>

            {data.type === 'alert' && !data.isRead && (
                <div className="flex gap-2 mt-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onConfirm(data.id); }}
                        className="flex-1 py-[8px] border border-[#5C2FFF] text-[#5C2FFF] text-[12px] font-bold rounded-[8px] hover:bg-purple-50 transition-colors"
                    >
                        Confirm vehicle
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onReport(data.id); }}
                        className="flex-1 py-[8px] border border-red-500 text-red-500 text-[12px] font-bold rounded-[8px] hover:bg-red-50 transition-colors"
                    >
                        Report suspicious
                    </button>
                </div>
            )}
        </div>
    );
};

export default function Notifications() {
    const navigate = useNavigate();
    const { state } = useLocation();
    // Resolve user from navigation state or localStorage fallback
    const user = state?.user ?? JSON.parse(localStorage.getItem('user') || 'null');

    const [notifications, setNotifications] = useState([]);

    // Load real notifications from API, subscribe to socket events
    useEffect(() => {
        if (user?.id) {
            fetchAPI(`/notifications/user/${user.id}`)
                .then(data => setNotifications(data || []))
                .catch(console.error);
        }

        if (socket) {
            socket.on('new_notification', (notif) => {
                // Only show if targetRole is 'All' or matches the user's role
                if (!notif.targetRole || notif.targetRole === 'All' || notif.targetRole.toLowerCase() === user?.role?.toLowerCase()) {
                    setNotifications(prev => [notif, ...prev]);
                }
            });
        }
        return () => { if (socket) socket.off('new_notification'); };
    }, []);

    const newNotifications = useMemo(() => notifications.filter(n => !n.isRead), [notifications]);
    const earlierNotifications = useMemo(() => notifications.filter(n => n.isRead), [notifications]);

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        // FIX #7: persist via API
        if (user?.id) {
            fetchAPI(`/notifications/user/${user.id}/read-all`, { method: 'PATCH' })
                .catch(console.error);
        }
    };

    const handleRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        // FIX #7: persist via API
        fetchAPI(`/notifications/${id}/read`, { method: 'PATCH' }).catch(console.error);
    };

    const handleConfirm = (id) => {
        handleRead(id);
    };

    const handleReport = (id) => {
        alert("Report sent to campus security.");
        handleRead(id);
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
                    <div className="px-[16px] pt-[16px] pb-[8px] text-[13px] text-gray-500 font-medium flex items-center gap-1">
                        <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-[#210F7A] transition-colors">Home</span>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className="text-[#210F7A] font-bold">Notifications</span>
                    </div>

                    {/* Header Section */}
                    <div className="px-[16px] pb-[16px] flex justify-between items-center">
                        <h2 className="text-[18px] font-bold text-gray-900">All Notifications</h2>
                        {newNotifications.length > 0 && (
                            <button 
                                onClick={handleMarkAllRead}
                                className="text-[13px] font-bold text-[#5C2FFF] flex items-center gap-1 hover:opacity-80 bg-purple-50 px-2 py-1.5 rounded-lg"
                            >
                                <CheckCircle2 size={14} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="px-[16px] pt-[20px]">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                                <Bell size={40} className="mb-3 opacity-20" />
                                <p className="text-[14px] font-medium">No notifications</p>
                            </div>
                        ) : (
                            <>
                                {/* NEW */}
                                {newNotifications.length > 0 && (
                                    <div className="mb-[24px]">
                                        <h3 className="text-[14px] font-bold text-gray-900 mb-[12px] px-1">
                                            New <span className="text-white bg-red-500 rounded-full px-2 py-0.5 text-[10px] ml-1">{newNotifications.length}</span>
                                        </h3>
                                        {newNotifications.map(n => (
                                            <NotificationItem key={n.id} data={n} onRead={handleRead} onConfirm={handleConfirm} onReport={handleReport} />
                                        ))}
                                    </div>
                                )}

                                {/* EARLIER */}
                                {earlierNotifications.length > 0 && (
                                    <div>
                                        <h3 className="text-[14px] font-bold text-gray-500 mb-[12px] px-1">Earlier</h3>
                                        {earlierNotifications.map(n => (
                                            <NotificationItem key={n.id} data={n} onRead={handleRead} onConfirm={handleConfirm} onReport={handleReport} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="shrink-0 h-7 bg-white flex items-center justify-center border-t border-gray-100 z-50">
                    <div className="w-24 h-1 bg-gray-300 rounded-full" />
                </div>
            </div>
            
            <style>{`
                ::-webkit-scrollbar { display: none; }
                * { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
