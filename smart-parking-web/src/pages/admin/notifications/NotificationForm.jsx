import React from 'react';
import { ArrowLeft, Image as ImageIcon, Video, Send, Trash2 } from 'lucide-react';

export default function NotificationForm({ onBack }) {
    return (
        <div className="w-full flex flex-col gap-6 animate-in slide-in-from-right duration-500 overflow-x-hidden pb-10">
            {/* BREADCRUMB / BACK */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex items-center text-[13px] font-medium text-gray-400">
                    <span>Home</span>
                    <span className="mx-2 text-gray-300 font-normal">&gt;</span>
                    <span>Notifications</span>
                    <span className="mx-2 text-gray-300 font-normal">&gt;</span>
                    <span className="text-gray-900 font-bold uppercase tracking-tight">Create New Notification</span>
                </div>
            </div>

            <div className="flex flex-row justify-between w-full min-w-[1250px] gap-8 items-start mt-4">
                {/* LEFT COLUMN - FORM CONTENT */}
                <div className="w-1/2 flex flex-col gap-8 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Notification Content</h2>
                    
                    <div className="flex flex-col gap-6">
                        {/* Subject */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Subject</label>
                            <input 
                                type="text" 
                                placeholder="Enter notification subject..." 
                                className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl outline-none focus:border-indigo-600 transition-all font-bold text-gray-800"
                            />
                        </div>

                        {/* Type Dropdown */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Notification Type</label>
                            <select className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl outline-none focus:border-indigo-600 transition-all font-bold text-gray-800 appearance-none">
                                <option>Error</option>
                                <option>Note</option>
                                <option>Alert</option>
                            </select>
                        </div>

                        {/* Message Content */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Message Content</label>
                            <textarea 
                                placeholder="Write your message here..."
                                className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl outline-none focus:border-indigo-600 transition-all font-medium text-gray-700 min-h-[200px] resize-none"
                            ></textarea>
                        </div>

                        {/* Attachments */}
                        <div className="flex gap-4">
                            <button className="flex-1 flex items-center justify-center gap-3 py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all group">
                                <ImageIcon size={20} className="group-hover:scale-110 transition-transform" />
                                Upload Images
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-3 py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all group">
                                <Video size={20} className="group-hover:scale-110 transition-transform" />
                                Add Video Link
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - SETTINGS */}
                <div className="w-1/2 flex flex-col gap-8">
                    <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-8">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Delivery Settings</h2>
                        
                        <div className="flex flex-col gap-8">
                            {/* Priority */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Priority Level</label>
                                <div className="flex gap-4">
                                    <button className="flex-1 py-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-black text-[10px] uppercase tracking-widest">High</button>
                                    <button className="flex-1 py-3 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest">Normal</button>
                                    <button className="flex-1 py-3 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest">Low</button>
                                </div>
                            </div>

                            {/* Target Audience */}
                            <div className="flex flex-col gap-4">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Target Audience</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="User ID" className="bg-gray-50 py-4 px-6 rounded-xl border border-gray-100 outline-none text-sm font-bold" />
                                    <input placeholder="License Plate" className="bg-gray-50 py-4 px-6 rounded-xl border border-gray-100 outline-none text-sm font-bold" />
                                    <select className="bg-gray-50 py-4 px-6 rounded-xl border border-gray-100 outline-none text-sm font-bold col-span-2">
                                        <option>All Vehicle Types</option>
                                        <option>Motorbike</option>
                                        <option>Car</option>
                                    </select>
                                </div>
                            </div>

                            {/* Delivery Method */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Delivery Method</label>
                                <div className="flex gap-4">
                                    {['Push App', 'Email', 'SMS'].map(method => (
                                        <label key={method} className="flex-1 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                                            <span className="text-sm font-bold text-gray-700">{method}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Specific Parking Zones */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Specific Parking Zones</label>
                                <div className="flex gap-4">
                                    {['Parking A', 'Parking B', 'Parking C'].map(zone => (
                                        <label key={zone} className="flex-1 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                                            <span className="text-sm font-bold text-gray-700">{zone}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4">
                        <button onClick={onBack} className="flex-1 flex items-center justify-center gap-2 py-5 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                            <Trash2 size={18} />
                            Reset
                        </button>
                        <button className="flex-[2] flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                            <Send size={18} />
                            Applying Notification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
