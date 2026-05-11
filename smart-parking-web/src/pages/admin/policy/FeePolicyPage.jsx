import React, { useState, useEffect } from 'react';
import { Save, Plus, Search, Tag, Calendar, DollarSign, Car, Clock, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchAPI } from '../../../api/config';

export default function FeePolicyPage() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    // Form State
    const [formData, setFormData] = useState({
        vehicleType: 'Motorbike',
        daytimeRate: '',
        eveningRate: '',
        timeThreshold: '18:00',
        effectiveFrom: '',
        effectiveTo: ''
    });

    useEffect(() => {
        loadPolicies();
    }, []);

    const loadPolicies = async () => {
        try {
            const data = await fetchAPI('/fee-policy');
            setPolicies(data);
        } catch (err) {
            console.error('Failed to load policies:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitStatus({ type: '', message: '' });

        try {
            // Validation
            const dayRate = parseInt(formData.daytimeRate, 10);
            const eveRate = parseInt(formData.eveningRate, 10);
            if (isNaN(dayRate) || dayRate < 0 || isNaN(eveRate) || eveRate < 0) {
                throw new Error("Please enter valid positive numbers for rates.");
            }
            if (!formData.effectiveFrom) {
                throw new Error("Please select an Effective From date.");
            }

            await fetchAPI('/fee-policy', {
                method: 'POST',
                body: JSON.stringify({
                    vehicleType: formData.vehicleType,
                    daytimeRate: dayRate,
                    eveningRate: eveRate,
                    timeThreshold: formData.timeThreshold,
                    effectiveFrom: formData.effectiveFrom,
                    effectiveTo: formData.effectiveTo || null
                })
            });

            setSubmitStatus({ type: 'success', message: 'Fee policy updated successfully!' });
            setFormData({
                vehicleType: 'Motorbike',
                daytimeRate: '',
                eveningRate: '',
                timeThreshold: '18:00',
                effectiveFrom: '',
                effectiveTo: ''
            });
            loadPolicies();
        } catch (err) {
            setSubmitStatus({ type: 'error', message: err.message || 'Error updating policy.' });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Ongoing';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
            
            <div className="flex items-center text-[13px] font-medium text-gray-400">
                <span>Home</span>
                <span className="mx-2 text-gray-300 font-normal">&gt;</span>
                <span className="text-gray-500 font-bold uppercase tracking-tighter">Fee Policy Management</span>
            </div>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Update Fee Policy</h1>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start">
                
                {/* LEFT COLUMN: Update Form */}
                <div className="flex-[2] flex flex-col gap-8 w-full">
                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-8">
                        
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Plus size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Add New Policy</h2>
                        </div>

                        {submitStatus.message && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 ${submitStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                                {submitStatus.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                                <p className="font-medium text-sm">{submitStatus.message}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3 md:col-span-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <Car size={14} /> Vehicle Type
                                </label>
                                <select 
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-800"
                                >
                                    <option value="Car">Car</option>
                                    <option value="Motorbike">Motorbike</option>
                                    <option value="Bicycle">Bicycle</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <DollarSign size={14} /> Daytime Rate (VND)
                                </label>
                                <input 
                                    type="number"
                                    name="daytimeRate"
                                    value={formData.daytimeRate}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 2000" 
                                    className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-800"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <DollarSign size={14} /> Evening / Weekend Rate (VND)
                                </label>
                                <input 
                                    type="number"
                                    name="eveningRate"
                                    value={formData.eveningRate}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 3000" 
                                    className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-800"
                                />
                            </div>

                            <div className="flex flex-col gap-3 md:col-span-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <Clock size={14} /> Time Threshold (Evening starts at)
                                </label>
                                <input 
                                    type="time"
                                    name="timeThreshold"
                                    value={formData.timeThreshold}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-800"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <Calendar size={14} /> Effective From
                                </label>
                                <input 
                                    type="date"
                                    name="effectiveFrom"
                                    value={formData.effectiveFrom}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-800"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <Calendar size={14} /> Effective To (Optional)
                                </label>
                                <input 
                                    type="date"
                                    name="effectiveTo"
                                    value={formData.effectiveTo}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 pt-6 border-t border-gray-100">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Save size={18} />
                                        Save & Apply Policy
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RIGHT COLUMN: Active Policies */}
                <div className="flex-1 w-full xl:w-[400px]">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6 sticky top-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Tag size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Current Active Policy</h3>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="p-6 rounded-xl border border-indigo-100 bg-indigo-50/50 flex flex-col gap-5">
                                <div className="flex justify-between items-center pb-3 border-b border-indigo-100/50">
                                    <span className="font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-md text-xs uppercase tracking-wider">
                                        HK252
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                                    </span>
                                </div>
                                
                                <div className="flex flex-col gap-4">
                                    {/* Motorbike Rules */}
                                    <div className="flex flex-col gap-2">
                                        <h4 className="text-[11px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                            <div className="w-5 h-5 bg-white rounded flex items-center justify-center shadow-sm">🏍️</div> Motorbike
                                        </h4>
                                        <div className="bg-white p-3 rounded-lg border border-indigo-50 flex flex-col gap-1.5 shadow-sm">
                                            <div className="flex justify-between items-center text-[13px]">
                                                <span className="text-gray-600 font-medium">Before 6:00 PM</span>
                                                <strong className="text-indigo-700">2,000 VND</strong>
                                            </div>
                                            <div className="flex justify-between items-center text-[13px]">
                                                <span className="text-gray-600 font-medium">After 6:00 PM & Sunday</span>
                                                <strong className="text-indigo-700">3,000 VND</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Car Rules */}
                                    <div className="flex flex-col gap-2">
                                        <h4 className="text-[11px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                            <div className="w-5 h-5 bg-white rounded flex items-center justify-center shadow-sm">🚗</div> Car
                                        </h4>
                                        <div className="bg-white p-3 rounded-lg border border-indigo-50 flex flex-col gap-1.5 shadow-sm">
                                            <div className="flex justify-between items-center text-[13px]">
                                                <span className="text-gray-600 font-medium">Before 6:00 PM</span>
                                                <strong className="text-indigo-700">10,000 VND</strong>
                                            </div>
                                            <div className="flex justify-between items-center text-[13px]">
                                                <span className="text-gray-600 font-medium">After 6:00 PM & Sunday</span>
                                                <strong className="text-indigo-700">20,000 VND</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 mt-1 pt-4 border-t border-indigo-100">
                                    <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                                        <Calendar size={14} className="text-indigo-500" />
                                        <span>Effective: <strong className="text-gray-800">Jan 2026 – Jun 2026</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
