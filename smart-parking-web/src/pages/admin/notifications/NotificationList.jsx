import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'Critical', content: 'Detect unusual login from unknown IP', time: '14:32', status: 'critical' },
    { id: 2, type: 'Request', content: 'Lecturer requested access permission', time: '18:36', status: 'request' },
    { id: 3, type: 'Information', content: 'Policy updated successfully', time: '07:20', status: 'info' },
    { id: 4, type: 'Warning', content: 'Parking nearly full', time: '09:45', status: 'warning' },
];

export default function NotificationList() {
    const [searchQuery, setSearchQuery] = useState('');

    const getStatusStyle = (status) => {
        switch (status) {
            case 'critical': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'request': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'info': return 'text-gray-500 bg-gray-50 border-gray-100';
            case 'warning': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* TITLE */}
            <div className="pt-12 pb-6 px-10 text-center">
                <h2 className="text-[#1a1a1a] font-bold text-2xl uppercase font-inter tracking-wide">
                    Notifications
                </h2>
            </div>

            {/* SEARCH BAR */}
            <div className="px-10 mb-6">
                <div className="relative bg-[#eeeeee] rounded-md flex items-center h-[36px] px-2">
                    <Search size={24} className="text-gray-500" />
                    <input 
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none ml-2 text-sm placeholder-gray-500"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="ml-1 p-1 hover:bg-gray-200 rounded-full">
                            <X size={18} className="text-gray-500" />
                        </button>
                    )}
                </div>
            </div>

            {/* TABLE AREA */}
            <div className="flex-1 overflow-y-auto px-10 pb-6 custom-scrollbar">
                <table className="w-full border-separate border-spacing-y-2">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-purple-600 text-white font-bold text-[13px] uppercase">
                            <th className="py-3 px-4 text-left first:rounded-l-lg">Types</th>
                            <th className="py-3 px-4 text-left">Content</th>
                            <th className="py-3 px-4 text-left">Time</th>
                            <th className="py-3 px-4 text-left last:rounded-r-lg text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-inter">
                        {MOCK_NOTIFICATIONS.map((notif) => (
                            <tr key={notif.id} className="bg-gray-50/50 hover:bg-gray-100 transition-all cursor-pointer">
                                <td className="py-4 px-4 first:rounded-l-lg border-y border-l border-gray-100">
                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(notif.status)}`}>
                                        {notif.type}
                                    </span>
                                </td>
                                <td className="py-4 px-4 font-bold text-gray-800 border-y border-gray-100 max-w-[200px] truncate">
                                    {notif.content}
                                </td>
                                <td className="py-4 px-4 text-gray-500 font-medium border-y border-gray-100">
                                    {notif.time}
                                </td>
                                <td className="py-4 px-4 last:rounded-r-lg border-y border-r border-gray-100 text-center">
                                    <button className="text-indigo-600 font-black text-[11px] uppercase tracking-tighter hover:underline">
                                        {notif.type === 'Request' ? 'Approve' : 'Details'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
