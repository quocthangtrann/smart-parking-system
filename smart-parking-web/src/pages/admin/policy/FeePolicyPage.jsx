import React from 'react';
import { Bold, Italic, Underline, List, Link as LinkIcon, Image as ImageIcon, Save, Trash2, Plus, Search, Tag } from 'lucide-react';

export default function FeePolicyPage() {
    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
            
            {/* BREADCRUMB */}
            <div className="flex items-center text-[13px] font-medium text-gray-400">
                <span>Home</span>
                <span className="mx-2 text-gray-300 font-normal">&gt;</span>
                <span className="text-gray-500 font-bold uppercase tracking-tighter">Fee Policy</span>
            </div>

            {/* PAGE TITLE */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Fee Policy</h1>
                <div className="flex gap-4">
                    <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2">
                        <Trash2 size={18} />
                        Discard
                    </button>
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
                        <Save size={18} />
                        Save & Apply
                    </button>
                </div>
            </div>

            {/* FORM LAYOUT (2 COLUMNS) */}
            <div className="flex flex-row gap-8 items-start">
                
                {/* LEFT COLUMN (MAIN FORM) - Wider */}
                <div className="flex-[2] flex flex-col gap-8">
                    
                    {/* Basic Info Card */}
                    <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-8">
                        {/* Policy Name */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Policy Name</label>
                            <input 
                                type="text" 
                                placeholder="Semester 2, 2024" 
                                className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl outline-none focus:border-indigo-600 transition-all font-bold text-gray-800"
                            />
                        </div>

                        {/* Applicable to */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Applicable to</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['All', 'Motorcycles', 'Cars'].map(type => (
                                    <label key={type} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                                        <span className="text-sm font-bold text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Description (Rich Text) */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Description</label>
                            <div className="border border-gray-100 rounded-xl overflow-hidden focus-within:border-indigo-600 transition-all">
                                <div className="bg-gray-50 border-b border-gray-100 p-2 flex gap-1">
                                    <button className="p-2 hover:bg-white rounded-md text-gray-600 transition-all"><Bold size={18} /></button>
                                    <button className="p-2 hover:bg-white rounded-md text-gray-600 transition-all"><Italic size={18} /></button>
                                    <button className="p-2 hover:bg-white rounded-md text-gray-600 transition-all"><Underline size={18} /></button>
                                    <div className="w-[1px] bg-gray-200 mx-1"></div>
                                    <button className="p-2 hover:bg-white rounded-md text-gray-600 transition-all"><List size={18} /></button>
                                    <button className="p-2 hover:bg-white rounded-md text-gray-600 transition-all"><LinkIcon size={18} /></button>
                                </div>
                                <textarea 
                                    placeholder="Write policy details, rules, and conditions..."
                                    className="w-full py-4 px-6 outline-none min-h-[250px] resize-none text-gray-700 font-medium"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Media Card */}
                    <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-8">
                        <div className="grid grid-cols-2 gap-10">
                            {/* Payment Type */}
                            <div className="flex flex-col gap-4">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Payment Type</label>
                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-indigo-100 cursor-pointer transition-all">
                                        <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                                        </div>
                                        <span className="font-bold text-gray-800">Pay-per-entry</span>
                                    </label>
                                    <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-indigo-100 cursor-pointer transition-all">
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                        <span className="font-bold text-gray-500">One-time payment</span>
                                    </label>
                                </div>
                            </div>

                            {/* Images / Attachments */}
                            <div className="flex flex-col gap-4">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Images / Attachments</label>
                                <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-indigo-300 transition-all cursor-pointer group bg-gray-50/30">
                                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                        <Plus size={32} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">Add policy images or docs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (SETTINGS PANEL) - Narrower */}
                <div className="flex-1 flex flex-col gap-8">
                    
                    {/* Visibility Section */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                        <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Visibility</label>
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="font-bold text-emerald-700">Online</span>
                            <div className="w-12 h-6 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Storage & Inventory Section */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                        <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Storage & Inventory</label>
                        <div className="flex flex-col gap-4">
                            <input placeholder="SKU" className="w-full bg-gray-50 border border-gray-100 py-3 px-4 rounded-xl outline-none text-sm font-bold" />
                            <input placeholder="Barcode" className="w-full bg-gray-50 border border-gray-100 py-3 px-4 rounded-xl outline-none text-sm font-bold" />
                            <input placeholder="Weight (kg)" className="w-full bg-gray-50 border border-gray-100 py-3 px-4 rounded-xl outline-none text-sm font-bold" />
                        </div>
                        <label className="flex items-center gap-3 pt-2 cursor-pointer group">
                            <div className="w-5 h-5 rounded border-2 border-gray-200 group-hover:border-indigo-600 transition-colors"></div>
                            <span className="text-sm font-bold text-gray-600">Track inventory</span>
                        </label>
                    </div>

                    {/* Category & Vendors Section */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-8">
                        {/* Category */}
                        <div className="flex flex-col gap-4">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Category</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input placeholder="Search category..." className="w-full bg-gray-50 border border-gray-100 py-3 pl-10 pr-4 rounded-xl outline-none text-sm font-bold" />
                            </div>
                            <button className="w-full py-3 border-2 border-dashed border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2">
                                <Plus size={14} />
                                Add new category
                            </button>
                        </div>

                        {/* Vendors */}
                        <div className="flex flex-col gap-4">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Vendors</label>
                            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 min-h-[46px]">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                    Local
                                    <Plus className="rotate-45" size={12} />
                                </span>
                                <input className="flex-1 bg-transparent border-none outline-none text-xs font-bold min-w-[50px] px-2" />
                            </div>
                            <button className="w-full py-3 border-2 border-dashed border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2">
                                <Plus size={14} />
                                Add new vendor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
