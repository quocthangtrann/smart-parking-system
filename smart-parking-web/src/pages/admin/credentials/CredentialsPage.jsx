import React from 'react';
import { CreditCard, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import KPICard from '../devices/KPICard';
import RFIDTable from './RFIDTable';
import CredentialActions from './CredentialActions';

export default function CredentialsPage() {
    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 overflow-x-auto pb-10">
            
            {/* 1. BREADCRUMB */}
            <div className="flex items-center text-[13px] font-medium text-gray-400">
                <span>Home</span>
                <span className="mx-2 text-gray-300 font-normal">&gt;</span>
                <span className="text-gray-500 font-bold uppercase tracking-tighter">Credentials Cards</span>
            </div>

            {/* 2. KPI CARDS */}
            <div className="flex flex-row flex-nowrap gap-6 w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="All RFID cards" 
                        value="140" 
                        icon={CreditCard}
                        iconColor="text-indigo-600"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Cards activated" 
                        value="2" 
                        icon={CheckCircle}
                        iconColor="text-emerald-500"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="Deactivated cards" 
                        value="122" 
                        icon={XCircle}
                        iconColor="text-rose-500"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <KPICard 
                        title="New request" 
                        value="140" 
                        icon={UserPlus}
                        iconColor="text-amber-500"
                    />
                </div>
            </div>

            {/* 3. MAIN CONTENT (SAME HEIGHT SPLIT) */}
            <div className="flex flex-row justify-between w-full min-w-[1250px] gap-8 h-[600px] items-start mt-4">
                
                {/* LEFT: MAIN TABLE (50%) */}
                <div style={{ width: '606px', height: '594px' }} className="shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                    <RFIDTable />
                </div>

                {/* RIGHT: FILTER + HISTORY (50%) */}
                <div style={{ width: '610px', height: '594px' }} className="shrink-0 ml-auto">
                    <CredentialActions />
                </div>
            </div>
        </div>
    );
}
