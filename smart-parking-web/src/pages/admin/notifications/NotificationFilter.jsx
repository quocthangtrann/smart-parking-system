import React from 'react';
import { Calendar, Filter } from 'lucide-react';

export default function NotificationFilter() {
    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-[#1a1a1a] font-bold text-lg">Filter by:</h3>
            
            <div className="flex items-center gap-4">
                {/* From Date */}
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder="DD/MM/YYYY" 
                        className="w-full bg-gray-50 border border-gray-100 py-3 px-10 rounded-xl outline-none focus:border-indigo-600 transition-all text-sm"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>

                <span className="text-gray-400 font-bold">to</span>

                {/* To Date */}
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder="DD/MM/YYYY" 
                        className="w-full bg-gray-50 border border-gray-100 py-3 px-10 rounded-xl outline-none focus:border-indigo-600 transition-all text-sm"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* Filter Icon Button */}
                <button className="bg-indigo-600 text-white p-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                    <Filter size={20} />
                </button>
            </div>
        </div>
    );
}
