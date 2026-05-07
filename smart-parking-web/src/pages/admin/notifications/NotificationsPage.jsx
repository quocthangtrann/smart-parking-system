import React, { useState } from 'react';
import { Bell, Mail, FileText, ShieldAlert, Plus } from 'lucide-react';
import KPICard from '../devices/KPICard';
import NotificationList from './NotificationList';
import NotificationFilter from './NotificationFilter';
import NotificationForm from './NotificationForm';

export default function NotificationsPage() {
    const [showForm, setShowForm] = useState(false);

    if (showForm) {
        return <NotificationForm onBack={() => setShowForm(false)} />;
    }

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-x-auto pb-10">
            
            {/* 1. BREADCRUMB */}
            <div className="flex items-center text-[13px] font-medium text-gray-400">
                <span>Home</span>
                <span className="mx-2 text-gray-300 font-normal">&gt;</span>
                <span className="text-gray-500">Notifications</span>
            </div>

            {/* 2. KPI CARDS */}
            <div className="flex flex-row flex-nowrap gap-6 w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Notifications" 
                        value="140" 
                        icon={Bell}
                        iconColor="text-indigo-600"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Unread" 
                        value="6" 
                        icon={Mail}
                        iconColor="text-rose-500"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Requests" 
                        value="122" 
                        icon={FileText}
                        iconColor="text-amber-500"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Security alert" 
                        value="140" 
                        icon={ShieldAlert}
                        iconColor="text-red-600"
                    />
                </div>
            </div>

            {/* 3. MAIN CONTENT (50/50 SPLIT) */}
            <div className="flex flex-row justify-between w-full min-w-[1250px] gap-8 h-[600px] items-start mt-4">
                
                {/* LEFT PANEL: NOTIFICATION LIST (50%) */}
                <div style={{ width: '606px', height: '594px' }} className="shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                    <NotificationList />
                </div>

                {/* RIGHT PANEL: FILTER + ACTION (50%) */}
                <div style={{ width: '610px', height: '594px' }} className="shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm ml-auto bg-white p-10 flex flex-col gap-8">
                    <NotificationFilter />
                    
                    {/* APPLY NOTIFICATIONS CARD */}
                    <div className="mt-auto bg-indigo-50 rounded-2xl p-8 border border-indigo-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-indigo-900 font-bold text-xl mb-2">Applying Notifications</h3>
                            <p className="text-indigo-600 font-medium mb-6">Customers: 104,208</p>
                            <button 
                                onClick={() => setShowForm(true)}
                                className="w-full bg-white text-indigo-600 font-bold py-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-indigo-200"
                            >
                                Review full content
                            </button>
                        </div>
                        <Bell className="absolute -right-4 -bottom-4 text-indigo-100" size={120} />
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-4">
                        <button className="flex-1 py-4 px-6 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all">
                            Reset All
                        </button>
                        <button className="flex-1 py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                            Applying Notification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
