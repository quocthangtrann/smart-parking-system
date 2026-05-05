import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, MapPin, AlertTriangle } from 'lucide-react';
import logoBk from '../../assets/logobk.png';

const MOCK_SESSION_IN_PROGRESS = {
    status: 'in_progress',
    hasAlert: false,
    plateNumber: '🏍 51A - XXXXX',
    duration: '3h 15m',
    entryTime: '08:30',
    exitTime: null,
    location: {
        parkingName: 'Parking 1',
        zone: 'Zone B6 - Slot 12'
    },
    timeline: [
        { time: '08:30', text: 'Enter Gate A - BK Campus 1' }
    ]
};

const MOCK_SESSION_FINISHED = {
    status: 'finished',
    hasAlert: false,
    plateNumber: '🚗 59B - 12345',
    duration: '8h 00m',
    entryTime: '16:30',
    exitTime: '18:30',
    location: {
        parkingName: 'Parking 1',
        zone: 'Zone B6 - Floor 1 - Slot 12'
    },
    timeline: [
        { time: '16:30', text: 'Enter at Gate A - BK Campus 1' },
        { time: '18:30', text: 'Exit' }
    ]
};

const MOCK_SESSION_ALERT = {
    status: 'finished',
    hasAlert: true,
    plateNumber: '🏍 51A - 99999',
    duration: '2h 15m',
    entryTime: '10:30',
    exitTime: '12:45',
    location: {
        parkingName: 'Parking 2',
        zone: 'Gate 1'
    },
    timeline: [
        { time: '10:30', text: 'Enter at Gate 1' },
        { time: '12:45', text: 'Exit' }
    ]
};

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

