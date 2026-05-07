import React from 'react';
import { Filter, History, ChevronRight } from 'lucide-react';

const MOCK_HISTORY = [
    { action: 'Blocking card', time: '11:46' },
    { action: 'Unblocking card', time: '09:20' },
    { action: 'New card request', time: '08:15' },
    { action: 'Blocking card', time: '昨天 14:30' },
];

export default function CredentialActions() {
    return (
        <div className="flex flex-col gap-8 h-full">
            {/* SECTION 1: FILTER CARDS */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Filter className="text-purple-600" size={20} />
                    <h3 className="text-[#1a1a1a] font-bold text-lg uppercase tracking-wider">Filter Cards</h3>
                </div>
                
                <div className="flex flex-col gap-3">
                    {['Online', 'Block', 'New request'].map(item => (
                        <label key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all group">
                            <span className="font-bold text-gray-700">{item}</span>
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-purple-500 transition-colors"></div>
                        </label>
                    ))}
                </div>
            </div>

            {/* SECTION 2: HISTORY OF BLOCKING CARD */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col min-h-0">
                <div className="flex items-center gap-3 mb-6">
                    <History className="text-purple-600" size={20} />
                    <h3 className="text-[#1a1a1a] font-bold text-lg uppercase tracking-wider">History of blocking card</h3>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="text-[11px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-2">
                                <th className="pb-3 px-2">Action</th>
                                <th className="pb-3 px-2">Time</th>
                                <th className="pb-3 px-2 text-right">Action Button</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {MOCK_HISTORY.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
                                    <td className="py-4 px-2 font-bold text-gray-800">{item.action}</td>
                                    <td className="py-4 px-2 text-gray-400 font-medium">{item.time}</td>
                                    <td className="py-4 px-2 text-right">
                                        <button className="text-purple-600 font-bold hover:underline inline-flex items-center gap-1">
                                            Details <ChevronRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
