import React, { useState } from 'react';
import { ArrowLeft, Send, Trash2, CheckCircle } from 'lucide-react';
import { fetchAPI } from '../../../api/config';

export default function NotificationForm({ onBack }) {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Alert',
        content: '',
        targetRole: 'All'
    });
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            setStatus({ type: 'error', message: 'Title and content are required' });
            return;
        }

        setIsLoading(true);
        setStatus(null);

        try {
            const response = await fetchAPI('/notifications/broadcast', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setStatus({ type: 'success', message: response.message || 'Notification sent successfully!' });
            setFormData({ title: '', type: 'Alert', content: '', targetRole: 'All' });
            setTimeout(() => setStatus(null), 5000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'Failed to send notification' });
        } finally {
            setIsLoading(false);
        }
    };

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

            {status && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {status.type === 'success' && <CheckCircle size={20} />}
                    {status.message}
                </div>
            )}

            <div className="flex flex-row justify-between w-full min-w-[1250px] gap-8 items-start mt-4">
                {/* LEFT COLUMN - FORM CONTENT */}
                <div className="w-1/2 flex flex-col gap-8 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Notification Content</h2>
                    
                    <div className="flex flex-col gap-6">
                        {/* Subject */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Subject / Title</label>
                            <input 
                                type="text" 
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter notification subject..." 
                                className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl outline-none focus:border-indigo-600 transition-all font-bold text-gray-800"
                            />
                        </div>

                        {/* Type Dropdown */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Notification Type</label>
                            <select 
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl outline-none focus:border-indigo-600 transition-all font-bold text-gray-800 appearance-none"
                            >
                                <option value="Error">Error</option>
                                <option value="Note">Note</option>
                                <option value="Alert">Alert</option>
                                <option value="Billing">Billing</option>
                            </select>
                        </div>

                        {/* Message Content */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Message Content</label>
                            <textarea 
                                value={formData.content}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                                placeholder="Write your message here..."
                                className="w-full bg-gray-50 border border-gray-100 py-4 px-6 rounded-xl outline-none focus:border-indigo-600 transition-all font-medium text-gray-700 min-h-[200px] resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - SETTINGS */}
                <div className="w-1/2 flex flex-col gap-8">
                    <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-8">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Delivery Settings</h2>
                        
                        <div className="flex flex-col gap-8">
                            {/* Target Audience */}
                            <div className="flex flex-col gap-4">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Target Role (Live Broadcast)</label>
                                <select 
                                    value={formData.targetRole}
                                    onChange={e => setFormData({...formData, targetRole: e.target.value})}
                                    className="bg-gray-50 py-4 px-6 rounded-xl border border-gray-100 outline-none text-sm font-bold w-full"
                                >
                                    <option value="All">All Users</option>
                                    <option value="Student">Students Only</option>
                                    <option value="Lecturer">Lecturers Only</option>
                                </select>
                                <p className="text-[12px] text-gray-500 font-medium mt-1">
                                    The selected users will receive a real-time push notification and the message will be saved to their inbox.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setFormData({ title: '', type: 'Alert', content: '', targetRole: 'All' })} 
                            className="flex-1 flex items-center justify-center gap-2 py-5 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            <Trash2 size={18} />
                            Reset
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`flex-[2] flex items-center justify-center gap-3 py-5 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            <Send size={18} />
                            {isLoading ? 'Broadcasting...' : 'Broadcast Notification'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
