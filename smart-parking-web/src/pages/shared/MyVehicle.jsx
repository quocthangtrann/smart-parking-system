import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trash2, Plus, Bike, Car as CarIcon, X } from 'lucide-react';
import logoBk from '../../assets/logobk.png';
import { fetchAPI } from '../../api/config';

// Vehicles are now fetched from API

const Header = ({ onBack }) => (
    <header className="h-[77px] bg-[#210F7A] flex items-center px-[17px] shrink-0 z-10 shadow-md">
        <button onClick={onBack} className="p-1 mr-2 rounded hover:bg-white/10 transition-colors">
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

const ToggleSwitch = ({ isOn, onToggle }) => (
    <button 
        onClick={onToggle}
        className={`w-[44px] h-[24px] flex items-center rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-[#5C2FFF]' : 'bg-gray-300'}`}
    >
        <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-[20px]' : 'translate-x-0'}`} />
    </button>
);

export default function MyVehicle() {
    const navigate = useNavigate();
    const { state } = useLocation();
    // Resolve user from navigation state or localStorage fallback
    const user = state?.user ?? JSON.parse(localStorage.getItem('user') || 'null');

    const [vehicles, setVehicles] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);

    // Form State
    const [plate, setPlate] = useState('');
    const [type, setType] = useState('Motorbike');
    const [brand, setBrand] = useState('');
    const [owner, setOwner] = useState('Nguyen Van A');
    const [isDefault, setIsDefault] = useState(false);

    // FIX #5: load vehicles from API on mount, fall back to localStorage
    useEffect(() => {
        if (user?.id) {
            fetchAPI(`/vehicles/user/${user.id}`)
                .then(data => {
                    if (data.length > 0) {
                        setVehicles(data);
                    }
                })
                .catch(console.error);
        }
    }, []);

    const handleAddVehicle = async () => {
        if (!plate || !owner) return alert('License plate and Owner name are required.');

        try {
            // FIX #5: POST to backend API
            const newVehicle = await fetchAPI('/vehicles', {
                method: 'POST',
                body: JSON.stringify({
                    licensePlate: plate,
                    vehicleType: type,
                    brand,
                    isDefault: isDefault || vehicles.length === 0,
                    UserId: user?.id
                })
            });

            const updated = isDefault || vehicles.length === 0
                ? vehicles.map(v => ({ ...v, isDefault: false })).concat({ ...newVehicle, ownerName: owner })
                : [...vehicles, { ...newVehicle, ownerName: owner }];

            setVehicles(updated);
        } catch (err) {
            console.error(err);
            alert('Failed to add vehicle: ' + err.message);
        }

        setShowAddModal(false);
        setPlate(''); setBrand(''); setIsDefault(false);
    };

    const confirmDelete = async () => {
        if (!vehicleToDelete) return;
        try {
            // FIX #5: DELETE via backend API
            await fetchAPI(`/vehicles/${vehicleToDelete.id}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Delete failed, removing locally only:', err);
        }

        let newVehicles = vehicles.filter(v => v.id !== vehicleToDelete.id);
        if (vehicleToDelete.isDefault && newVehicles.length > 0) {
            newVehicles[0] = { ...newVehicles[0], isDefault: true };
        }
        setVehicles(newVehicles);
        setShowDeleteModal(false);
        setVehicleToDelete(null);
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
                        <span className="text-[#210F7A] font-bold">My Vehicle</span>
                    </div>

                    <div className="px-[16px] py-[12px]">
                        <h2 className="text-[18px] font-bold text-gray-900 mb-[16px]">Your registered vehicle</h2>

                        {/* Vehicle List */}
                        <div className="flex flex-col gap-[12px] mb-[24px]">
                            {vehicles.map(v => (
                                <div key={v.id} className="bg-white border border-gray-200 rounded-[12px] p-[16px] flex items-center justify-between shadow-sm hover:border-[#5C2FFF] transition-colors">
                                    <div className="flex items-center gap-[12px]">
                                        <div className="w-[40px] h-[40px] rounded-full bg-purple-50 flex items-center justify-center text-[#5C2FFF]">
                                            {v.type === 'Motorbike' ? <Bike size={20} /> : <CarIcon size={20} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[16px] font-bold text-gray-900">{v.licensePlate}</span>
                                                {v.isDefault && (
                                                    <span className="bg-[#5C2FFF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[12px] text-gray-500">{v.vehicleType} {v.brand ? `• ${v.brand}` : ''}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setVehicleToDelete(v); setShowDeleteModal(true); }}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Button */}
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="w-full h-[48px] border-2 border-[#5C2FFF] text-[#5C2FFF] font-bold text-[15px] rounded-[12px] flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors border-dashed"
                        >
                            <Plus size={18} />
                            Add new vehicle
                        </button>
                    </div>
                </div>

                {/* Bottom home-indicator bar */}
                <div className="shrink-0 h-7 bg-white flex items-center justify-center border-t border-gray-100 z-50">
                    <div className="w-24 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* MODALS */}
                
                {/* Add Vehicle Modal */}
                {showAddModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-[20px] animation-fade-in">
                        <div className="w-full bg-white rounded-[24px] shadow-xl overflow-hidden flex flex-col">
                            <div className="p-[20px] border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-[18px] font-bold text-gray-900">Register Vehicle</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
                            </div>
                            
                            <div className="p-[20px] flex flex-col gap-[16px]">
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1">License Plate Number *</label>
                                    <input 
                                        type="text" 
                                        value={plate} 
                                        onChange={e => setPlate(e.target.value)}
                                        placeholder="e.g. 51A-12345"
                                        className="w-full border border-gray-300 rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#5C2FFF]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-[12px]">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-700 mb-1">Vehicle Type</label>
                                        <select 
                                            value={type} 
                                            onChange={e => setType(e.target.value)}
                                            className="w-full border border-gray-300 rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#5C2FFF] bg-white"
                                        >
                                            <option value="Motorbike">Motorbike</option>
                                            <option value="Car">Car</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-700 mb-1">Brand</label>
                                        <input 
                                            type="text" 
                                            value={brand} 
                                            onChange={e => setBrand(e.target.value)}
                                            placeholder="e.g. Honda"
                                            className="w-full border border-gray-300 rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#5C2FFF]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1">Owner Name *</label>
                                    <input 
                                        type="text" 
                                        value={owner} 
                                        onChange={e => setOwner(e.target.value)}
                                        className="w-full border border-gray-300 rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#5C2FFF]"
                                    />
                                </div>

                                <div className="flex items-center justify-between mt-2 py-2 border-t border-gray-100">
                                    <span className="text-[14px] font-bold text-gray-900">Set as Default</span>
                                    <ToggleSwitch isOn={isDefault} onToggle={() => setIsDefault(!isDefault)} />
                                </div>
                            </div>
                            
                            <div className="p-[20px] bg-gray-50 flex gap-[12px]">
                                <button 
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-[12px] bg-white border border-gray-300 text-gray-700 font-bold rounded-[12px] hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddVehicle}
                                    className="flex-1 py-[12px] bg-[#5C2FFF] text-white font-bold rounded-[12px] hover:bg-purple-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirm Modal */}
                {showDeleteModal && vehicleToDelete && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-[30px] animation-fade-in">
                        <div className="w-full bg-white rounded-[24px] shadow-xl overflow-hidden flex flex-col p-[24px] items-center text-center">
                            <div className="w-[48px] h-[48px] bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-[16px]">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-[18px] font-bold text-gray-900 mb-[8px]">Delete Vehicle?</h3>
                            <p className="text-[14px] text-gray-600 mb-[24px]">
                                License Plate: <span className="font-bold text-gray-900">{vehicleToDelete.licensePlate}</span><br/>
                                This action cannot be undone.
                            </p>
                            
                            <div className="w-full flex gap-[12px]">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-[12px] bg-gray-100 text-gray-700 font-bold rounded-[12px] hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 py-[12px] bg-red-500 text-white font-bold rounded-[12px] hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                ::-webkit-scrollbar { display: none; }
                * { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animation-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