export default function SessionDetail() {
    const navigate = useNavigate();
    const { state } = useLocation();
    
    // For demo purposes, we cycle through the 3 states when the user clicks the menu icon
    const [sessionData, setSessionData] = useState(MOCK_SESSION_IN_PROGRESS); 
    
    const toggleState = () => {
        if (sessionData.status === 'in_progress') setSessionData(MOCK_SESSION_FINISHED);
        else if (sessionData.status === 'finished' && !sessionData.hasAlert) setSessionData(MOCK_SESSION_ALERT);
        else setSessionData(MOCK_SESSION_IN_PROGRESS);
    };

    const handleReport = () => {
        alert("Suspicious activity reported to security.");
    };

    return (
        <div className="min-h-screen bg-slate-300 flex items-center justify-center font-sans">
            <div
                className="relative flex flex-col bg-white overflow-hidden"
                style={{ width: 375, height: 812, borderRadius: 36, border: '8px solid #1e293b', boxShadow: '0 32px 80px rgba(0,0,0,0.45)' }}
            >
                <Header onBack={() => navigate(-1)} />

                <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col pb-[40px]">
                    {/* Breadcrumb & Menu */}
                    <div className="px-[16px] pt-[16px] pb-[16px] flex justify-between items-center">
                        <div className="text-[13px] text-gray-500 font-medium flex items-center gap-1">
                            <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-[#210F7A] transition-colors">Home</span>
                            <ChevronRight size={14} className="text-gray-400" />
                            <span className="text-[#210F7A] font-bold">Session Detail</span>
                        </div>
                        <button onClick={toggleState} className="p-1 text-gray-500 hover:text-[#210F7A]" title="Click to toggle states">
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* SESSION HEADER INFO */}
                    <div className="px-[16px] mb-[20px] flex justify-between items-center">
                        <div>
                            <h2 className="text-[24px] font-bold text-gray-900">{sessionData.plateNumber}</h2>
                            <p className="text-[14px] text-gray-500 font-medium">{sessionData.duration}</p>
                        </div>
                        <div>
                            <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                                sessionData.status === 'in_progress' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                            }`}>
                                {sessionData.status === 'in_progress' ? 'In progress' : 'Finished'}
                            </span>
                        </div>
                    </div>

                    {/* ALERT SECTION */}
                    {sessionData.hasAlert && (
                        <div className="mx-[16px] mb-[20px] bg-red-50 border-l-4 border-red-500 rounded-r-[8px] p-[12px] flex flex-col gap-2 shadow-sm">
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertTriangle size={18} />
                                <span className="font-bold text-[14px]">Alert: Unrecognized Activity</span>
                            </div>
                            <button 
                                onClick={handleReport}
                                className="self-start text-red-600 text-[13px] font-bold hover:underline"
                            >
                                Report suspicious
                            </button>
                        </div>
                    )}

                    {/* TIMELINE & CONTENT */}
                    <div className="px-[16px] flex-1">
                        <div className="relative pl-[16px]">
                            {/* Vertical Line */}
                            <div className="absolute left-[4px] top-[10px] bottom-[10px] w-[2px] bg-purple-200"></div>

                            {/* Timeline Items */}
                            {sessionData.status === 'in_progress' ? (
                                <>
                                    <div className="relative mb-[30px]">
                                        <div className="absolute left-[-16px] top-[6px] w-[10px] h-[10px] rounded-full border-[2px] border-[#5C2FFF] bg-white z-10"></div>
                                        <div className="flex justify-between items-center mb-[8px]">
                                            <h3 className="text-[14px] font-bold text-gray-900 flex items-center gap-1">
                                                <MapPin size={16} className="text-[#5C2FFF]" />
                                                Current Location
                                            </h3>
                                            <button onClick={() => window.open('https://maps.google.com', '_blank')} className="text-[13px] font-bold text-[#5C2FFF] hover:underline">
                                                Get Directions
                                            </button>
                                        </div>
                                        
                                        <div className="w-full h-[120px] bg-gray-200 rounded-[12px] shadow-sm mb-[12px] flex items-center justify-center overflow-hidden">
                                            {/* Image placeholder */}
                                            <div className="w-full h-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=10.772,106.658&zoom=15&size=400x120&key=MOCK')] bg-cover bg-center flex items-center justify-center opacity-50">
                                                <span className="text-gray-500 text-[12px] bg-white/80 px-2 py-1 rounded">Map Placeholder</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <p className="text-[14px] font-bold text-gray-900">{sessionData.location.parkingName}</p>
                                            <p className="text-[13px] text-gray-500">{sessionData.location.zone}</p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-[-16px] top-[4px] w-[10px] h-[10px] rounded-full border-[2px] border-[#5C2FFF] bg-white z-10"></div>
                                        <span className="text-[12px] font-bold text-gray-400">{sessionData.entryTime}</span>
                                        <p className="text-[14px] font-medium text-gray-800">{sessionData.timeline[0].text}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Exit Event */}
                                    <div className="relative mb-[30px]">
                                        <div className="absolute left-[-16px] top-[4px] w-[10px] h-[10px] rounded-full border-[2px] border-orange-500 bg-white z-10"></div>
                                        <p className="text-[14px] font-bold text-gray-900 mb-[8px]">{sessionData.exitTime} - Exit</p>
                                        
                                        <div className="bg-gray-100 rounded-[12px] p-[16px] border border-gray-200">
                                            <p className="text-[12px] text-gray-500 mb-1">Finished - Parking Location</p>
                                            <p className="text-[14px] font-bold text-gray-900">
                                                {sessionData.location.zone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Entry Event */}
                                    <div className="relative">
                                        <div className="absolute left-[-16px] top-[4px] w-[10px] h-[10px] rounded-full border-[2px] border-[#5C2FFF] bg-white z-10"></div>
                                        <p className="text-[14px] font-medium text-gray-600">
                                            {sessionData.entryTime} - {sessionData.timeline[0].text}
                                        </p>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="px-[16px] mt-auto pt-[20px]">
                        <button 
                            onClick={() => navigate('/digital-card')}
                            className="w-full h-[48px] bg-[#5C2FFF] text-white font-bold text-[15px] rounded-[12px] hover:bg-purple-700 transition-colors shadow-sm"
                        >
                            Go to Parking Card
                        </button>
                    </div>
                </div>

                <div className="shrink-0 h-7 bg-white flex items-center justify-center border-t border-gray-100 z-50">
                    <div className="w-24 h-1 bg-gray-300 rounded-full" />
                </div>
            </div>
            
            <style>{`
                ::-webkit-scrollbar { display: none; }
                * { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
