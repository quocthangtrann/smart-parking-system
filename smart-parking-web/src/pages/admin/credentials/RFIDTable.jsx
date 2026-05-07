import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { fetchAPI, socket } from '../../../api/config';

export default function RFIDTable() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchAPI('/users').then(setUsers).catch(console.error);
    }, []);

    return (
        <div className="bg-white flex flex-col h-full shadow-sm" style={{ width: '610px' }}>
            {/* TITLE */}
            <div className="pt-12 pb-6 px-10 text-center">
                <h2 className="text-[#1a1a1a] font-bold text-2xl uppercase font-inter tracking-wide">
                    RFID Cards
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
                            <th className="py-3 px-4 text-left first:rounded-l-lg">Serial</th>
                            <th className="py-3 px-4 text-left">Holder</th>
                            <th className="py-3 px-4 text-left">Class</th>
                            <th className="py-3 px-4 text-left">State</th>
                            <th className="py-3 px-4 text-left last:rounded-r-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map((user, idx) => (
                            <tr 
                                key={user.id}
                                className="bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
                            >
                                <td className="py-3 px-4 first:rounded-l-lg font-medium text-gray-700">{idx + 1}</td>
                                <td className="py-3 px-4 font-bold text-gray-900">{user.fullName}</td>
                                <td className="py-3 px-4 text-gray-600 capitalize">{user.role}</td>
                                <td className={`py-3 px-4 font-bold uppercase text-[11px] text-green-500`}>
                                    Active
                                </td>
                                <td className="py-3 px-4 last:rounded-r-lg">
                                    <button className="text-purple-600 font-bold hover:underline">Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
